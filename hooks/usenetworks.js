import { useState, useEffect } from 'react'

export const useNetworkStatus = () => {
  const [networkType, setNetworkType] = useState('unknown')
  const [downlink, setDownlink] = useState(0)
  const [rtt, setRtt] = useState(0)

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      
      const updateNetworkInfo = () => {
        setNetworkType(connection.effectiveType)
        setDownlink(connection.downlink)
        setRtt(connection.rtt)
      }

      updateNetworkInfo()
      connection.addEventListener('change', updateNetworkInfo)

      return () => connection.removeEventListener('change', updateNetworkInfo)
    }
  }, [])

  return { networkType, downlink, rtt }
}
