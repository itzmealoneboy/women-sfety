const axios = require('axios');
const logger = require('../utils/logger');
const { setCache, getCache } = require('../config/redis');

const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const cacheKey = `geocode:${latitude}:${longitude}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return cached;
        }

        // Using OpenStreetMap Nominatim (free) - replace with Google Maps in production
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );

        const data = response.data;
        const address = {
            formattedAddress: data.display_name,
            street: data.address.road || data.address.pedestrian,
            city: data.address.city || data.address.town || data.address.village,
            state: data.address.state,
            country: data.address.country,
            pincode: data.address.postcode
        };

        await setCache(cacheKey, address, 86400); // Cache for 24 hours

        return address;
    } catch (error) {
        logger.error('Geocoding error:', error);
        return {
            formattedAddress: `${latitude}, ${longitude}`,
            city: 'Unknown',
            state: 'Unknown'
        };
    }
};

const calculateDistance = async (originLat, originLng, destLat, destLng, mode = 'driving') => {
    try {
        // Using OpenStreetMap Routing (OSRM) - replace with Google Maps in production
        const response = await axios.get(
            `http://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`
        );

        const route = response.data.routes[0];
        return {
            distance: route.distance / 1000, // Convert to kilometers
            duration: route.duration / 60, // Convert to minutes
            mode
        };
    } catch (error) {
        logger.error('Distance calculation error:', error);
        // Fallback to haversine formula
        const distance = haversineDistance(originLat, originLng, destLat, destLng);
        const duration = distance * 2; // Assume 30 km/h average speed
        return { distance, duration, mode };
    }
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getNearbyServices = async (latitude, longitude, radius = 5) => {
    try {
        // In production, use Google Places API or similar
        // This is a mock implementation
        const services = {
            police: [],
            hospitals: [],
            womensHelpline: [],
            safeHouses: []
        };

        // Mock data - replace with actual API calls
        services.police = [
            {
                name: "Local Police Station",
                distance: 1.2,
                phone: "100",
                address: "Nearby Area"
            }
        ];

        services.hospitals = [
            {
                name: "City Hospital",
                distance: 2.5,
                phone: "102",
                address: "Main Road"
            }
        ];

        services.womensHelpline = [
            {
                name: "Women's Helpline Center",
                distance: 3.0,
                phone: "1091",
                address: "Downtown"
            }
        ];

        return services;
    } catch (error) {
        logger.error('Nearby services error:', error);
        return { police: [], hospitals: [], womensHelpline: [], safeHouses: [] };
    }
};

module.exports = {
    getAddressFromCoordinates,
    calculateDistance,
    getNearbyServices
};