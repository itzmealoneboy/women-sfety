import { useState, useCallback } from 'react';
import recordsService from '../services/recordsService';

// Custom hook for managing records/complaints
const useRecords = () => {
  const [cases, setCases] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Fetch all cases
  const fetchCases = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.getCases(filters);
      setCases(data.data || data);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching cases');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single case
  const fetchCase = useCallback(async (caseId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.getCase(caseId);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching case');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new complaint
  const createComplaint = useCallback(async (complaintData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.createComplaint(complaintData);
      return data;
    } catch (err) {
      setError(err.message || 'Error creating complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update complaint
  const updateComplaint = useCallback(async (complaintId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.updateComplaint(complaintId, updateData);
      return data;
    } catch (err) {
      setError(err.message || 'Error updating complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete complaint
  const deleteComplaint = useCallback(async (complaintId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.deleteComplaint(complaintId);
      return data;
    } catch (err) {
      setError(err.message || 'Error deleting complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload document
  const uploadDocument = useCallback(async (complaintId, file, documentType, onProgress) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.uploadDocument(complaintId, file, documentType);
      return data;
    } catch (err) {
      setError(err.message || 'Error uploading document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Download document
  const downloadDocument = useCallback(async (documentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.downloadDocument(documentId);
      return data;
    } catch (err) {
      setError(err.message || 'Error downloading document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get documents
  const fetchDocuments = useCallback(async (complaintId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.getDocuments(complaintId);
      setDocuments(data.data || data);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching documents');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch complaints
  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.getComplaints(filters);
      setComplaints(data.data || data);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching complaints');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.getStatistics();
      setStatistics(data);
      return data;
    } catch (err) {
      setError(err.message || 'Error fetching statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export report
  const exportReport = useCallback(async (caseId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordsService.exportReport(caseId);
      return data;
    } catch (err) {
      setError(err.message || 'Error exporting report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    cases,
    complaints,
    documents,
    loading,
    error,
    statistics,

    // Methods
    fetchCases,
    fetchCase,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    uploadDocument,
    downloadDocument,
    fetchDocuments,
    fetchComplaints,
    fetchStatistics,
    exportReport,

    // Utilities
    clearError: () => setError(null)
  };
};

export default useRecords;
