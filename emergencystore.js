import { create } from 'zustand'
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore'
import { ref, set, push } from 'firebase/database'
import { db, rtdb } from '../config/firebases'
import { useAuthStore } from './authstores'

export const useEmergencyStore = create((set, get) => ({
  sosActive: false,
  sosTimer: 10,
  emergencyContacts: [],
  activeEmergencies: [],
  error: null,

  loadEmergencyContacts: async () => {
    // Fallback: Always initialize with local contacts first
    const localContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]')
    set({ emergencyContacts: localContacts })

    const user = useAuthStore.getState().user
    if (!user || !db) return

    try {
      const q = query(collection(db, 'emergencyContacts'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      const contacts = []
      querySnapshot.forEach((doc) => {
        contacts.push({ id: doc.id, ...doc.data() })
      })
      
      if (contacts.length > 0) {
        set({ emergencyContacts: contacts })
        // Sync local storage
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts))
      }
    } catch (error) {
      console.warn("Failed fetching from Firebase database, using local storage", error)
    }
  },

  addEmergencyContact: async (contact) => {
    const user = useAuthStore.getState().user

    try {
      let newContact = { 
        ...contact, 
        createdAt: new Date().toISOString() 
      }

      // Store in Firebase if authenticated
      if (user && db) {
        newContact.userId = user.uid
        const docRef = await addDoc(collection(db, 'emergencyContacts'), newContact)
        newContact.id = docRef.id
      } else {
        // Local database fallback
        newContact.id = 'local_' + Date.now()
      }
      
      set((state) => {
        const updatedContacts = [...state.emergencyContacts, newContact]
        localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
        return { emergencyContacts: updatedContacts }
      })
      
      return { success: true }
    } catch (error) {
      console.error(error)
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  removeEmergencyContact: async (contactId) => {
    try {
      // Remove from Firebase if it's not a local-only entry
      if (db && !String(contactId).startsWith('local_')) {
        await updateDoc(doc(db, 'emergencyContacts', contactId), { active: false })
      }
      
      set((state) => {
        const updatedContacts = state.emergencyContacts.filter(c => c.id !== contactId)
        localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
        return { emergencyContacts: updatedContacts }
      })
      
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  triggerSOS: async (location) => {
    const user = useAuthStore.getState().user
    set({ sosActive: true, sosTimer: 10 })

    // Create SOS record in Firestore
    try {
      const sosRef = await addDoc(collection(db, 'emergencies'), {
        userId: user?.uid,
        location,
        timestamp: Date.now(),
        status: 'active',
        contactsNotified: []
      })

      // Send to Realtime DB for live updates
      const liveSOSRef = ref(rtdb, `activeSOS/${sosRef.id}`)
      await set(liveSOSRef, {
        userId: user?.uid,
        location,
        timestamp: Date.now(),
        status: 'active'
      })

      // Notify emergency contacts
      const contacts = get().emergencyContacts
      contacts.forEach(async (contact) => {
        // Send notification via Firebase Cloud Messaging
        const notificationRef = push(ref(rtdb, 'notifications'))
        await set(notificationRef, {
          userId: contact.userId,
          title: '🚨 SOS Alert',
          body: `${user?.name} needs immediate help!`,
          location,
          timestamp: Date.now(),
          read: false
        })
      })

      return { success: true, id: sosRef.id }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  cancelSOS: async (sosId) => {
    try {
      await updateDoc(doc(db, 'emergencies', sosId), { status: 'cancelled' })
      
      const liveSOSRef = ref(rtdb, `activeSOS/${sosId}`)
      await set(liveSOSRef, null)
      
      set({ sosActive: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  setSOSTimer: (time) => set({ sosTimer: time }),

  clearError: () => set({ error: null })
}))


