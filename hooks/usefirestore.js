import { useState, useEffect, useCallback } from 'react';
import { firestoreService } from '../services/firebase/firestore';

export const useFirestore = (collectionName, constraints = []) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firestoreService.query(collectionName, constraints);
      
      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(constraints)]);

  // Load more documents (pagination)
  const loadMore = useCallback(async () => {
    if (!lastDoc) return;

    try {
      setLoading(true);
      
      const result = await firestoreService.queryPaginated(
        collectionName,
        constraints,
        10,
        lastDoc
      );
      
      if (result.success) {
        setDocuments(prev => [...prev, ...result.data]);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(constraints), lastDoc]);

  // Get document by ID
  const getDocument = useCallback(async (id) => {
    try {
      setError(null);
      const result = await firestoreService.get(collectionName, id);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [collectionName]);

  // Create document
  const createDocument = useCallback(async (data, id = null) => {
    try {
      setError(null);
      
      let result;
      if (id) {
        result = await firestoreService.createWithId(collectionName, id, data);
      } else {
        result = await firestoreService.create(collectionName, data);
      }
      
      if (result.success) {
        await loadDocuments();
        return { success: true, id: result.id };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [collectionName, loadDocuments]);

  // Update document
  const updateDocument = useCallback(async (id, data) => {
    try {
      setError(null);
      
      const result = await firestoreService.update(collectionName, id, data);
      
      if (result.success) {
        await loadDocuments();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [collectionName, loadDocuments]);

  // Delete document
  const deleteDocument = useCallback(async (id) => {
    try {
      setError(null);
      
      const result = await firestoreService.delete(collectionName, id);
      
      if (result.success) {
        await loadDocuments();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [collectionName, loadDocuments]);

  // Real-time listener
  const subscribeToCollection = useCallback((callback) => {
    return firestoreService.onSnapshot(collectionName, constraints, (data) => {
      setDocuments(data);
      callback?.(data);
    });
  }, [collectionName, JSON.stringify(constraints)]);

  // Real-time document listener
  const subscribeToDocument = useCallback((id, callback) => {
    return firestoreService.onDocumentSnapshot(collectionName, id, (data) => {
      if (data) {
        setDocuments(prev => {
          const index = prev.findIndex(d => d.id === id);
          if (index >= 0) {
            const newDocs = [...prev];
            newDocs[index] = data;
            return newDocs;
          }
          return prev;
        });
      }
      callback?.(data);
    });
  }, [collectionName]);

  // Load on mount and when dependencies change
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    // State
    documents,
    loading,
    error,
    hasMore,
    
    // Actions
    loadDocuments,
    loadMore,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection,
    subscribeToDocument,
    
    // Utilities
    where: firestoreService.where,
    orderBy: firestoreService.orderBy,
    limit: firestoreService.limit,
    arrayUnion: firestoreService.arrayUnion,
    arrayRemove: firestoreService.arrayRemove,
    increment: firestoreService.increment,
    timestamp: firestoreService.timestamp
  };
};
