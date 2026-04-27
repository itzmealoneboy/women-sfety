import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebases';
import { useAuthStore } from './authStore';

export const useMediaStore = create((set, get) => ({
  photos: [],
  documents: [],
  recordings: [],
  selectedMedia: null,
  uploadProgress: 0,
  error: null,

  // Load user photos
  loadPhotos: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'photos'),
        where('userId', '==', user.uid),
        orderBy('capturedAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const photos = [];
      querySnapshot.forEach((doc) => {
        photos.push({ id: doc.id, ...doc.data() });
      });
      set({ photos });
      return photos;
    } catch (error) {
      set({ error: error.message });
      return [];
    }
  },

  // Save photo
  savePhoto: async (photoData) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      set({ uploadProgress: 0 });
      
      // Generate unique filename
      const filename = `photos/${user.uid}/${Date.now()}.jpg`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename);
      await uploadString(storageRef, photoData.data, 'data_url');
      const photoURL = await getDownloadURL(storageRef);
      
      set({ uploadProgress: 50 });

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, 'photos'), {
        userId: user.uid,
        photoURL,
        filename,
        type: photoData.type || 'general',
        description: photoData.description || '',
        tags: photoData.tags || [],
        location: photoData.location,
        capturedAt: photoData.capturedAt || new Date().toISOString(),
        size: photoData.size || 0,
        facingMode: photoData.facingMode || 'user'
      });

      set({ uploadProgress: 100 });

      // Add to local state
      const newPhoto = {
        id: docRef.id,
        userId: user.uid,
        photoURL,
        filename,
        type: photoData.type,
        description: photoData.description,
        tags: photoData.tags,
        location: photoData.location,
        capturedAt: photoData.capturedAt
      };

      set(state => ({
        photos: [newPhoto, ...state.photos]
      }));

      setTimeout(() => set({ uploadProgress: 0 }), 1000);

      return { success: true, photo: newPhoto };
    } catch (error) {
      set({ error: error.message, uploadProgress: 0 });
      return { success: false, error: error.message };
    }
  },

  // Delete photo
  deletePhoto: async (photoId) => {
    try {
      const photo = get().photos.find(p => p.id === photoId);
      if (!photo) return { success: false, error: 'Photo not found' };

      // Delete from Storage
      const storageRef = ref(storage, photo.filename);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'photos', photoId));

      // Remove from local state
      set(state => ({
        photos: state.photos.filter(p => p.id !== photoId)
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update photo metadata
  updatePhoto: async (photoId, updates) => {
    try {
      await updateDoc(doc(db, 'photos', photoId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      set(state => ({
        photos: state.photos.map(p =>
          p.id === photoId ? { ...p, ...updates } : p
        )
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Load documents
  loadDocuments: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', user.uid),
        orderBy('uploadedAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      set({ documents });
      return documents;
    } catch (error) {
      set({ error: error.message });
      return [];
    }
  },

  // Upload document
  uploadDocument: async (file, metadata) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      set({ uploadProgress: 0 });

      // Read file as data URL
      const reader = new FileReader();
      const fileData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      // Generate filename
      const filename = `documents/${user.uid}/${Date.now()}_${file.name}`;

      // Upload to Storage
      const storageRef = ref(storage, filename);
      await uploadString(storageRef, fileData, 'data_url');
      const fileURL = await getDownloadURL(storageRef);

      set({ uploadProgress: 70 });

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'documents'), {
        userId: user.uid,
        fileURL,
        filename,
        originalName: file.name,
        type: metadata.type || 'general',
        description: metadata.description || '',
        tags: metadata.tags || [],
        size: file.size,
        uploadedAt: new Date().toISOString(),
        mimeType: file.type
      });

      set({ uploadProgress: 100 });

      const newDoc = {
        id: docRef.id,
        userId: user.uid,
        fileURL,
        filename,
        originalName: file.name,
        type: metadata.type,
        description: metadata.description,
        tags: metadata.tags,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      set(state => ({
        documents: [newDoc, ...state.documents]
      }));

      setTimeout(() => set({ uploadProgress: 0 }), 1000);

      return { success: true, document: newDoc };
    } catch (error) {
      set({ error: error.message, uploadProgress: 0 });
      return { success: false, error: error.message };
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const doc_ = get().documents.find(d => d.id === documentId);
      if (!doc_) return { success: false, error: 'Document not found' };

      // Delete from Storage
      const storageRef = ref(storage, doc_.filename);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', documentId));

      // Remove from local state
      set(state => ({
        documents: state.documents.filter(d => d.id !== documentId)
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Save voice recording
  saveRecording: async (recordingData) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const filename = `recordings/${user.uid}/${Date.now()}.webm`;
      
      const storageRef = ref(storage, filename);
      await uploadString(storageRef, recordingData.data, 'data_url');
      const recordingURL = await getDownloadURL(storageRef);

      const newRecording = {
        id: Date.now().toString(),
        userId: user.uid,
        recordingURL,
        filename,
        duration: recordingData.duration,
        type: recordingData.type || 'voice',
        createdAt: new Date().toISOString()
      };

      set(state => ({
        recordings: [newRecording, ...state.recordings]
      }));

      return { success: true, recording: newRecording };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get photos by type
  getPhotosByType: (type) => {
    return get().photos.filter(p => p.type === type);
  },

  // Get photos by date range
  getPhotosByDateRange: (startDate, endDate) => {
    return get().photos.filter(p => {
      const photoDate = new Date(p.capturedAt);
      return photoDate >= startDate && photoDate <= endDate;
    });
  },

  // Search media
  searchMedia: (query) => {
    const searchTerm = query.toLowerCase();
    const photos = get().photos.filter(p =>
      p.description?.toLowerCase().includes(searchTerm) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    const documents = get().documents.filter(d =>
      d.description?.toLowerCase().includes(searchTerm) ||
      d.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      d.originalName?.toLowerCase().includes(searchTerm)
    );
    return { photos, documents };
  },

  // Select media
  selectMedia: (media) => {
    set({ selectedMedia: media });
  },

  // Clear selected media
  clearSelected: () => {
    set({ selectedMedia: null });
  },

  // Clear error
  clearError: () => set({ error: null })
}));


