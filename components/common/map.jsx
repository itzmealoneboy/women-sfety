import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'

const Map = ({
  center,
  zoom = 13,
  markers = [],
  route = null,
  onMapClick,
  className = '',
  height = '400px'
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const routingRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([center.lat, center.lng], zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)

    // Add click handler
    if (onMapClick) {
      mapInstanceRef.current.on('click', (e) => {
        onMapClick(e.latlng)
      })
    }

    return () => {
      mapInstanceRef.current?.remove()
    }
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach(marker => {
      const leafletMarker = L.marker([marker.lat, marker.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(marker.popup)

      if (marker.icon) {
        leafletMarker.setIcon(marker.icon)
      }

      markersRef.current.push(leafletMarker)
    })
  }, [markers])

  // Update route
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing route
    if (routingRef.current) {
      mapInstanceRef.current.removeControl(routingRef.current)
      routingRef.current = null
    }

    // Add new route
    if (route && route.waypoints.length >= 2) {
      routingRef.current = L.Routing.control({
        waypoints: route.waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
        routeWhileDragging: false,
        showAlternatives: route.showAlternatives || false,
        lineOptions: {
          styles: [{
            color: route.color || '#667eea',
            opacity: 0.8,
            weight: 6
          }]
        }
      }).addTo(mapInstanceRef.current)

      if (route.callback) {
        routingRef.current.on('routesfound', route.callback)
      }
    }
  }, [route])

  // Update center
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView([center.lat, center.lng])
    }
  }, [center])

  return <div ref={mapRef} className={`w-full rounded-xl ${className}`} style={{ height }} />
}

export default Map
