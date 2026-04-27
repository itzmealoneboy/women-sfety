import { useState, useCallback } from 'react';
import { storageService } from '../services/firebase/storage';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  // Upload file
  const uploadFile = useCallback(async (path, file, metadata = {}) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      
      const result = await storageService.upload(path, file, metadata);
      
      if (result.success) {
        setDownloadUrl(result.data.downloadURL);
        setFiles(prev => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  // Upload file with progress
  const uploadFileWithProgress = useCallback(async (path, file, metadata = {}) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      
      const uploadTask = storageService.uploadWithProgress(
        path,
        file,
        metadata,
        (progress) => setProgress(progress)
      );
      
      const result = await uploadTask;
      
      if (result.success) {
        setDownloadUrl(result.data.downloadURL);
        setFiles(prev => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  // Upload string
  const uploadString = useCallback(async (path, string, format = 'raw', metadata = {}) => {
    try {
      setUploading(true);
      setError(null);
      
      const result = await storageService.uploadString(path, string, format, metadata);
      
      if (result.success) {
        setDownloadUrl(result.data.downloadURL);
        setFiles(prev => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, []);

  // Get download URL
  const getDownloadUrl = useCallback(async (path) => {
    try {
      setError(null);
      
      const result = await storageService.getDownloadURL(path);
      
      if (result.success) {
        setDownloadUrl(result.url);
        return result.url;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Get metadata
  const getMetadata = useCallback(async (path) => {
    try {
      setError(null);
      
      const result = await storageService.getMetadata(path);
      
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
  }, []);

  // Update metadata
  const updateMetadata = useCallback(async (path, metadata) => {
    try {
      setError(null);
      
      const result = await storageService.updateMetadata(path, metadata);
      
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
  }, []);

  // Delete file
  const deleteFile = useCallback(async (path) => {
    try {
      setError(null);
      
      const result = await storageService.delete(path);
      
      if (result.success) {
        setFiles(prev => prev.filter(f => f.path !== path));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // List files
  const listFiles = useCallback(async (path, options = {}) => {
    try {
      setError(null);
      
      const result = await storageService.list(path, options);
      
      if (result.success) {
        setFiles(result.data.items.map(item => ({
          name: item.name,
          path: item.fullPath,
          size: item.size,
          updated: item.updated
        })));
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Generate file path
  const generatePath = useCallback((userId, type, filename) => {
    return storageService.generatePath(userId, type, filename);
  }, []);

  // Generate photo path
  const generatePhotoPath = useCallback((userId) => {
    return storageService.generatePhotoPath(userId);
  }, []);

  // Generate document path
  const generateDocumentPath = useCallback((userId, filename) => {
    return storageService.generateDocumentPath(userId, filename);
  }, []);

  // Generate recording path
  const generateRecordingPath = useCallback((userId) => {
    return storageService.generateRecordingPath(userId);
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    return storageService.formatFileSize(bytes);
  }, []);

  // Get file type
  const getFileType = useCallback((mimeType) => {
    return storageService.getFileType(mimeType);
  }, []);

  // Validate file size
  const validateFileSize = useCallback((file, maxSizeMB) => {
    return storageService.validateFileSize(file, maxSizeMB);
  }, []);

  // Validate file type
  const validateFileType = useCallback((file, allowedTypes) => {
    return storageService.validateFileType(file, allowedTypes);
  }, []);

  // Compress image
  const compressImage = useCallback(async (file, maxWidth = 1024, quality = 0.8) => {
    return await storageService.compressImage(file, maxWidth, quality);
  }, []);

  // Clear files
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    uploading,
    downloadUrl,
    progress,
    error,
    files,
    
    // Upload methods
    uploadFile,
    uploadFileWithProgress,
    uploadString,
    
    // File operations
    getDownloadUrl,
    getMetadata,
    updateMetadata,
    deleteFile,
    listFiles,
    
    // Path generators
    generatePath,
    generatePhotoPath,
    generateDocumentPath,
    generateRecordingPath,
    
    // Utilities
    formatFileSize,
    getFileType,
    validateFileSize,
    validateFileType,
    compressImage,
    clearFiles,
    clearError
  };
};
