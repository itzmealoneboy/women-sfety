// Mock Firebase service for development
export const getUserData = async (userId) => {
  console.log('Mock: Getting user data for', userId);
  return { success: true, data: { name: 'Test User', email: 'test@example.com' } };
};

export const saveUserData = async (userId, userData) => {
  console.log('Mock: Saving user data', userData);
  return { success: true };
};

export const fetchCollection = async (collectionName) => {
  console.log('Mock: Fetching collection', collectionName);
  return { success: true, data: [] };
};

export const addDocument = async (collectionName, data) => {
  console.log('Mock: Adding document to', collectionName);
  return { success: true, id: 'mock-id-' + Date.now() };
};

export const updateDocument = async (collectionName, docId, data) => {
  console.log('Mock: Updating document', docId);
  return { success: true };
};

export const deleteDocument = async (collectionName, docId) => {
  console.log('Mock: Deleting document', docId);
  return { success: true };
};
