import { useState, useEffect } from 'react'
import L from 'leaflet'
import { useLocationStore } from '../../../store/locationsstore'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Map from '../../../components/common/Map'
import { 
  BuildingLibraryIcon,
  HeartIcon,
  CreditCardIcon,
  BeakerIcon,
  HomeIcon,
  PhoneIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const NearbyPlaces = () => {
  const { currentLocation, getNearbyPlaces } = useLocationStore()
  const [places, setPlaces] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const placeTypes = [
    { id: 'police', name: 'Police', icon: BuildingLibraryIcon, color: 'bg-danger' },
    { id: 'hospital', name: 'Hospital', icon: HeartIcon, color: 'bg-success' },
    { id: 'atm', name: 'ATM', icon: CreditCardIcon, color: 'bg-warning' },
    { id: 'pharmacy', name: 'Pharmacy', icon: BeakerIcon, color: 'bg-primary-500' },
    { id: 'shelter', name: 'Shelter', icon: HomeIcon, color: 'bg-secondary-500' }
  ]

  useEffect(() => {
    if (currentLocation?.lat && currentLocation?.lng) {
      loadAllPlaces()
    }
  }, [currentLocation])

  const buildGoogleMapsDirectionsUrl = (lat, lng) => {
    const keyParam = googleMapsApiKey ? `&key=${googleMapsApiKey}` : ''
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${keyParam}`
  }

  const loadAllPlaces = async () => {
    if (!currentLocation?.lat || !currentLocation?.lng) {
      return
    }

    setLoading(true)
    const allPlaces = []

    for (const type of placeTypes) {
      const results = await getNearbyPlaces(type.id, currentLocation.lat, currentLocation.lng)
      allPlaces.push(...results.map(place => ({ ...place, placeType: type.id })))
    }

    // Sort by distance
    allPlaces.sort((a, b) => {
      const distA = getDistance(
        currentLocation.lat, currentLocation.lng,
        a.geometry.coordinates[1], a.geometry.coordinates[0]
      )
      const distB = getDistance(
        currentLocation.lat, currentLocation.lng,
        b.geometry.coordinates[1], b.geometry.coordinates[0]
      )
      return distA - distB
    })

    setPlaces(allPlaces)
    setLoading(false)
  }

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lon2-lon1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  const getPlaceIcon = (type) => {
    const placeType = placeTypes.find(t => t.id === type)
    return placeType?.icon || BuildingLibraryIcon
  }

  const getPlaceColor = (type) => {
    const placeType = placeTypes.find(t => t.id === type)
    return placeType?.color || 'bg-gray-500'
  }

  const filteredPlaces = filter === 'all' 
    ? places 
    : places.filter(p => p.placeType === filter)

  // Map markers
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
    ...filteredPlaces.slice(0, 10).map(place => ({
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
      popup: place.properties.name || place.placeType,
      icon: L.divIcon({
        html: `<i class="fas ${place.placeType === 'police' ? 'fa-building-shield' : 
                               place.placeType === 'hospital' ? 'fa-hospital' :
                               place.placeType === 'atm' ? 'fa-credit-card' :
                               place.placeType === 'pharmacy' ? 'fa-prescription' :
                               'fa-home'}" style="color: ${
                                 place.placeType === 'police' ? '#ff4757' :
                                 place.placeType === 'hospital' ? '#4CAF50' :
                                 place.placeType === 'atm' ? '#f39c12' :
                                 place.placeType === 'pharmacy' ? '#3498db' :
                                 '#9b59b6'
                               }; font-size: 24px;"></i>`,
        iconSize: [24, 24]
      })
    }))
  ]

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Places
        </button>
        {placeTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setFilter(type.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
              filter === type.id
                ? `${type.color} text-white`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <type.icon className="w-4 h-4" />
            {type.name}
          </button>
        ))}
      </div>

      {/* Map */}
      <Card className="p-2">
        <Map
          center={currentLocation}
          markers={mapMarkers}
          height="300px"
        />
      </Card>

      {/* Places List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading nearby places...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlaces.map((place, index) => {
            const distance = getDistance(
              currentLocation.lat, currentLocation.lng,
              place.geometry.coordinates[1], place.geometry.coordinates[0]
            ).toFixed(0)
            
            const Icon = getPlaceIcon(place.placeType)
            const colorClass = getPlaceColor(place.placeType)

            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{place.properties.name || place.placeType}</h3>
                    <p className="text-sm text-gray-600 mt-1">{place.properties.address || 'Address available'}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {distance}m away
                      </span>
                      {place.properties.phone && (
                        <span className="text-xs text-gray-500">{place.properties.phone}</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(buildGoogleMapsDirectionsUrl(place.geometry.coordinates[1], place.geometry.coordinates[0]))
                        }}
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                        Navigate
                      </Button>
                      {place.properties.phone && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => window.location.href = `tel:${place.properties.phone}`}
                        >
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      )}
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

export default NearbyPlaces

