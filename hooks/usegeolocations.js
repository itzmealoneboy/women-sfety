import { useState, useEffect } from 'react'

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported')
      setLoading(false)
      return
    }

    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp
      })
      setLoading(false)
    }

    const error = (err) => {
      setError(err.message)
      setLoading(false)
    }

    const watcher = navigator.geolocation.watchPosition(success, error, options)

    return () => navigator.geolocation.clearWatch(watcher)
  }, [])

  return { location, error, loading }
}
