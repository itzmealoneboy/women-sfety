export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const λ1 = lon1 * Math.PI / 180;
  const λ2 = lon2 * Math.PI / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  return (θ * 180 / Math.PI + 360) % 360;
};

export const getCardinalDirection = (bearing) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

export const isWithinRadius = (point1, point2, radius) => {
  return calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng) <= radius;
};

export const formatCoordinates = (lat, lng, format = 'decimal') => {
  if (format === 'dms') {
    const absLat = Math.abs(lat);
    const absLng = Math.abs(lng);
    const latDeg = Math.floor(absLat);
    const latMin = Math.floor((absLat - latDeg) * 60);
    const latSec = ((absLat - latDeg - latMin / 60) * 3600).toFixed(1);
    const lngDeg = Math.floor(absLng);
    const lngMin = Math.floor((absLng - lngDeg) * 60);
    const lngSec = ((absLng - lngDeg - lngMin / 60) * 3600).toFixed(1);
    return `${latDeg}°${latMin}'${latSec}"${lat >= 0 ? 'N' : 'S'} ${lngDeg}°${lngMin}'${lngSec}"${lng >= 0 ? 'E' : 'W'}`;
  }
  return `${lat.toFixed(6)}°${lat >= 0 ? 'N' : 'S'}, ${lng.toFixed(6)}°${lng >= 0 ? 'E' : 'W'}`;
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
    const data = await response.json();
    if (data.features && data.features.length > 0) return data.features[0].properties.formatted;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

export const getBoundingBox = (lat, lng, radius) => {
  const latChange = radius / 111320;
  const lngChange = radius / (111320 * Math.cos(lat * Math.PI / 180));
  return { minLat: lat - latChange, maxLat: lat + latChange, minLng: lng - lngChange, maxLng: lng + lngChange };
};

export const isValidCoordinates = (lat, lng) => {
  return lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const calculateMidpoint = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const λ1 = lon1 * Math.PI / 180;
  const λ2 = lon2 * Math.PI / 180;

  const Bx = Math.cos(φ2) * Math.cos(λ2 - λ1);
  const By = Math.cos(φ2) * Math.sin(λ2 - λ1);
  const φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By));
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
  return { lat: φ3 * 180 / Math.PI, lng: λ3 * 180 / Math.PI };
};
