import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import app from '../config/firebases'

const messaging = getMessaging(app)

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      })
      
      return { success: true, token }
    } else {
      return { success: false, error: 'Permission denied' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })

export const sendNotification = async (userId, notification) => {
  try {
    const response = await api.post('/notifications/send', {
      userId,
      ...notification
    })
    return response.data
  } catch (error) {
    throw error
  }
}


