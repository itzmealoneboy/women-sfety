import { useState, useEffect } from 'react'
import L from 'leaflet'
import { useLocationStore } from '../../../store/locationsstore'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Map from '../../../components/common/Map'
import { 
  ShieldCheckIcon,
  BuildingLibraryIcon,
  HeartIcon,
  CreditCardIcon,
  BeakerIcon,
  HomeIcon,
  ChartBarIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SafetyZones = () => {
  const { currentLocation } = useLocationStore()
  const [zones, setZones] = useState({
    police: [],
    hospital: [],
    atm: [],
    pharmacy: [],
    shelter: []
  })
  const [selectedZone, setSelectedZone] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalZones: 0,
    avgSafetyScore: 0,
    cctvCount: 0
  })

  useEffect(() => {
    loadSafetyZones()
  }, [])

  const loadSafetyZones = async () => {
    setLoading(true)
    
    // Simulate API call to get safety zones
    setTimeout(() => {
      const mockZones = {
        police: generateMockZones('police', 5),
        hospital: generateMockZones('hospital', 4),
        atm: generateMockZones('atm', 8),
        pharmacy: generateMockZones('pharmacy', 6),
        shelter: generateMockZones('shelter', 3)
      }
      
      setZones(mockZones)
      
      // Calculate stats
      const total = Object.values(mockZones).flat().length
      const safetyScore = Math.floor(Math.random() * 30) + 70
      const cctv = Math.floor(Math.random() * 20) + 10
      
      setStats({
        totalZones: total,
        avgSafetyScore: safetyScore,
        cctvCount: cctv
      })
      
      setLoading(false)
    }, 1500)
  }

  const generateMockZones = (type, count) => {
    const zones = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI
      const distance = (Math.random() * 0.02 + 0.005)
      
      zones.push({
        id: `${type}-${i}`,
        name: getZoneName(type, i),
        type,
        lat: currentLocation.lat + distance * Math.cos(angle),
        lng: currentLocation.lng + distance * Math.sin(angle),
        address: `${type} address, Main Road`,
        phone: getZonePhone(type),
        rating: Math.floor(Math.random() * 5) + 1,
        safetyScore: Math.floor(Math.random() * 30) + 70,
        cctv: Math.random() > 0.3,
        womenOnly: type === 'shelter' ? true : Math.random() > 0.7,
        distance: (distance * 111300).toFixed(0)
      })
    }
    return zones
  }

  const getZoneName = (type, index) => {
    const names = {
      police: ['T Nagar Police Station', 'Anna Nagar Police Station', 'Nungambakkam Police Station', 'Koyambedu Police Station', 'Mylapore Police Station'],
      hospital: ['Government General Hospital', 'Apollo Hospital', 'MIOT International', 'Kauvery Hospital'],
      atm: ['SBI ATM', 'HDFC ATM', 'ICICI ATM', 'Axis ATM', 'Canara ATM', 'Yes Bank ATM', 'Kotak ATM', 'IndusInd ATM'],
      pharmacy: ['Apollo Pharmacy', 'MedPlus', 'Netmeds', 'Wellness Forever', 'MedLife', 'Pharmacy Express'],
      shelter: ['Women Shelter Home', 'Sakhi Center', 'Short Stay Home']
    }
    return names[type][index % names[type].length]
  }

  const getZonePhone = (type) => {
    const phones = {
      police: '100',
      hospital: '108',
      atm: '1800-123-4567',
      pharmacy: '044-12345678',
      shelter: '044-98765432'
    }
    return phones[type]
  }

  const getZoneIcon = (type) => {
    switch(type) {
      case 'police': return BuildingLibraryIcon
      case 'hospital': return HeartIcon
      case 'atm': return CreditCardIcon
      case 'pharmacy': return BeakerIcon
      case 'shelter': return HomeIcon
      default: return ShieldCheckIcon
    }
  }

  const getZoneColor = (type) => {
    switch(type) {
      case 'police': return 'text-danger'
      case 'hospital': return 'text-success'
      case 'atm': return 'text-warning'
      case 'pharmacy': return 'text-primary-500'
      case 'shelter': return 'text-secondary-500'
      default: return 'text-gray-500'
    }
  }

  const getZoneBgColor = (type) => {
    switch(type) {
      case 'police': return 'bg-danger/10'
      case 'hospital': return 'bg-success/10'
      case 'atm': return 'bg-warning/10'
      case 'pharmacy': return 'bg-primary-500/10'
      case 'shelter': return 'bg-secondary-500/10'
      default: return 'bg-gray-100'
    }
  }

  // Prepare map markers
  const allZones = Object.values(zones).flat()
  const mapMarkers = [
    {
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      popup: 'You are here',
      icon: L.divIcon({
        html: '<i class="fas fa-user-circle text-success" style="font-size: 30px;"></i>',
        iconSize: [30, 30]
      })
    },
    ...allZones.map(zone => ({
      lat: zone.lat,
      lng: zone.lng,
      popup: `
        <strong>${zone.name}</strong><br>
        Safety Score: ${zone.safetyScore}%<br>
        ${zone.womenOnly ? '👩 Women Only' : ''}<br>
        ${zone.cctv ? '📹 CCTV Available' : ''}
      `,
      icon: L.divIcon({
        html: `<i class="fas ${zone.type === 'police' ? 'fa-building-shield' : 
                               zone.type === 'hospital' ? 'fa-hospital' :
                               zone.type === 'atm' ? 'fa-credit-card' :
                               zone.type === 'pharmacy' ? 'fa-prescription' :
                               'fa-home'}" style="color: ${
                                 zone.type === 'police' ? '#ff4757' :
                                 zone.type === 'hospital' ? '#4CAF50' :
                                 zone.type === 'atm' ? '#f39c12' :
                                 zone.type === 'pharmacy' ? '#3498db' :
                                 '#9b59b6'
                               }; font-size: 24px;"></i>`,
        iconSize: [24, 24]
      })
    }))
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Safety Zones</p>
              <p className="text-3xl font-bold mt-1">{stats.totalZones}</p>
            </div>
            <ShieldCheckIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Safety Score</p>
              <p className="text-3xl font-bold mt-1">{stats.avgSafetyScore}%</p>
            </div>
            <ChartBarIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">CCTV Cameras</p>
              <p className="text-3xl font-bold mt-1">{stats.cctvCount}</p>
            </div>
            <CameraIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Map */}
      <Card className="p-2">
        <Map
          center={currentLocation}
          markers={mapMarkers}
          height="350px"
        />
      </Card>

      {/* Zone Type Summary */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(zones).map(([type, zoneList]) => {
          const Icon = getZoneIcon(type)
          const colorClass = getZoneColor(type)
          const bgClass = getZoneBgColor(type)
          
          return (
            <button
              key={type}
              onClick={() => setSelectedZone(selectedZone === type ? null : type)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedZone === type ? bgClass + ' ring-2 ring-offset-2 ' + colorClass.replace('text', 'ring') : 'bg-gray-50'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-1 ${colorClass}`} />
              <p className="text-xs font-medium capitalize">{type}</p>
              <p className="text-lg font-bold text-gray-700">{zoneList.length}</p>
            </button>
          )
        })}
      </div>

      {/* Zones List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading safety zones...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(selectedZone ? zones[selectedZone] : allZones).map((zone) => {
            const Icon = getZoneIcon(zone.type)
            const colorClass = getZoneColor(zone.type)
            const bgClass = getZoneBgColor(zone.type)

            return (
              <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{zone.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{zone.address}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          zone.safetyScore >= 80 ? 'bg-success/10 text-success' :
                          zone.safetyScore >= 60 ? 'bg-warning/10 text-warning' :
                          'bg-danger/10 text-danger'
                        }`}>
                          {zone.safetyScore}% Safe
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {zone.distance}m away
                      </span>
                      {zone.cctv && (
                        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                          📹 CCTV
                        </span>
                      )}
                      {zone.womenOnly && (
                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                          👩 Women Only
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < zone.rating ? 'text-warning' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(`https://maps.google.com/?q=${zone.lat},${zone.lng}`)
                        }}
                      >
                        Navigate
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SafetyZones

