/**
 * Performance monitoring utilities
 */

// Measure component render time
export const measureRender = (componentName) => {
  if (import.meta.env.DEV) {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      console.log(`${componentName} rendered in ${(end - start).toFixed(2)}ms`)
    }
  }
  return () => {}
}

// Lazy load images
export const lazyLoadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = reject
    img.src = src
  })
}

// Debounce scroll events
export const debounceScroll = (callback, delay = 100) => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(callback, delay)
  }
}

// Throttle resize events
export const throttleResize = (callback, limit = 100) => {
  let waiting = false
  return () => {
    if (!waiting) {
      callback()
      waiting = true
      setTimeout(() => {
        waiting = false
      }, limit)
    }
  }
}

// Check if element is in viewport
export const isInViewport = (element, offset = 0) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  )
}

// Prefetch critical resources
export const prefetchResources = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

// Measure Web Vitals
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
}
