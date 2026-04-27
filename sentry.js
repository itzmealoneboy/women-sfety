import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
      release: `sakhi@${import.meta.env.VITE_APP_VERSION}`
    })
  }
}

export const logError = (error, context = {}) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context
    })
  } else {
    console.error('Error:', error, context)
  }
}

export const setUser = (user) => {
  if (import.meta.env.PROD && user) {
    Sentry.setUser({
      id: user.uid,
      email: user.email,
      username: user.name
    })
  }
}

export const clearUser = () => {
  if (import.meta.env.PROD) {
    Sentry.setUser(null)
  }
}

export const addBreadcrumb = (message, category, level = 'info') => {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now()
    })
  }
}
