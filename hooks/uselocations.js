import { useEffect, useState } from 'react';
import { useLocationStore } from '../store/locationsstore';
import { calculateDistance, reverseGeocode, formatCoordinates } from '../utils/geoUtils';

export const useLocation = () => {
  const {
    currentLocation,
    previousLocation,
    trackingActive,
    locationHistory,
    error,
    address,
    nearbyPlaces,
    getCurrentLocation,
    startTracking,
    stopTracking,
    getNearbyPlaces,
    getAllNearbyPlaces,
    calculateSafetyScore
  } = useLocationStore();

  const [watchPosition, setWatchPosition] = useState(null);

  // Start watching position
  useEffect(() => {
    if (trackingActive) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Update location in store
          useLocationStore.getState().getCurrentLocation();
        },
        (error) => {
          console.error('Watch position error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );

      setWatchPosition(watchId);

      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, [trackingActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchPosition) {
        navigator.geolocation.clearWatch(watchPosition);
      }
    };
  }, [watchPosition]);

  // Get distance to point
  const getDistanceTo = (lat, lng) => {
    if (!currentLocation) return null;
    return calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      lat,
      lng
    );
  };

  // Get formatted current location
  const getFormattedLocation = (format = 'decimal') => {
    if (!currentLocation) return 'Location unavailable';
    return formatCoordinates(
      currentLocation.lat,
      currentLocation.lng,
      format
    );
  };

  // Get location age
  const getLocationAge = () => {
    if (!currentLocation?.timestamp) return null;
    return Date.now() - currentLocation.timestamp;
  };

  // Check if location is recent (less than 1 minute old)
  const isLocationRecent = () => {
    const age = getLocationAge();
    return age !== null && age < 60000;
  };

  // Get nearby police stations
  const getNearbyPolice = async (radius = 2000) => {
    return await getNearbyPlaces('police', radius);
  };

  // Get nearby hospitals
  const getNearbyHospitals = async (radius = 2000) => {
    return await getNearbyPlaces('hospital', radius);
  };

  // Get nearby ATMs
  const getNearbyATMs = async (radius = 2000) => {
    return await getNearbyPlaces('atm', radius);
  };

  // Get nearby pharmacies
  const getNearbyPharmacies = async (radius = 2000) => {
    return await getNearbyPlaces('pharmacy', radius);
  };

  // Get nearby shelters
  const getNearbyShelters = async (radius = 2000) => {
    return await getNearbyPlaces('shelter', radius);
  };

  // Get safety score for current location
  const getSafetyScore = () => {
    return calculateSafetyScore();
  };

  // Get location address
  const getAddress = async () => {
    if (!currentLocation) return null;
    
    if (address) return address;
    
    const result = await reverseGeocode(
      currentLocation.lat,
      currentLocation.lng
    );
    
    return result;
  };

  // Share location
  const shareLocation = async (method = 'copy') => {
    if (!currentLocation) return null;

    const locationUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
    const message = `📍 My current location: ${locationUrl}`;

    switch (method) {
      case 'copy':
        await navigator.clipboard.writeText(locationUrl);
        return { success: true, method: 'copy' };

      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        return { success: true, method: 'whatsapp' };

      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(locationUrl)}`, '_blank');
        return { success: true, method: 'telegram' };

      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
        return { success: true, method: 'sms' };

      default:
        return { success: false, error: 'Invalid sharing method' };
    }
  };

  return {
    // State
    currentLocation,
    previousLocation,
    trackingActive,
    locationHistory,
    error,
    address,
    nearbyPlaces,
    
    // Getters
    getDistanceTo,
    getFormattedLocation,
    getLocationAge,
    isLocationRecent,
    getSafetyScore,
    getAddress,
    
    // Nearby places
    getNearbyPolice,
    getNearbyHospitals,
    getNearbyATMs,
    getNearbyPharmacies,
    getNearbyShelters,
    getAllNearbyPlaces,
    
    // Actions
    getCurrentLocation,
    startTracking,
    stopTracking,
    shareLocation
  };
};

