import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle, CheckCircle, Shield, Link2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function URLScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const mockScanResults = {
    safe: {
      status: 'safe',
      message: 'This URL appears to be safe',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle,
      details: {
        reputation: 'Good',
        age: '2 years',
        category: 'Legitimate',
        threats: 0
      }
    },
    suspicious: {
      status: 'suspicious',
      message: 'This URL shows suspicious activity',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: AlertTriangle,
      details: {
        reputation: 'Poor',
        age: '3 months',
        category: 'Suspicious',
        threats: 3
      }
    },
    malicious: {
      status: 'malicious',
      message: '⚠️ MALICIOUS URL DETECTED! Do not proceed!',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: AlertTriangle,
      details: {
        reputation: 'Dangerous',
        age: '1 week',
        category: 'Phishing/Malware',
        threats: 12
      }
    }
  }

  const handleScan = async () => {
    if (!url) {
      toast.error('Please enter a URL to scan')
      return
    }

    if (!url.match(/^https?:\/\//)) {
      toast.error('Please include http:// or https://')
      return
    }

    setScanning(true)
    setResult(null)

    // Simulate API call
    setTimeout(() => {
      // Random result for demo
      const random = Math.random()
      let scanResult
      if (random < 0.6) scanResult = mockScanResults.safe
      else if (random < 0.8) scanResult = mockScanResults.suspicious
      else scanResult = mockScanResults.malicious
      
      setResult(scanResult)
      setScanning(false)
      
      if (scanResult.status === 'malicious') {
        toast.error('Malicious URL detected! Do not visit this site.')
      } else if (scanResult.status === 'suspicious') {
        toast.warning('Suspicious URL detected. Proceed with caution.')
      } else {
        toast.success('URL appears to be safe')
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">URL Safety Scanner</h3>
            <p className="text-blue-100">Check if a link is safe before clicking</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center space-x-2"
          >
            {scanning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Scan URL</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 ${result.bgColor} rounded-lg p-6`}
          >
            <div className="flex items-start space-x-3">
              <result.icon size={24} className={result.color} />
              <div className="flex-1">
                <h4 className={`font-semibold ${result.color} mb-2`}>{result.message}</h4>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-600">Reputation Score</p>
                    <p className="font-medium">{result.details.reputation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Domain Age</p>
                    <p className="font-medium">{result.details.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Category</p>
                    <p className="font-medium">{result.details.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Threats Detected</p>
                    <p className="font-medium">{result.details.threats}</p>
                  </div>
                </div>

                {result.status === 'malicious' && (
                  <div className="mt-4 p-3 bg-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ This URL is associated with phishing/malware. Do not enter any personal information!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Safety Tips</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Always check URLs before clicking</li>
            <li>• Look for HTTPS in the URL</li>
            <li>• Be wary of shortened links</li>
            <li>• Don't enter personal info on suspicious sites</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Red Flags to Watch For</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Spelling errors in domain names</li>
            <li>• Unusual or excessive pop-ups</li>
            <li>• Requests for sensitive information</li>
            <li>• Too-good-to-be-true offers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
