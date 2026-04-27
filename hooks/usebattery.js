import { useState, useEffect } from 'react'

export const useBattery = () => {
  const [battery, setBattery] = useState({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null
  })

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((batteryManager) => {
        const updateBattery = () => {
          setBattery({
            level: batteryManager.level * 100,
            charging: batteryManager.charging,
            chargingTime: batteryManager.chargingTime,
            dischargingTime: batteryManager.dischargingTime
          })
        }

        updateBattery()

        batteryManager.addEventListener('levelchange', updateBattery)
        batteryManager.addEventListener('chargingchange', updateBattery)
        batteryManager.addEventListener('chargingtimechange', updateBattery)
        batteryManager.addEventListener('dischargingtimechange', updateBattery)

        return () => {
          batteryManager.removeEventListener('levelchange', updateBattery)
          batteryManager.removeEventListener('chargingchange', updateBattery)
          batteryManager.removeEventListener('chargingtimechange', updateBattery)
          batteryManager.removeEventListener('dischargingtimechange', updateBattery)
        }
      })
    }
  }, [])

  return battery
}
