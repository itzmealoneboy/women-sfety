import axios from 'axios';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v1';

const geoapifyClient = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: GEOAPIFY_API_KEY
  }
});

export const geoapifyService = {
  // Geocode address
  geocode: async (address) => {
    try {
      const response = await geoapifyClient.get('/geocode/search', {
        params: { text: address }
      });
      
      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        return {
          success: true,
          data: {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            formatted: feature.properties.formatted,
            address: feature.properties
          }
        };
      }
      return { success: false, error: 'Address not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reverse geocode
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await geoapifyClient.get('/geocode/reverse', {
        params: { lat, lon: lng }
      });
      
      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        return {
          success: true,
          data: {
            formatted: feature.properties.formatted,
            address: feature.properties
          }
        };
      }
      return { success: false, error: 'Location not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get nearby places
  nearbyPlaces: async (lat, lng, categories, radius = 2000) => {
    try {
      const categoriesStr = Array.isArray(categories) ? categories.join(',') : categories;
      
      const response = await geoapifyClient.get('/places', {
        params: {
          categories: categoriesStr,
          filter: `circle:${lng},${lat},${radius}`,
          limit: 20
        }
      });
      
      return {
        success: true,
        data: response.data.features.map(feature => ({
          id: feature.properties.place_id,
          name: feature.properties.name,
          address: feature.properties.formatted,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          distance: feature.properties.distance,
          category: feature.properties.categories?.[0],
          phone: feature.properties.contact?.phone,
          website: feature.properties.contact?.website,
          openingHours: feature.properties.opening_hours
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get route
  getRoute: async (startLat, startLng, endLat, endLng, mode = 'drive') => {
    try {
      const response = await geoapifyClient.get('/routing', {
        params: {
          waypoints: `${startLat},${startLng}|${endLat},${endLng}`,
          mode: mode
        }
      });
      
      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        const properties = feature.properties;
        
        return {
          success: true,
          data: {
            distance: properties.distance,
            time: properties.time,
            geometry: feature.geometry,
            instructions: properties.legs?.[0]?.steps || []
          }
        };
      }
      return { success: false, error: 'Route not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get matrix (distance/time between multiple points)
  getMatrix: async (points, mode = 'drive') => {
    try {
      const locations = points.map(p => `${p.lat},${p.lng}`).join('|');
      
      const response = await geoapifyClient.get('/matrix', {
        params: {
          locations,
          mode
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get isochrone (reachable area within time)
  getIsochrone: async (lat, lng, time, mode = 'drive') => {
    try {
      const response = await geoapifyClient.get('/isochrones', {
        params: {
          lat,
          lon: lng,
          type: 'time',
          mode,
          range: time * 60 // Convert to seconds
        }
      });
      
      return {
        success: true,
        data: response.data.features
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search for specific places
  searchPlaces: async (query, lat, lng, radius = 5000) => {
    try {
      const response = await geoapifyClient.get('/places', {
        params: {
          text: query,
          filter: `circle:${lng},${lat},${radius}`,
          limit: 20
        }
      });
      
      return {
        success: true,
        data: response.data.features.map(feature => ({
          id: feature.properties.place_id,
          name: feature.properties.name,
          address: feature.properties.formatted,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          distance: feature.properties.distance,
          category: feature.properties.categories?.[0]
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get address autocomplete
  autocomplete: async (text, lat, lng) => {
    try {
      const params = { text };
      if (lat && lng) {
        params.filter = `circle:${lng},${lat},5000`;
        params.bias = `proximity:${lng},${lat}`;
      }
      
      const response = await geoapifyClient.get('/geocode/autocomplete', { params });
      
      return {
        success: true,
        data: response.data.features.map(feature => ({
          formatted: feature.properties.formatted,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get timezone
  getTimezone: async (lat, lng) => {
    try {
      const response = await geoapifyClient.get('/timezone', {
        params: { lat, lon: lng }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get elevation
  getElevation: async (lat, lng) => {
    try {
      const response = await geoapifyClient.get('/elevation', {
        params: { lat, lon: lng }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get weather (if available)
  getWeather: async (lat, lng) => {
    // Note: Geoapify might not provide weather directly
    // This is a placeholder for integration with weather service
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      
      return {
        success: true,
        data: {
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          windSpeed: data.wind.speed
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
