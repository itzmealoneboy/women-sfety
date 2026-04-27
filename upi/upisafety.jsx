import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  BanknotesIcon,
  ClockIcon,
  PhoneIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import { QrCodeIcon as QrCodeIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const UPISafety = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('check');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [safeUpiIds, setSafeUpiIds] = useState([]);
  const [blockedUpiIds, setBlockedUpiIds] = useState([]);

  const tabs = [
    { id: 'check', name: 'Check Safety', icon: ShieldCheckIcon },
    { id: 'scan', name: 'Scan QR', icon: QrCodeIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
    { id: 'report', name: 'Report Fraud', icon: ExclamationTriangleIcon }
  ];

  const fraudKeywords = [
    'kyc', 'refund', 'urgent', 'lottery', 'verify', 
    'update', 'otp', 'free', 'blocked', 'prize',
    'winner', 'claim', 'limited', 'offer', 'bank',
    'account', 'suspended', 'click', 'link', 'password',
    'aadhaar', 'pan', 'card', 'loan', 'insurance'
  ];

  const commonScams = [
    {
      id: 1,
      title: 'KYC Update Scam',
      description: 'Fake messages claiming your bank KYC is expired and asking you to click a link.',
      prevention: 'Never click links in messages. Always visit bank website directly.',
      keywords: ['kyc', 'update', 'expired', 'blocked']
    },
    {
      id: 2,
      title: 'Refund Scam',
      description: 'Messages claiming you have a refund pending and asking for bank details.',
      prevention: 'Banks never ask for OTP or PIN for refunds.',
      keywords: ['refund', 'cashback', 'money back', 'credit']
    },
    {
      id: 3,
      title: 'Lottery Scam',
      description: 'You won a lottery you never entered. They ask for processing fee.',
      prevention: 'If you didn\'t enter, you didn\'t win. No lottery asks for money.',
      keywords: ['lottery', 'winner', 'prize', 'lucky draw']
    },
    {
      id: 4,
      title: 'Fake UPI Request',
      description: 'Fraudsters send UPI collect requests with fake descriptions.',
      prevention: 'Never approve collect requests from unknown numbers.',
      keywords: ['collect', 'request', 'payment pending']
    }
  ];

  const handleCheckSafety = () => {
    if (!upiId && !message) {
      toast.error('Please enter UPI ID or message to check');
      return;
    }

    setChecking(true);
    
    setTimeout(() => {
      let riskScore = 0;
      const detectedKeywords = [];

      // Check message for fraud keywords
      if (message) {
        const lowerMessage = message.toLowerCase();
        fraudKeywords.forEach(keyword => {
          if (lowerMessage.includes(keyword)) {
            riskScore += 15;
            detectedKeywords.push(keyword);
          }
        });
      }

      // Check UPI ID format
      if (upiId) {
        if (!upiId.includes('@')) {
          riskScore += 20;
          detectedKeywords.push('invalid UPI format');
        }

        // Check against blocked list
        if (blockedUpiIds.includes(upiId)) {
          riskScore += 50;
          detectedKeywords.push('reported as fraudulent');
        }

        // Check against safe list
        if (safeUpiIds.includes(upiId)) {
          riskScore -= 30;
        }
      }

      // Amount based risk
      const amountNum = parseFloat(amount);
      if (amountNum > 50000) {
        riskScore += 30;
        detectedKeywords.push('high amount');
      } else if (amountNum > 10000) {
        riskScore += 15;
        detectedKeywords.push('moderate amount');
      }

      // Calculate final risk level
      let riskLevel, color, advice;
      if (riskScore < 30) {
        riskLevel = 'Low Risk';
        color = 'text-success bg-success/10';
        advice = 'Transaction appears safe. Proceed with normal caution.';
      } else if (riskScore < 60) {
        riskLevel = 'Medium Risk';
        color = 'text-warning bg-warning/10';
        advice = 'Exercise caution. Verify the recipient before proceeding.';
      } else {
        riskLevel = 'High Risk';
        color = 'text-danger bg-danger/10';
        advice = 'DO NOT PROCEED! This appears to be a scam.';
      }

      setScanResult({
        riskScore,
        riskLevel,
        color,
        advice,
        detectedKeywords: detectedKeywords.slice(0, 5)
      });

      setChecking(false);
    }, 1500);
  };

  const handleScanQR = () => {
    toast.info('Opening camera to scan QR code...');
    // In real app, implement QR scanner
    setTimeout(() => {
      toast.success('QR code scanned!');
      setUpiId('merchant@okhdfcbank');
    }, 2000);
  };

  const handleReportFraud = () => {
    if (!upiId && !message) {
      toast.error('Please provide transaction details');
      return;
    }

    const report = {
      id: Date.now(),
      upiId,
      message,
      amount,
      timestamp: new Date().toLocaleString(),
      status: 'reported'
    };

    setFraudReports([report, ...fraudReports]);
    setBlockedUpiIds([...blockedUpiIds, upiId]);
    
    toast.success('Fraud reported to cyber cell. Helpline: 1930');
    
    // Reset form
    setUpiId('');
    setAmount('');
    setMessage('');
  };

  const handleAddToSafeList = () => {
    if (!upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    setSafeUpiIds([...safeUpiIds, upiId]);
    toast.success(`${upiId} added to trusted list`);
  };

  const callHelpline = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          💳 UPI Safety & Fraud Protection
        </h1>
        <p className="text-gray-600 mt-1">
          Check transaction safety and protect yourself from UPI scams
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-danger to-red-600 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <div>
              <p className="font-bold">Cyber Crime Helpline</p>
              <p className="text-sm opacity-90">Report fraud immediately</p>
            </div>
          </div>
          <Button
            variant="white"
            onClick={() => callHelpline('1930')}
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            Call 1930
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Check Safety Tab */}
        {activeTab === 'check' && (
          <>
            <Card>
              <h3 className="text-lg font-semibold mb-4">Check Transaction Safety</h3>

              <div className="space-y-4">
                <Input
                  label="UPI ID / Receiver"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g., merchant@okhdfcbank"
                  icon={<CreditCardIcon className="w-5 h-5" />}
                />

                <Input
                  label="Amount (₹)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  icon={<BanknotesIcon className="w-5 h-5" />}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message / SMS Received
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Paste any suspicious message or SMS here..."
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCheckSafety}
                  loading={checking}
                >
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Check Safety
                </Button>
              </div>
            </Card>

            {/* Scan Result */}
            {scanResult && (
              <Card className={`${scanResult.color} border-2`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    scanResult.riskLevel === 'Low Risk' ? 'bg-success/20' :
                    scanResult.riskLevel === 'Medium Risk' ? 'bg-warning/20' :
                    'bg-danger/20'
                  }`}>
                    {scanResult.riskLevel === 'Low Risk' ? (
                      <CheckCircleIcon className="w-6 h-6 text-success" />
                    ) : scanResult.riskLevel === 'Medium Risk' ? (
                      <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
                    ) : (
                      <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{scanResult.riskLevel}</h4>
                    <p className="text-sm mb-2">Risk Score: {scanResult.riskScore}%</p>
                    
                    {scanResult.detectedKeywords.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium mb-1">⚠️ Suspicious keywords detected:</p>
                        <div className="flex flex-wrap gap-1">
                          {scanResult.detectedKeywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="text-xs bg-white/20 px-2 py-1 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-sm font-medium">{scanResult.advice}</p>

                    {scanResult.riskLevel !== 'Low Risk' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleReportFraud}
                        >
                          Report Fraud
                        </Button>
                        {upiId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddToSafeList}
                          >
                            Trust this UPI
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Common Scams */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Common Scams to Watch Out For</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonScams.map((scam) => (
                  <div key={scam.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-danger mb-2">{scam.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{scam.description}</p>
                    <p className="text-xs text-success font-medium">✅ {scam.prevention}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {scam.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Scan QR Tab */}
        {activeTab === 'scan' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>

            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                <QrCodeIconSolid className="w-24 h-24 text-gray-400" />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Position the QR code within the frame to scan
              </p>

              <Button
                variant="primary"
                onClick={handleScanQR}
                className="mb-4"
              >
                <QrCodeIcon className="w-5 h-5 mr-2" />
                Open Scanner
              </Button>

              {upiId && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Scanned UPI ID:</p>
                  <p className="text-lg font-mono">{upiId}</p>
                  <Button
                    variant="success"
                    size="sm"
                    className="mt-3"
                    onClick={handleCheckSafety}
                  >
                    Check Safety
                  </Button>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                <p>• Only scan QR codes from trusted sources</p>
                <p>• Verify the amount before approving payment</p>
                <p>• Never scan QR codes received via email or SMS</p>
              </div>
            </div>
          </Card>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

            {transactionHistory.length === 0 && fraudReports.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No transaction history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fraudReports.map((report) => (
                  <div key={report.id} className="p-3 bg-danger/10 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-danger">🚨 Reported Fraud</span>
                      <span className="text-xs text-gray-500">{report.timestamp}</span>
                    </div>
                    <p className="text-sm">UPI: {report.upiId || 'N/A'}</p>
                    {report.amount && <p className="text-sm">Amount: ₹{report.amount}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Report Fraud Tab */}
        {activeTab === 'report' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Report Fraud</h3>

            <div className="space-y-4">
              <Input
                label="Fraudulent UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter the UPI ID used in fraud"
              />

              <Input
                label="Amount Lost (if any)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Describe what happened..."
                />
              </div>

              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-medium text-primary-800 mb-2">Steps to take:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-primary-700">
                  <li>Call Cyber Crime Helpline: 1930 immediately</li>
                  <li>Report to your bank and block your account</li>
                  <li>Save all transaction details and messages</li>
                  <li>File a complaint on cybercrime.gov.in</li>
                  <li>Visit nearest police station for FIR</li>
                </ol>
              </div>

              <Button
                variant="danger"
                className="w-full"
                onClick={handleReportFraud}
              >
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                Report Fraud
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Safety Tips */}
      <Card className="bg-primary-50 border border-primary-200">
        <h4 className="font-medium text-primary-800 mb-3">UPI Safety Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-primary-700">
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
            <span>Never share your UPI PIN with anyone</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
            <span>Verify UPI ID before making payment</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
            <span>Don't click on unknown payment links</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
            <span>Check amount carefully before approving</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
            <span>Never scan QR codes from unknown sources</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
            <span>Enable transaction alerts on your phone</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UPISafety;
