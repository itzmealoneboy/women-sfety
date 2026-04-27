import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
import './newcomplaint.css';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const [formData, setFormData] = useState({
    // Complaint Details
    complaintType: '',
    incidentDate: '',
    incidentTime: '',
    title: '',
    description: '',
    severity: 'medium',

    // Location Information
    incidentLocation: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',

    // Parties Involved
    accusedName: '',
    accusedPhone: '',
    accusedAddress: '',
    accusedAge: '',

    witnessCount: 0,
    witnesses: [],

    // Medical Information
    injuryType: 'none',
    injuryDescription: '',
    medicalAttention: false,
    hospitalName: '',

    // Additional Details
    previousIncidents: false,
    previousDetails: '',
    anonymousReport: false,
    expectedOutcome: ''
  });

  const complaintTypes = [
    'Harassment (Online/Offline)',
    'Stalking',
    'Cyber Crime / Digital Abuse',
    'Domestic Violence',
    'Sexual Harassment at Workplace',
    'Physical Assault',
    'Eve Teasing',
    'Acid Attack Threat',
    'Dowry Harassment',
    'Voyeurism / Recording without consent',
    'Privacy Breach',
    'Other'
  ];

  const relationships = [
    'Stranger',
    'Acquaintance',
    'Family Member',
    'Colleague',
    'Supervisor',
    'Friend',
    'Ex-Partner',
    'Neighbor',
    'Other'
  ];

  const injuryTypes = ['none', 'minor', 'moderate', 'severe'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[fileId] || 0;
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: current + Math.random() * 30 };
        });
      }, 200);

      // Add file to list after upload
      setTimeout(() => {
        setUploadedFiles(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          type: file.type,
          status: 'uploaded',
          uploadedAt: new Date()
        }]);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      }, 1500);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    const newProgress = { ...uploadProgress };
    delete newProgress[fileId];
    setUploadProgress(newProgress);
  };

  const addWitness = () => {
    if (formData.witnessCount < 5) {
      setFormData(prev => ({
        ...prev,
        witnessCount: prev.witnessCount + 1,
        witnesses: [...prev.witnesses, { name: '', phone: '', address: '' }]
      }));
    }
  };

  const updateWitness = (index, field, value) => {
    const newWitnesses = [...formData.witnesses];
    newWitnesses[index] = { ...newWitnesses[index], [field]: value };
    setFormData(prev => ({ ...prev, witnesses: newWitnesses }));
  };

  const removeWitness = (index) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index),
      witnessCount: prev.witnessCount - 1
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.complaintType || !formData.title || !formData.description) {
        throw new Error('Please fill all required fields');
      }

      // API call would go here
      console.log('Submitting complaint:', {
        ...formData,
        documents: uploadedFiles
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/records');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-complaint-container">
      <div className="complaint-header">
        <button className="back-btn" onClick={() => navigate('/records')}>← Back</button>
        <h1>📋 File New Complaint</h1>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Details</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Parties</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Documents</p>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <span>4</span>
            <p>Review</p>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">✅ Complaint filed successfully!</div>}

      <form onSubmit={handleSubmit} className="complaint-form">
        {/* Step 1: Complaint Details */}
        {step === 1 && (
          <div className="form-step">
            <h2>Complaint Details</h2>

            <div className="form-group">
              <label>Complaint Type *</label>
              <select
                name="complaintType"
                value={formData.complaintType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select complaint type</option>
                {complaintTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Incident Date *</label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Incident Time</label>
                <input
                  type="time"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Complaint Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Brief title of the complaint"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label>Detailed Description *</label>
              <textarea
                name="description"
                placeholder="Provide detailed account of the incident. Include what happened, when, where, and how it affected you."
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="6"
                maxLength="2000"
              />
              <div className="flex justify-between items-center mt-2">
                <small>{formData.description.length}/2000 characters</small>
                <button 
                  type="button" 
                  className={`voice-record-btn ${formData.voiceRecord ? 'recording' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, voiceRecord: !prev.voiceRecord }))}
                >
                  <MicrophoneIcon className="w-4 h-4 inline mr-1" />
                  {formData.voiceRecord ? 'Recording... (Tap to stop)' : 'Voice Report (AI)'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Severity Level *</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                  <option value="critical">⛔ Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Anonymous Report?</label>
                <input
                  type="checkbox"
                  name="anonymousReport"
                  checked={formData.anonymousReport}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/records')}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(2)}>
                Next: Parties Involved →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Parties Involved */}
        {step === 2 && (
          <div className="form-step">
            <h2>Parties Involved</h2>

            <div className="section-title">Accused/Respondent Information</div>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="accusedName"
                  placeholder="Full name of accused"
                  value={formData.accusedName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <select
                  name="accusedRelationship"
                  value={formData.accusedRelationship}
                  onChange={handleInputChange}
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="accusedAge"
                  placeholder="Age"
                  value={formData.accusedAge}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="accusedPhone"
                  placeholder="Contact number"
                  value={formData.accusedPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="accusedAddress"
                placeholder="Full address"
                value={formData.accusedAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="section-divider"></div>

            <div className="section-title">Witnesses</div>
            <p className="section-description">Add people who witnessed the incident (maximum 5)</p>

            {formData.witnesses.map((witness, index) => (
              <div key={index} className="witness-card">
                <div className="witness-header">
                  <h4>Witness #{index + 1}</h4>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeWitness(index)}
                  >
                    ✕ Remove
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={witness.name}
                      onChange={(e) => updateWitness(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      placeholder="Contact number"
                      value={witness.phone}
                      onChange={(e) => updateWitness(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={witness.address}
                      onChange={(e) => updateWitness(index, 'address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.witnessCount < 5 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={addWitness}
              >
                + Add Witness
              </button>
            )}

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                Next: Upload Documents →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {step === 3 && (
          <div className="form-step">
            <h2>Upload Supporting Documents</h2>

            <div className="upload-section">
              <div className="upload-box">
                <input
                  type="file"
                  multiple
                  id="fileInput"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor="fileInput" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <h3>Click to upload or drag and drop</h3>
                  <p>PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</p>
                </label>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h3>Uploaded Documents</h3>
                {uploadedFiles.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-info">
                      <span className="file-icon">
                        {file.type.includes('pdf') ? '📄' : '📷'}
                      </span>
                      <div className="file-details">
                        <p className="file-name">{file.name}</p>
                        <p className="file-meta">{file.size} MB • {file.uploadedAt.toLocaleTimeString()}</p>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress[file.id] || 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`status-badge ${file.status}`}>✓ {file.status}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-file"
                      onClick={() => removeFile(file.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="document-types-guide">
              <h4>Recommended Documents:</h4>
              <ul>
                <li>📸 Photographs/Screenshots of evidence</li>
                <li>📧 Email/Message conversations</li>
                <li>🏥 Medical reports (if applicable)</li>
                <li>📋 FIR copy or police report</li>
                <li>👁️ Witness statements</li>
                <li>📱 Call records or SMS logs</li>
              </ul>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(4)}>
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="form-step">
            <h2>Review & Submit</h2>

            <div className="review-section">
              <h3>Complaint Summary</h3>
              <div className="review-item">
                <strong>Type:</strong> {formData.complaintType}
              </div>
              <div className="review-item">
                <strong>Title:</strong> {formData.title}
              </div>
              <div className="review-item">
                <strong>Date:</strong> {formData.incidentDate}
              </div>
              <div className="review-item">
                <strong>Severity:</strong> {formData.severity.toUpperCase()}
              </div>
              <div className="review-item">
                <strong>Relationship:</strong> {formData.accusedRelationship || 'Not specified'}
              </div>
              <div className="review-item">
                <strong>Description:</strong>
                <p className="description-review">{formData.description}</p>
              </div>
            </div>

            <div className="review-section">
              <h3>Documents Attached</h3>
              <p>{uploadedFiles.length} document(s) uploaded</p>
              {uploadedFiles.map(file => (
                <div key={file.id} className="review-file">
                  📄 {file.name} ({file.size} MB)
                </div>
              ))}
            </div>

            <div className="consent-section">
              <label>
                <input type="checkbox" required />
                I confirm that the information provided is true and accurate to the best of my knowledge
              </label>
              <label>
                <input type="checkbox" required />
                I understand that providing false information is a criminal offense
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
                ← Back
              </button>
              <button
                type="submit"
                className="btn-primary btn-submit"
                disabled={loading}
              >
                {loading ? '⏳ Submitting...' : '✓ Submit Complaint'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewComplaint;
