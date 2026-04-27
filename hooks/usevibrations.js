export const useVibration = () => {
  const vibrate = (pattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
      return true
    }
    return false
  }

  const vibrateOnce = (duration = 200) => {
    return vibrate(duration)
  }

  const vibratePattern = (pattern) => {
    return vibrate(pattern)
  }

  const stopVibration = () => {
    return vibrate(0)
  }

  return { vibrateOnce, vibratePattern, stopVibration }
}
