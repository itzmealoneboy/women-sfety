import { useState, useEffect } from 'react'
import L from 'leaflet'
import { useLocationStore } from '../../../store/locationsstore'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Map from '../../../components/common/Map'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const EscapeRoutes = () => {
  const { currentLocation } = useLocationStore()
  const [activeRoute, setActiveRoute] = useState(null)
  const [routes, setRoutes] = useState([])
  const [dangerDetected, setDangerDetected] = useState(false)
  const [safetyScore, setSafetyScore] = useState(85)
  const [cctvCount, setCctvCount] = useState(12)

  useEffect(() => {
    generateEscapeRoutes()
    
    // Simulate danger detection
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setDangerDetected(true)
        toast.error('⚠️ Potential danger detected! Escape routes activated!', {
          duration: 5000,
          icon: '🚨'
        })
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const generateEscapeRoutes = () => {
    // Generate 3 escape routes with different safety levels
    const mockRoutes = [
      {
        id: 'safe',
        name: 'Safe Route',
        description: 'Well-lit • CCTV covered • Police presence',
        color: '#4CAF50',
        safetyScore: 95,
        time: 15,
        distance: 1.2,
        cctv: 8,
        police: 2,
        waypoints: [
          currentLocation,
          { lat: currentLocation.lat + 0.005, lng: currentLocation.lng + 0.003 },
          { lat: currentLocation.lat + 0.008, lng: currentLocation.lng + 0.006 },
          { lat: currentLocation.lat + 0.01, lng: currentLocation.lng + 0.008 }
        ]
      },
      {
        id: 'moderate',
        name: 'Moderate Route',
        description: 'Partially lit • Some CCTV • Quicker',
        color: '#ffa502',
        safetyScore: 75,
        time: 10,
        distance: 0.9,
        cctv: 4,
        police: 1,
        waypoints: [
          currentLocation,
          { lat: currentLocation.lat + 0.006, lng: currentLocation.lng + 0.004 },
          { lat: currentLocation.lat + 0.009, lng: currentLocation.lng + 0.007 }
        ]
      },
      {
        id: 'fast',
        name: 'Fast Route',
        description: 'Shortest • Fewer cameras • Some dark areas',
        color: '#ff4757',
        safetyScore: 55,
        time: 7,
        distance: 0.6,
        cctv: 1,
        police: 0,
        waypoints: [
          currentLocation,
          { lat: currentLocation.lat + 0.007, lng: currentLocation.lng + 0.005 },
          { lat: currentLocation.lat + 0.01, lng: currentLocation.lng + 0.007 }
        ]
      }
    ]

    setRoutes(mockRoutes)
  }

  const selectRoute = (routeId) => {
    setActiveRoute(routeId)
    toast.success(`${routes.find(r => r.id === routeId)?.name} selected`)
  }

  const startNavigation = () => {
    if (!activeRoute) {
      toast.error('Please select a route first')
      return
    }
    toast.success('Navigation started! Follow the highlighted path.')
  }

  const activeRouteData = routes.find(r => r.id === activeRoute)

  // Map markers and routes
  const mapMarkers = [
    {
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      popup: 'You are here',
      icon: L.divIcon({
        html: '<i class="fas fa-user-circle text-success" style="font-size: 30px;"></i>',
        iconSize: [30, 30]
      })
    }
  ]

  // Add destination marker if route selected
  if (activeRouteData) {
    const lastWaypoint = activeRouteData.waypoints[activeRouteData.waypoints.length - 1]
    mapMarkers.push({
      lat: lastWaypoint.lat,
      lng: lastWaypoint.lng,
      popup: 'Destination',
      icon: L.divIcon({
        html: '<i class="fas fa-flag-checkered text-danger" style="font-size: 30px;"></i>',
        iconSize: [30, 30]
      })
    })
  }

  return (
    <div className="space-y-6">
      {/* Danger Alert */}
      {dangerDetected && (
        <div className="bg-danger text-white p-4 rounded-lg animate-pulse">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <div>
              <h3 className="font-bold">⚠️ DANGER DETECTED!</h3>
              <p className="text-sm opacity-90">Escape routes activated. Choose a route immediately.</p>
            </div>
          </div>
        </div>
      )}

      {/* Safety Score Meter */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Current Area Safety</h3>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-danger via-warning to-success"
            style={{ width: '100%' }}
          />
          <div 
            className="absolute top-0 w-1 h-6 bg-black transform -translate-y-1"
            style={{ left: `${safetyScore}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-danger">Unsafe</span>
          <span className="text-warning">Moderate</span>
          <span className="text-success">Safe</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">{cctvCount}</p>
            <p className="text-xs text-gray-600">CCTV Cameras</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">{routes.length}</p>
            <p className="text-xs text-gray-600">Escape Routes</p>
          </div>
        </div>
      </Card>

      {/* Map with Routes */}
      <Card className="p-2">
        <Map
          center={currentLocation}
          markers={mapMarkers}
          height="300px"
          route={activeRouteData ? {
            waypoints: activeRouteData.waypoints,
            color: activeRouteData.color,
            showAlternatives: false
          } : null}
        />
      </Card>

      {/* Route Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route) => (
          <Card
            key={route.id}
            className={`cursor-pointer transition-all ${
              activeRoute === route.id ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{ ringColor: route.color }}
            onClick={() => selectRoute(route.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-3 h-3 rounded-full mt-1"
                style={{ backgroundColor: route.color }}
              />
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                route.safetyScore >= 80 ? 'bg-success/10 text-success' :
                route.safetyScore >= 60 ? 'bg-warning/10 text-warning' :
                'bg-danger/10 text-danger'
              }`}>
                {route.safetyScore}% Safe
              </span>
            </div>

            <h3 className="font-semibold">{route.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{route.description}</p>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <ClockIcon className="w-4 h-4 mx-auto text-gray-500" />
                <p className="text-xs mt-1">{route.time} min</p>
              </div>
              <div className="text-center">
                <MapPinIcon className="w-4 h-4 mx-auto text-gray-500" />
                <p className="text-xs mt-1">{route.distance} km</p>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="w-4 h-4 mx-auto text-gray-500" />
                <p className="text-xs mt-1">{route.cctv} CCTV</p>
              </div>
            </div>

            {activeRoute === route.id && (
              <Button
                variant="success"
                size="sm"
                className="w-full mt-3"
                onClick={startNavigation}
              >
                <ArrowRightIcon className="w-4 h-4 mr-1" />
                Start Navigation
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Safety Tips */}
      <Card className="bg-primary-50 border border-primary-200">
        <h3 className="font-semibold text-primary-800 mb-2">Escape Route Tips</h3>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Always choose routes with CCTV coverage</li>
          <li>• Stay on main roads with good lighting</li>
          <li>• Keep phone ready to dial 100</li>
          <li>• Share your route with emergency contacts</li>
          <li>• Trust your instincts - if it feels unsafe, change route</li>
        </ul>
      </Card>
    </div>
  )
}

export default EscapeRoutes

