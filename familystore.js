import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, set as firebaseSet, onValue, off } from 'firebase/database';
import { useLocationStore } from './locationsstore';
import { db, rtdb } from '../config/firebases';
import { useAuthStore } from './authstores';
import { calculateDistance } from '../utils/geoUtils';

export const useFamilyStore = create((set, get) => ({
  familyMembers: [],
  pendingInvites: [],
  locationRequests: [],
  selectedMember: null,
  error: null,

  // Load family members
  loadFamilyMembers: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'familyMembers'),
        where('userId', '==', user.uid),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const members = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      set({ familyMembers: members });
      
      // Subscribe to their locations
      members.forEach(member => {
        get().subscribeToMemberLocation(member.id, member.phone);
      });
      
      return members;
    } catch (error) {
      set({ error: error.message });
      return [];
    }
  },

  // Add family member
  addFamilyMember: async (memberData) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      // Generate invite token
      const inviteToken = Math.random().toString(36).substr(2, 8).toUpperCase();
      
      const docRef = await addDoc(collection(db, 'familyMembers'), {
        ...memberData,
        userId: user.uid,
        active: true,
        status: 'pending',
        inviteToken,
        shareAllowed: false,
        createdAt: new Date().toISOString(),
        lastSeen: null,
        batteryLevel: null,
        networkType: null
      });
      
      const newMember = { 
        id: docRef.id, 
        ...memberData, 
        active: true, 
        status: 'pending',
        inviteToken,
        shareAllowed: false 
      };
      
      set(state => ({
        familyMembers: [...state.familyMembers, newMember]
      }));
      
      // Send invitation (simulated)
      await get().sendInvitation(newMember);
      
      return { success: true, member: newMember };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update family member
  updateFamilyMember: async (memberId, updates) => {
    try {
      await updateDoc(doc(db, 'familyMembers', memberId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      set(state => ({
        familyMembers: state.familyMembers.map(m =>
          m.id === memberId ? { ...m, ...updates } : m
        )
      }));
      
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Remove family member
  removeFamilyMember: async (memberId) => {
    try {
      await updateDoc(doc(db, 'familyMembers', memberId), {
        active: false
      });
      
      // Remove location subscription
      const member = get().familyMembers.find(m => m.id === memberId);
      if (member) {
        const locationRef = ref(rtdb, `locations/${member.phone}`);
        off(locationRef);
      }
      
      set(state => ({
        familyMembers: state.familyMembers.filter(m => m.id !== memberId)
      }));
      
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Send invitation
  sendInvitation: async (member) => {
    // In real app, send SMS/email with invite link
    console.log(`Invitation sent to ${member.name} at ${member.phone}`);
    
    // Store in pending invites
    set(state => ({
      pendingInvites: [...state.pendingInvites, {
        id: member.id,
        name: member.name,
        phone: member.phone,
        status: 'sent',
        sentAt: new Date().toISOString()
      }]
    }));
  },

  // Accept invitation
  acceptInvitation: async (inviteToken) => {
    try {
      const q = query(
        collection(db, 'familyMembers'),
        where('inviteToken', '==', inviteToken),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: 'Invalid or expired invitation' };
      }
      
      const memberDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'familyMembers', memberDoc.id), {
        status: 'active',
        shareAllowed: true,
        acceptedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Reject invitation
  rejectInvitation: async (inviteToken) => {
    try {
      const q = query(
        collection(db, 'familyMembers'),
        where('inviteToken', '==', inviteToken),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return { success: false, error: 'Invalid or expired invitation' };
      }
      const memberDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'familyMembers', memberDoc.id), {
        status: 'rejected',
        shareAllowed: false,
        rejectedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Subscribe to member's location
  subscribeToMemberLocation: (memberId, phone) => {
    const locationRef = ref(rtdb, `locations/${phone}`);
    
    onValue(locationRef, (snapshot) => {
      const location = snapshot.val();
      if (location) {
        set(state => ({
          familyMembers: state.familyMembers.map(m =>
            m.id === memberId ? { 
              ...m, 
              location: {
                lat: location.lat,
                lng: location.lng,
                timestamp: location.timestamp
              },
              lastSeen: new Date(location.timestamp).toLocaleString(),
              batteryLevel: location.battery,
              networkType: location.network,
              status: 'online'
            } : m
          )
        }));
      } else {
        set(state => ({
          familyMembers: state.familyMembers.map(m =>
            m.id === memberId ? { ...m, status: 'offline' } : m
          )
        }));
      }
    });
  },

  // Request location from member
  requestLocation: async (memberId) => {
    const member = get().familyMembers.find(m => m.id === memberId);
    if (!member) return;

    const request = {
      id: Date.now().toString(),
      from: useAuthStore.getState().user?.name,
      to: member.id,
      toName: member.name,
      toPhone: member.phone,
      status: 'pending',
      timestamp: Date.now()
    };

    // Send location request via Realtime DB
    const requestRef = ref(rtdb, `locationRequests/${member.phone}`);
    await firebaseSet(requestRef, request);

    set(state => ({
      locationRequests: [...state.locationRequests, request]
    }));

    return request;
  },

  // Send location to requester
  sendLocation: async (requesterPhone) => {
    const location = useLocationStore.getState().currentLocation;
    if (!location) return;

    const locationRef = ref(rtdb, `locations/${requesterPhone}`);
    await firebaseSet(locationRef, {
      ...location,
      timestamp: Date.now(),
      shared: true
    });
  },

  // Calculate distance to member
  getDistanceToMember: (memberId) => {
    const member = get().familyMembers.find(m => m.id === memberId);
    const currentLocation = useLocationStore.getState().currentLocation;
    
    if (!member?.location || !currentLocation) return null;
    
    return calculateDistance(
      currentLocation.lat, currentLocation.lng,
      member.location.lat, member.location.lng
    );
  },

  // Get online members
  getOnlineMembers: () => {
    return get().familyMembers.filter(m => m.status === 'online');
  },

  // Get members by relation
  getMembersByRelation: (relation) => {
    return get().familyMembers.filter(m => m.relation === relation);
  },

  // Send message to member
  sendMessage: async (memberId, message) => {
    const member = get().familyMembers.find(m => m.id === memberId);
    if (!member) return;

    const messageRef = ref(rtdb, `messages/${member.phone}`);
    await firebaseSet(messageRef, {
      from: useAuthStore.getState().user?.name,
      message,
      timestamp: Date.now(),
      read: false
    });

    return { success: true };
  },

  // Clear location requests
  clearLocationRequests: () => {
    set({ locationRequests: [] });
  },

  // Select member
  selectMember: (member) => {
    set({ selectedMember: member });
  },

  // Clear error
  clearError: () => set({ error: null })
}));


