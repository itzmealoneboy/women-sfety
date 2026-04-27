import React, { useState, useRef, useEffect } from 'react';

const SpyCameraDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedDevices, setDetectedDevices] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [showIRMode, setShowIRMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [irDetectionActive, setIrDetectionActive] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (irDetectionActive) {
      startIRDetection();
    } else {
      stopIRDetection();
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [irDetectionActive]);

  const startScan = () => {
    setIsScanning(true);
    setDetectedDevices([]);
    setScanProgress(0);
    
    // Simulate RF frequency scanning for hidden cameras
    const frequencies = [2.4, 5.0, 5.8, 1.2, 2.2];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < frequencies.length) {
        setCurrentFrequency(frequencies[currentStep]);
        setScanProgress((currentStep + 1) / frequencies.length * 100);
        
        // Random detection simulation
        if (Math.random() > 0.7) {
          const newDevice = {
            id: Date.now() + currentStep,
            type: 'Wireless Camera',
            frequency: frequencies[currentStep],
            signalStrength: Math.floor(Math.random() * 100),
            location: `${['Bathroom', 'Bedroom', 'Living Room', 'Office'][Math.floor(Math.random() * 4)]}`,
            riskLevel: Math.random() > 0.8 ? 'High' : 'Medium',
            timestamp: new Date()
          };
          setDetectedDevices(prev => [...prev, newDevice]);
        }
        
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setCurrentFrequency(0);
      }
    }, 1500);
  };

  const startIRDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        detectIRReflections();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const detectIRReflections = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    const detect = () => {
      if (!irDetectionActive) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Detect IR reflections (bright spots in specific color ranges)
      let irSpots = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // IR cameras often show as bright white/purple spots
        if (r > 200 && g > 200 && b > 200 && (r - g) < 30 && (g - b) < 30) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          irSpots.push({ x, y, intensity: (r + g + b) / 3 });
        }
      }
      
      if (irSpots.length > 0) {
        const newDetection = {
          id: Date.now(),
          type: 'IR Camera Detected',
          spots: irSpots.length,
          location: 'Current View',
          timestamp: new Date()
        };
        setDetectedDevices(prev => [...prev, newDetection]);
      }
      
      animationRef.current = requestAnimationFrame(detect);
    };
    
    detect();
  };

  const stopIRDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'High': return '#dc3545';
      case 'Medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  return (
    <div className="spy-camera-detection">
      <div className="detection-header">
        <h2>Spy Camera Detection</h2>
        <p>Advanced RF and IR scanning to detect hidden cameras</p>
      </div>

      <div className="detection-modes">
        <div className="mode-card">
          <div className="mode-icon">📡</div>
          <h3>RF Frequency Scan</h3>
          <p>Detect wireless cameras by scanning radio frequencies</p>
          <button onClick={startScan} disabled={isScanning} className="scan-btn">
            {isScanning ? 'Scanning...' : 'Start RF Scan'}
          </button>
        </div>
        
        <div className="mode-card">
          <div className="mode-icon">🔦</div>
          <h3>IR Lens Detection</h3>
          <p>Use camera to detect infrared reflections from hidden cameras</p>
          <button onClick={() => {
            if (!irDetectionActive) {
              setIrDetectionActive(true);
              setShowIRMode(true);
            } else {
              setIrDetectionActive(false);
              setShowIRMode(false);
            }
          }} className="scan-btn">
            {irDetectionActive ? 'Stop Detection' : 'Start IR Detection'}
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="scan-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${scanProgress}%` }} />
          </div>
          <div className="frequency-display">
            Scanning Frequency: {currentFrequency} GHz
          </div>
        </div>
      )}

      {showIRMode && (
        <div className="ir-detection-view">
          <h3>IR Detection Mode</h3>
          <div className="camera-view">
            <video ref={videoRef} autoPlay playsInline className="camera-feed" />
            <div className="ir-overlay">
              <div className="ir-instruction">
                Move camera slowly around the room to detect IR reflections
              </div>
            </div>
          </div>
        </div>
      )}

      {detectedDevices.length > 0 && (
        <div className="detected-devices">
          <h3>Detected Devices</h3>
          <div className="devices-list">
            {detectedDevices.map(device => (
              <div key={device.id} className="device-card">
                <div className="device-icon">📹</div>
                <div className="device-info">
                  <div className="device-type">{device.type}</div>
                  <div className="device-details">
                    {device.frequency && <span>Frequency: {device.frequency} GHz</span>}
                    {device.signalStrength && <span>Signal: {device.signalStrength}%</span>}
                    {device.location && <span>Location: {device.location}</span>}
                    {device.spots && <span>IR Spots: {device.spots}</span>}
                  </div>
                  <div className="device-time">{device.timestamp.toLocaleTimeString()}</div>
                </div>
                {device.riskLevel && (
                  <div className="device-risk" style={{ backgroundColor: getRiskColor(device.riskLevel) }}>
                    {device.riskLevel} Risk
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="safety-tips">
        <h3>Safety Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <h4>Regular Scans</h4>
            <p>Perform regular scans in hotels, changing rooms, and private spaces</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <h4>Check Lights</h4>
            <p>Turn off lights and look for unusual LED glows</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <h4>Use Phone Camera</h4>
            <p>Your phone camera can detect IR lights from hidden cameras</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔌</div>
            <h4>Check Outlets</h4>
            <p>Inspect electrical outlets and smoke detectors for irregularities</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spy-camera-detection {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .detection-header {
          margin-bottom: 30px;
        }

        .detection-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .detection-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .detection-modes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .mode-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .mode-card:hover {
          transform: translateY(-2px);
        }

        .mode-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .mode-card h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .mode-card p {
          color: #666;
          margin-bottom: 20px;
        }

        .scan-btn {
          padding: 10px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .scan-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .scan-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .scan-progress {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .progress-bar {
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: #007bff;
          transition: width 0.3s ease;
        }

        .frequency-display {
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .ir-detection-view {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .ir-detection-view h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .camera-view {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 4/3;
        }

        .camera-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ir-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          padding: 20px;
        }

        .ir-instruction {
          color: white;
          text-align: center;
          font-size: 14px;
        }

        .detected-devices {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .detected-devices h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .devices-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .device-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s;
        }

        .device-card:hover {
          transform: translateX(5px);
        }

        .device-icon {
          font-size: 32px;
        }

        .device-info {
          flex: 1;
        }

        .device-type {
          font-weight: bold;
          color: #dc3545;
          margin-bottom: 5px;
        }

        .device-details {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .device-time {
          font-size: 11px;
          color: #999;
        }

        .device-risk {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .safety-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .safety-tips h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .tip-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .tip-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .tip-card h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .tip-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default SpyCameraDetection;
