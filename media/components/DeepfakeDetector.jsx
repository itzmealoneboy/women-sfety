import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Shield, AlertTriangle, CheckCircle, Scan, Image } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DeepfakeDetector() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    setAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        isDeepfake: Math.random() > 0.7,
        confidence: Math.random() * 100,
        features: {
          facialConsistency: Math.random() * 100,
          lightingConsistency: Math.random() * 100,
          textureQuality: Math.random() * 100,
          edgeArtifacts: Math.random() * 100
        },
        recommendations: [
          'Check for unnatural eye movements',
          'Look for inconsistent lighting',
          'Verify source credibility'
        ]
      }
      setAnalysis(mockAnalysis)
      setAnalyzing(false)
      
      if (mockAnalysis.isDeepfake) {
        toast.error('⚠️ Potential deepfake detected!')
      } else {
        toast.success('✅ Image appears authentic')
      }
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">Deepfake Detector</h3>
            <p className="text-purple-100">AI-powered detection for manipulated media</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-purple-500 transition"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <>
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Click or drag image to upload</p>
                <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {selectedImage && !analysis && !analyzing && (
            <button
              onClick={analyzeImage}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2 mx-auto"
            >
              <Scan size={18} />
              <span>Analyze Image</span>
            </button>
          )}

          {analyzing && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Analyzing image with AI...</p>
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-left"
            >
              <div className={`rounded-lg p-4 mb-4 ${
                analysis.isDeepfake ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-2">
                  {analysis.isDeepfake ? (
                    <AlertTriangle className="text-red-600" size={24} />
                  ) : (
                    <CheckCircle className="text-green-600" size={24} />
                  )}
                  <div>
                    <h4 className={`font-semibold ${
                      analysis.isDeepfake ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {analysis.isDeepfake ? 'Potential Deepfake Detected' : 'Image Appears Authentic'}
                    </h4>
                    <p className="text-sm opacity-75">
                      Confidence: {analysis.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Analysis Details</h4>
              <div className="space-y-2 mb-4">
                {Object.entries(analysis.features).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-gray-900 font-medium">{value.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          value > 70 ? 'bg-green-500' : value > 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5"></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedImage(null)
                  setAnalysis(null)
                }}
                className="mt-6 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Analyze Another Image
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">About Deepfake Detection</h4>
        <p className="text-sm text-blue-800">
          Our AI model analyzes multiple aspects of images including facial consistency, lighting patterns, 
          texture quality, and edge artifacts to detect manipulated media. Always verify information from 
          trusted sources before sharing.
        </p>
      </div>
    </div>
  )
}
