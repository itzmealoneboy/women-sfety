// src/components/common/Map.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Map = ({
  center = [13.0827, 80.2707],
  zoom = 15,
  markers = [],
  onMapClick,
  height = '400px',
  width = '100%'
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Add click handler
    if (onMapClick) {
      mapInstanceRef.current.on('click', (e) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency - only once

  // Update view when center changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Handle markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove old markers
    Object.keys(markersRef.current).forEach(key => {
      if (mapInstanceRef.current.hasLayer(markersRef.current[key])) {
        mapInstanceRef.current.removeLayer(markersRef.current[key]);
      }
      delete markersRef.current[key];
    });

    // Add new markers
    markers.forEach(marker => {
      const key = marker.id || `${marker.lat}-${marker.lng}`;

      const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(mapInstanceRef.current);

      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup);
      }

      if (marker.onClick) {
        leafletMarker.on('click', () => marker.onClick(marker));
      }

      markersRef.current[key] = leafletMarker;
    });
  }, [markers]);

  return (
    <div
      ref={mapRef}
      style={{
        height,
        width,
        borderRadius: '12px',
        zIndex: 1,
        backgroundColor: '#f0f0f0'
      }}
    />
  );
};

export default Map;