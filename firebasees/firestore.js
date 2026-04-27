import { 
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  onSnapshot,
  runTransaction,
  writeBatch,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp
} from 'firebase/firestore';
import { app } from '../../config/firebases';

const db = getFirestore(app);

export const firestoreService = {
  // Create document with auto ID
  create: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create document with custom ID
  createWithId: async (collectionName, id, data) => {
    try {
      await setDoc(doc(db, collectionName, id), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true, id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get document by ID
  get: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update document
  update: async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete document
  delete: async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Query documents
  query: async (collectionName, constraints = []) => {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Query with pagination
  queryPaginated: async (collectionName, constraints = [], pageSize = 10, lastDoc = null) => {
    try {
      let q;
      if (lastDoc) {
        q = query(
          collection(db, collectionName),
          ...constraints,
          startAfter(lastDoc),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, collectionName),
          ...constraints,
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const documents = [];
      let lastVisible = null;

      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
        lastVisible = doc;
      });

      return {
        success: true,
        data: documents,
        lastDoc: lastVisible,
        hasMore: documents.length === pageSize
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Real-time listener
  onSnapshot: (collectionName, constraints, callback) => {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    });
  },

  // Real-time document listener
  onDocumentSnapshot: (collectionName, id, callback) => {
    const docRef = doc(db, collectionName, id);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    });
  },

  // Run transaction
  transaction: async (updateFunction) => {
    try {
      const result = await runTransaction(db, updateFunction);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Write batch
  batch: () => {
    return writeBatch(db);
  },

  // Array operations
  arrayUnion: (element) => arrayUnion(element),
  arrayRemove: (element) => arrayRemove(element),

  // Increment field
  increment: (value) => increment(value),

  // Timestamp
  timestamp: () => Timestamp.now(),
  fromDate: (date) => Timestamp.fromDate(date),
  toDate: (timestamp) => timestamp.toDate(),

  // Where clauses
  where: (field, operator, value) => where(field, operator, value),
  orderBy: (field, direction = 'asc') => orderBy(field, direction),
  limit: (limitCount) => limit(limitCount),
  startAfter: (doc) => startAfter(doc),
  endBefore: (doc) => endBefore(doc),
  limitToLast: (limitCount) => limitToLast(limitCount),

  // Subcollections
  subcollection: (parentCollection, parentId, subcollectionName) => {
    return collection(db, parentCollection, parentId, subcollectionName);
  },

  // Check if document exists
  exists: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      return false;
    }
  }
};




