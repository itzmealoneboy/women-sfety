import api from './api'

export const crimeService = {
  // Get crime data for location
  getCrimeData: async (lat, lng, radius = 2000) => {
    try {
      const response = await api.get('/crime/nearby', {
        params: { lat, lng, radius }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching crime data:', error)
      throw error
    }
  },

  // Report a crime
  reportCrime: async (data) => {
    try {
      const response = await api.post('/crime/report', data)
      return response.data
    } catch (error) {
      console.error('Error reporting crime:', error)
      throw error
    }
  },

  // Get crime statistics
  getCrimeStats: async (area) => {
    try {
      const response = await api.get('/crime/stats', {
        params: { area }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching crime stats:', error)
      throw error
    }
  },

  // Get safety score for location
  getSafetyScore: async (lat, lng) => {
    try {
      const response = await api.get('/crime/safety-score', {
        params: { lat, lng }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching safety score:', error)
      throw error
    }
  }
}
