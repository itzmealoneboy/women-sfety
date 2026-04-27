import React, { useState, useRef, useEffect } from 'react';

const UPIQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    payeeName: '',
    upiId: '',
    amount: '',
    note: ''
  });
  const [scanHistory, setScanHistory] = useState([]);
  const [flashlight, setFlashlight] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning]);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        startQRDetection();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanner = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startQRDetection = () => {
    // Simulate QR detection
    setTimeout(() => {
      const mockQRData = {
        upiId: 'merchant@okhdfcbank',
        payeeName: 'ABC Store',
        amount: null
      };
      handleQRDetected(mockQRData);
    }, 2000);
  };

  const handleQRDetected = (data) => {
    setScannedData(data);
    setPaymentDetails({
      payeeName: data.payeeName,
      upiId: data.upiId,
      amount: '',
      note: ''
    });
    setIsScanning(false);
    
    // Add to history
    const newHistory = {
      id: Date.now(),
      upiId: data.upiId,
      payeeName: data.payeeName,
      date: new Date(),
      amount: null
    };
    setScanHistory([newHistory, ...scanHistory.slice(0, 9)]);
  };

  const handlePayment = () => {
    if (!paymentDetails.amount) {
      alert('Please enter amount');
      return;
    }
    
    const payment = {
      ...paymentDetails,
      date: new Date(),
      status: 'pending'
    };
    
    alert(`Payment of ₹${paymentDetails.amount} to ${paymentDetails.payeeName} initiated. Please confirm on UPI app.`);
    
    // Reset
    setScannedData(null);
    setPaymentDetails({
      payeeName: '',
      upiId: '',
      amount: '',
      note: ''
    });
  };

  const retryScan = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  return (
    <div className="upi-qr-scanner">
      <div className="scanner-header">
        <h2>UPI QR Scanner</h2>
        <p>Scan QR codes to make secure payments</p>
      </div>

      {!isScanning && !scannedData && (
        <div className="scan-start">
          <div className="scan-icon">📱</div>
          <button onClick={() => setIsScanning(true)} className="start-scan-btn">
            Start Scanning
          </button>
          <p className="scan-note">Point camera at UPI QR code</p>
        </div>
      )}

      {isScanning && (
        <div className="scanner-view">
          <video ref={videoRef} autoPlay playsInline className="scanner-video" />
          <div className="scanner-overlay">
            <div className="scanning-frame"></div>
            <div className="scanning-line"></div>
            <p className="scan-instruction">Align QR code within the frame</p>
            <button onClick={() => setIsScanning(false)} className="cancel-scan-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {scannedData && (
        <div className="payment-form">
          <div className="payment-header">
            <div className="success-icon">✓</div>
            <h3>QR Code Scanned!</h3>
            <p>Enter payment details</p>
          </div>

          <div className="form-group">
            <label>Payee Name</label>
            <input
              type="text"
              value={paymentDetails.payeeName}
              readOnly
              className="readonly"
            />
          </div>

          <div className="form-group">
            <label>UPI ID</label>
            <input
              type="text"
              value={paymentDetails.upiId}
              readOnly
              className="readonly"
            />
          </div>

          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              value={paymentDetails.amount}
              onChange={(e) => setPaymentDetails({...paymentDetails, amount: e.target.value})}
              placeholder="Enter amount"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Note (Optional)</label>
            <input
              type="text"
              value={paymentDetails.note}
              onChange={(e) => setPaymentDetails({...paymentDetails, note: e.target.value})}
              placeholder="Add a note"
            />
          </div>

          <div className="payment-actions">
            <button onClick={handlePayment} className="pay-btn">
              Pay ₹{paymentDetails.amount || '0'}
            </button>
            <button onClick={retryScan} className="rescan-btn">
              Scan Again
            </button>
          </div>
        </div>
      )}

      <div className="scan-history">
        <h3>Recent Scans</h3>
        <div className="history-list">
          {scanHistory.map(scan => (
            <div key={scan.id} className="history-item">
              <div className="history-icon">📱</div>
              <div className="history-details">
                <div className="history-merchant">{scan.payeeName}</div>
                <div className="history-upi">{scan.upiId}</div>
                <div className="history-date">{new Date(scan.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="safety-tips">
        <h3>Safe QR Scanning Tips</h3>
        <div className="tips-list">
          <div className="tip">✓ Verify merchant name before payment</div>
          <div className="tip">✓ Never scan unknown QR codes</div>
          <div className="tip">✓ Check amount before confirming</div>
          <div className="tip">✓ Use trusted UPI apps for payments</div>
        </div>
      </div>

      <style jsx>{`
        .upi-qr-scanner {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .scanner-header {
          margin-bottom: 30px;
        }

        .scanner-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .scanner-header p {
          margin: 0;
          color: #666;
        }

        .scan-start {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 12px;
        }

        .scan-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .start-scan-btn {
          padding: 12px 32px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .scan-note {
          margin-top: 15px;
          color: #666;
        }

        .scanner-view {
          position: relative;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/3;
          margin-bottom: 20px;
        }

        .scanner-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .scanner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .scanning-frame {
          width: 250px;
          height: 250px;
          border: 2px solid #00ff00;
          border-radius: 12px;
          box-shadow: 0 0 0 1000px rgba(0,0,0,0.5);
        }

        .scanning-line {
          position: absolute;
          width: 250px;
          height: 2px;
          background: #00ff00;
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { top: 25%; }
          50% { top: 75%; }
          100% { top: 25%; }
        }

        .scan-instruction {
          position: absolute;
          bottom: 80px;
          color: white;
          background: rgba(0,0,0,0.7);
          padding: 8px 16px;
          border-radius: 20px;
        }

        .cancel-scan-btn {
          position: absolute;
          bottom: 20px;
          padding: 10px 24px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .payment-form {
          background: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .success-icon {
          width: 50px;
          height: 50px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin-bottom: 15px;
        }

        .payment-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .payment-header p {
          margin: 0;
          color: #666;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .form-group input.readonly {
          background: #f8f9fa;
          color: #333;
        }

        .payment-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .pay-btn, .rescan-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .pay-btn {
          background: #28a745;
          color: white;
        }

        .rescan-btn {
          background: #6c757d;
          color: white;
        }

        .scan-history {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .scan-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .history-icon {
          font-size: 24px;
        }

        .history-details {
          flex: 1;
        }

        .history-merchant {
          font-weight: bold;
          color: #333;
        }

        .history-upi {
          font-size: 12px;
          color: #666;
        }

        .history-date {
          font-size: 11px;
          color: #999;
        }

        .safety-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .safety-tips h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tip {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default UPIQRScanner;