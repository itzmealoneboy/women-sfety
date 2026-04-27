import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, AlertCircle, Upload, FileText, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../../store/authstores'
import { db } from '../../../config/firebases'
import { collection, addDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function ComplaintForm() {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    complaintType: '',
    incidentDate: '',
    incidentDetails: '',
    suspectInfo: '',
    evidence: [],
    isAnonymous: false
  })
  const [evidenceFiles, setEvidenceFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const complaintTypes = [
    'Online Harassment',
    'Cyber Stalking',
    'Identity Theft',
    'Phishing Scam',
    'Social Media Fraud',
    'Financial Fraud',
    'Data Breach',
    'Other'
  ]

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: URL.createObjectURL(file)
    }))
    setEvidenceFiles([...evidenceFiles, ...newFiles])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await addDoc(collection(db, 'cyber_complaints'), {
        ...formData,
        userId: user?.uid,
        status: 'pending',
        complaintNumber: `CYC${Date.now()}`,
        createdAt: new Date().toISOString(),
        evidenceCount: evidenceFiles.length
      })
      
      toast.success('Complaint filed successfully! Reference ID: ' + `CYC${Date.now()}`)
      setFormData({
        complaintType: '',
        incidentDate: '',
        incidentDetails: '',
        suspectInfo: '',
        evidence: [],
        isAnonymous: false
      })
      setEvidenceFiles([])
    } catch (error) {
      toast.error('Failed to file complaint. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <AlertCircle size={32} />
          <div>
            <h3 className="text-xl font-bold">File Cyber Crime Complaint</h3>
            <p className="text-red-100">Report online harassment, fraud, and cyber crimes securely</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Complaint *
            </label>
            <select
              required
              value={formData.complaintType}
              onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select complaint type</option>
              {complaintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Incident *
            </label>
            <input
              type="date"
              required
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incident Details *
          </label>
          <textarea
            required
            rows={5}
            value={formData.incidentDetails}
            onChange={(e) => setFormData({ ...formData, incidentDetails: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Describe what happened, including URLs, usernames, and any relevant information..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suspect Information (if known)
          </label>
          <textarea
            rows={3}
            value={formData.suspectInfo}
            onChange={(e) => setFormData({ ...formData, suspectInfo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Name, username, email, phone number, or any identifying information..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Evidence
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-600 mb-2">Screenshots, chat logs, emails, or documents</p>
            <p className="text-sm text-gray-500 mb-3">Supported formats: JPG, PNG, PDF, DOC</p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="evidence-upload"
            />
            <label
              htmlFor="evidence-upload"
              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              Select Files
            </label>
          </div>
          
          {evidenceFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {evidenceFiles.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-primary-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">File anonymously</span>
          </label>
          
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            <Send size={18} />
            <span>{submitting ? 'Submitting...' : 'File Complaint'}</span>
          </button>
        </div>
      </form>

      <div className="bg-yellow-50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Lock size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Important Information</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All complaints are treated with confidentiality</li>
              <li>• Provide as much detail as possible for faster resolution</li>
              <li>• Save copies of all evidence for your records</li>
              <li>• You'll receive a complaint reference number for tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}





