import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await api.post('/auth/refresh', { refreshToken })
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
