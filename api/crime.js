import axios from 'axios';

const CRIME_API_BASE = 'https://api.crimeometer.com/v3';
const CRIME_API_KEY = import.meta.env.VITE_CRIME_API_KEY;

const crimeClient = axios.create({
  baseURL: CRIME_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': CRIME_API_KEY
  }
});

export const crimeService = {
  // Get crime incidents near location
  getNearbyIncidents: async (lat, lng, radius = 2, datetime = '2024-01-01T00:00:00Z') => {
    try {
      const response = await crimeClient.get('/incidents/radius', {
        params: {
          lat,
          lon: lng,
          radius,
          datetime_ini: datetime,
          limit: 100
        }
      });

      return {
        success: true,
        data: response.data.incidents.map(incident => ({
          id: incident.incident_id,
          type: incident.offense_type,
          description: incident.offense_description,
          date: incident.incident_date,
          location: {
            lat: incident.lat,
            lng: incident.lon
          },
          address: incident.address,
          severity: incident.severity
        }))
      };
    } catch (error) {
      console.error('Error fetching crime incidents:', error);
      // Return mock data for demo
      return {
        success: true,
        data: generateMockCrimeData(lat, lng)
      };
    }
  },

  // Get crime statistics by area
  getCrimeStats: async (area, days = 30) => {
    try {
      const response = await crimeClient.get('/stats', {
        params: {
          area,
          days
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

  // Get crime heatmap data
  getHeatmapData: async (bounds, dateRange) => {
    try {
      const response = await crimeClient.get('/heatmap', {
        params: {
          north: bounds.north,
          south: bounds.south,
          east: bounds.east,
          west: bounds.west,
          start_date: dateRange.start,
          end_date: dateRange.end
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

  // Get crime trends
  getCrimeTrends: async (area, months = 12) => {
    try {
      const response = await crimeClient.get('/trends', {
        params: {
          area,
          months
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

  // Search criminal database
  searchCriminal: async (query) => {
    try {
      const response = await crimeClient.get('/criminals/search', {
        params: { q: query }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Report crime
  reportCrime: async (reportData) => {
    try {
      const response = await crimeClient.post('/reports', reportData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get safety score for location
  getSafetyScore: async (lat, lng) => {
    try {
      // Calculate safety score based on crime data
      const incidents = await crimeService.getNearbyIncidents(lat, lng, 1);
      
      if (!incidents.success) {
        return { success: false, error: 'Could not calculate safety score' };
      }

      const totalIncidents = incidents.data.length;
      const severityScore = incidents.data.reduce((sum, inc) => {
        const severityWeights = {
          'low': 1,
          'medium': 2,
          'high': 3,
          'critical': 4
        };
        return sum + (severityWeights[inc.severity] || 1);
      }, 0);

      // Base score 100, subtract points based on incidents
      let score = 100 - (totalIncidents * 5) - (severityScore * 2);
      score = Math.max(0, Math.min(100, score));

      // Determine safety level
      let level = 'safe';
      if (score < 30) level = 'danger';
      else if (score < 60) level = 'moderate';
      else if (score < 80) level = 'caution';

      return {
        success: true,
        data: {
          score,
          level,
          incidents: totalIncidents,
          severity: severityScore
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get crime alerts for area
  getCrimeAlerts: async (lat, lng, radius = 5) => {
    try {
      const incidents = await crimeService.getNearbyIncidents(lat, lng, radius);
      
      if (!incidents.success) {
        return { success: false, error: 'Could not fetch alerts' };
      }

      // Filter recent incidents (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const recentIncidents = incidents.data.filter(inc => 
        new Date(inc.date) > oneDayAgo
      );

      return {
        success: true,
        data: recentIncidents
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Predict crime hotspots
  predictHotspots: async (area) => {
    // This would use ML models in production
    try {
      const response = await crimeClient.get('/predict/hotspots', {
        params: { area }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Helper function to generate mock crime data
function generateMockCrimeData(lat, lng) {
  const crimeTypes = [
    'Theft', 'Assault', 'Harassment', 'Robbery', 'Burglary',
    'Chain Snatching', 'Pickpocketing', 'Stalking', 'Fraud'
  ];

  const severities = ['low', 'medium', 'high', 'critical'];
  
  return Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
    id: `mock-${i}`,
    type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
    description: 'Mock crime incident for demonstration',
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      lat: lat + (Math.random() - 0.5) * 0.02,
      lng: lng + (Math.random() - 0.5) * 0.02
    },
    address: 'Mock Location',
    severity: severities[Math.floor(Math.random() * severities.length)]
  }));
}
