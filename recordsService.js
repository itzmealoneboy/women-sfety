import api from './api';

// Reports/Records Service
const recordsService = {
  // Get all cases
  getCases: async (filters = {}) => {
    try {
      const response = await api.get('/reports', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  },

  // Get single case
  getCase: async (caseId) => {
    try {
      const response = await api.get(`/reports/${caseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching case:', error);
      throw error;
    }
  },

  // Create new complaint/case
  createComplaint: async (complaintData) => {
    try {
      const response = await api.post('/reports', complaintData);
      return response.data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  },

  // Update complaint status
  updateComplaint: async (complaintId, updateData) => {
    try {
      const response = await api.put(`/reports/${complaintId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  },

  // Delete complaint
  deleteComplaint: async (complaintId) => {
    try {
      const response = await api.delete(`/reports/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  },

  // Upload document
  uploadDocument: async (complaintId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('complaintId', complaintId);

      const response = await api.post('/reports/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentComplete}%`);
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Get documents for a complaint
  getDocuments: async (complaintId) => {
    try {
      const response = await api.get(`/reports/${complaintId}/documents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Download document
  downloadDocument: async (documentId) => {
    try {
      const response = await api.get(`/reports/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${documentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/reports/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Get complaints
  getComplaints: async (filters = {}) => {
    try {
      const response = await api.get('/reports/complaints', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Get single complaint
  getComplaint: async (complaintId) => {
    try {
      const response = await api.get(`/reports/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/reports/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Get case details with all related data
  getCaseDetails: async (caseId) => {
    try {
      const response = await api.get(`/reports/${caseId}/details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching case details:', error);
      throw error;
    }
  },

  // Update case status
  updateCaseStatus: async (caseId, status, notes = '') => {
    try {
      const response = await api.patch(`/reports/${caseId}/status`, { status, notes });
      return response.data;
    } catch (error) {
      console.error('Error updating case status:', error);
      throw error;
    }
  },

  // Add witness statement
  addWitnessStatement: async (complaintId, witnessData) => {
    try {
      const response = await api.post(`/reports/${complaintId}/witnesses`, witnessData);
      return response.data;
    } catch (error) {
      console.error('Error adding witness statement:', error);
      throw error;
    }
  },

  // Export report as PDF
  exportReport: async (caseId) => {
    try {
      const response = await api.get(`/reports/${caseId}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `case_${caseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },

  // Get case updates/timeline
  getCaseTimeline: async (caseId) => {
    try {
      const response = await api.get(`/reports/${caseId}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching case timeline:', error);
      throw error;
    }
  }
};

export default recordsService;
