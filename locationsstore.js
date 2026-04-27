import { create } from 'zustand'
import { ref, set as firebaseSet, onValue, off } from 'firebase/database'
import { rtdb } from '../config/firebases'
import { useAuthStore } from './authstores'

export const useLocationStore = create((set, get) => ({
  currentLocation: { lat: 13.0827, lng: 80.2707 },
  trackingActive: false,
  locationHistory: [],
  nearbyPlaces: {
    police: [],
    hospital: [],
    atm: [],
    pharmacy: [],
    shelter: []
  },
  error: null,

  setCurrentLocation: (location) => {
    set({ currentLocation: location })
    
    // Update in Realtime DB if user is logged in and tracking active
    const user = useAuthStore.getState().user
    if (user && get().trackingActive) {
      const locationRef = ref(rtdb, `locations/${user.uid}`)
      firebaseSet(locationRef, {
        ...location,
        timestamp: Date.now(),
        accuracy: location.accuracy || 10
      })
    }
  },

  watchId: null,

  startTracking: () => {
    set({ trackingActive: true })
    
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          get().setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => set({ error: error.message }),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      )
      set({ watchId: id })
    }
  },

  stopTracking: () => {
    const { watchId } = get()
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
    
    set({ trackingActive: false, watchId: null })
    
    const user = useAuthStore.getState().user
    if (user) {
      const locationRef = ref(rtdb, `locations/${user.uid}`)
      firebaseSet(locationRef, null) // Remove location data when stopped
    }
  },

  getNearbyPlaces: async (type, lat, lng) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=${type}&filter=circle:${lng},${lat},2000&limit=20&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
      )
      const data = await response.json()
      
      set((state) => ({
        nearbyPlaces: {
          ...state.nearbyPlaces,
          [type]: data.features || []
        }
      }))
      
      return data.features
    } catch (error) {
      set({ error: error.message })
      return []
    }
  },

  subscribeToFamilyLocation: (familyMemberId, callback) => {
    const locationRef = ref(rtdb, `locations/${familyMemberId}`)
    onValue(locationRef, (snapshot) => {
      const location = snapshot.val()
      if (location) {
        callback(location)
      }
    })
    
    return () => off(locationRef)
  },

  clearError: () => set({ error: null })
}))