import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Smartphone, CreditCard, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FraudDetection() {
  const [transactionId, setTransactionId] = useState('')
  const [amount, setAmount] = useState('')
  const [merchant, setMerchant] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const analyzeTransaction = () => {
    if (!transactionId || !amount) {
      toast.error('Please enter transaction details')
      return
    }

    setScanning(true)
    
    // Simulate fraud detection
    setTimeout(() => {
      const amountNum = parseFloat(amount)
      const isSuspicious = amountNum > 10000 || merchant?.toLowerCase().includes('unknown')
      
      setResult({
        isFraud: isSuspicious && Math.random() > 0.5,
        riskScore: isSuspicious ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 40),
        flags: [
          amountNum > 10000 && 'Unusually high amount',
          merchant?.toLowerCase().includes('unknown') && 'Unknown merchant',
          !merchant && 'Missing merchant details',
          amountNum > 50000 && 'Exceeds daily limit'
        ].filter(Boolean),
        recommendations: [
          'Verify transaction with bank',
          'Check account balance',
          'Enable transaction alerts',
          'Set transaction limits'
        ]
      })
      
      setScanning(false)
      
      if (isSuspicious) {
        toast.warning('Suspicious transaction detected!')
      } else {
        toast.success('Transaction appears normal')
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">UPI Fraud Detection</h3>
            <p className="text-green-100">Analyze transactions for potential fraud</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID / UPI Reference
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g., 1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant / Recipient
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Merchant name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            onClick={analyzeTransaction}
            disabled={scanning}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {scanning ? 'Analyzing Transaction...' : 'Analyze Transaction'}
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              result.isFraud ? 'bg-red-50' : result.riskScore > 50 ? 'bg-yellow-50' : 'bg-green-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {result.isFraud ? (
                  <AlertTriangle className="text-red-600" size={24} />
                ) : result.riskScore > 50 ? (
                  <AlertTriangle className="text-yellow-600" size={24} />
                ) : (
                  <CheckCircle className="text-green-600" size={24} />
                )}
                <h4 className={`font-semibold ${
                  result.isFraud ? 'text-red-800' : result.riskScore > 50 ? 'text-yellow-800' : 'text-green-800'
                }`}>
                  {result.isFraud ? 'High Risk - Potential Fraud' : 
                   result.riskScore > 50 ? 'Medium Risk - Caution Advised' : 
                   'Low Risk - Transaction Appears Safe'}
                </h4>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className={`text-xl font-bold ${
                  result.isFraud ? 'text-red-600' : result.riskScore > 50 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {result.riskScore}%
                </p>
              </div>
            </div>

            {result.flags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Flagged Issues:</p>
                <ul className="space-y-1">
                  {result.flags.map((flag, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
              <ul className="space-y-1">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center space-x-2">
                    <Shield size={12} className="text-primary-600" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.isFraud && (
              <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                Report Fraud Immediately
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <Smartphone className="mx-auto text-primary-600 mb-2" size={32} />
          <h4 className="font-semibold text-gray-900">Never Share OTP</h4>
          <p className="text-sm text-gray-600 mt-1">Bank never asks for OTP</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <CreditCard className="mx-auto text-primary-600 mb-2" size={32} />
          <h4 className="font-semibold text-gray-900">Check Transaction Limits</h4>
          <p className="text-sm text-gray-600 mt-1">Set daily limits for safety</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Shield className="mx-auto text-primary-600 mb-2" size={32} />
          <h4 className="font-semibold text-gray-900">Enable Two-Factor</h4>
          <p className="text-sm text-gray-600 mt-1">Extra layer of security</p>
        </div>
      </div>
    </div>
  )
}
