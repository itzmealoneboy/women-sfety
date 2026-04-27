import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  updateMetadata,
  deleteObject,
  list,
  listAll,
  getBytes,
  getStream
} from 'firebase/storage';
import { app } from '../../config/firebases';

const storage = getStorage(app);

export const storageService = {
  // Upload file
  upload: async (path, file, metadata = {}) => {
    try {
      const storageRef = ref(storage, path);
      const result = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        success: true,
        data: {
          ...result.metadata,
          downloadURL,
          path
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload with progress
  uploadWithProgress: (path, file, metadata = {}, onProgress) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress, snapshot);
      },
      (error) => {
        console.error('Upload failed:', error);
      }
    );

    return uploadTask.then(async (snapshot) => {
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        success: true,
        data: {
          ...snapshot.metadata,
          downloadURL,
          path
        }
      };
    });
  },

  // Upload string (base64, data_url, raw)
  uploadString: async (path, string, format = 'raw', metadata = {}) => {
    try {
      const storageRef = ref(storage, path);
      const result = await uploadString(storageRef, string, format, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        success: true,
        data: {
          ...result.metadata,
          downloadURL,
          path
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get download URL
  getDownloadURL: async (path) => {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return { success: true, url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get metadata
  getMetadata: async (path) => {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      return { success: true, data: metadata };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update metadata
  updateMetadata: async (path, metadata) => {
    try {
      const storageRef = ref(storage, path);
      const newMetadata = await updateMetadata(storageRef, metadata);
      return { success: true, data: newMetadata };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete file
  delete: async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // List files
  list: async (path, options = {}) => {
    try {
      const storageRef = ref(storage, path);
      let result;
      
      if (options.maxResults || options.pageToken) {
        result = await list(storageRef, options);
      } else {
        result = await listAll(storageRef);
      }
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get file as bytes
  getBytes: async (path, maxSize) => {
    try {
      const storageRef = ref(storage, path);
      const bytes = await getBytes(storageRef, maxSize);
      return { success: true, data: bytes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get file as stream
  getStream: (path) => {
    const storageRef = ref(storage, path);
    return getStream(storageRef);
  },

  // Generate file path
  generatePath: (userId, type, filename) => {
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    return `${type}/${userId}/${timestamp}_${filename}`;
  },

  // Generate photo path
  generatePhotoPath: (userId) => {
    const timestamp = Date.now();
    return `photos/${userId}/${timestamp}.jpg`;
  },

  // Generate document path
  generateDocumentPath: (userId, filename) => {
    const timestamp = Date.now();
    return `documents/${userId}/${timestamp}_${filename}`;
  },

  // Generate recording path
  generateRecordingPath: (userId) => {
    const timestamp = Date.now();
    return `recordings/${userId}/${timestamp}.webm`;
  },

  // Get file size in readable format
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file type from mime
  getFileType: (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document')) return 'document';
    return 'other';
  },

  // Validate file size
  validateFileSize: (file, maxSizeMB) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // Validate file type
  validateFileType: (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  },

  // Compress image (client-side)
  compressImage: async (file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, file.type, quality);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }
};




