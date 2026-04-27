// Google Analytics
export const initGA = (measurementId) => {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', measurementId)
  
  window.gtag = gtag
}

export const pageView = (path) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path
    })
  }
}

export const event = (action, category, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

// Custom events
export const trackEmergency = (type) => {
  event('emergency_triggered', 'Emergency', type)
}

export const trackLogin = (method) => {
  event('user_login', 'Authentication', method)
}

export const trackFeature = (feature) => {
  event('feature_used', 'Features', feature)
}

export const trackError = (error, component) => {
  event('error_occurred', 'Errors', `${component}: ${error}`)
}
