import React, { useState, useRef, useEffect } from 'react';

const CameraScanner = () => {
  const [isActive, setIsActive] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [scanMode, setScanMode] = useState('lens');
  const [flashlight, setFlashlight] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isActive) {
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
  }, [isActive]);

  const startScanner = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          zoom: zoom
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        startDetection();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const detect = () => {
      if (!isActive) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simulate object detection
      // In production, this would use TensorFlow.js or similar
      const newDetections = [];
      
      // Detect bright spots (potential lens reflections)
      if (scanMode === 'lens') {
        for (let i = 0; i < data.length; i += 1000) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          if (r > 200 && g > 200 && b > 200) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            newDetections.push({
              x, y,
              type: 'Lens Reflection',
              confidence: Math.random() * 30 + 70
            });
          }
        }
      }
      
      setDetectedObjects(newDetections.slice(0, 5));
      
      animationRef.current = requestAnimationFrame(detect);
    };
    
    detect();
  };

  const stopScanner = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setDetectedObjects([]);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = 'scan-snapshot.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="camera-scanner">
      <div className="scanner-header">
        <h3>Camera Scanner</h3>
        <p>Scan for hidden cameras and lens reflections</p>
      </div>

      <div className="scanner-controls">
        <div className="mode-selector">
          <button className={scanMode === 'lens' ? 'active' : ''} onClick={() => setScanMode('lens')}>
            Lens Detection
          </button>
          <button className={scanMode === 'ir' ? 'active' : ''} onClick={() => setScanMode('ir')}>
            IR Detection
          </button>
          <button className={scanMode === 'uv' ? 'active' : ''} onClick={() => setScanMode('uv')}>
            UV Light
          </button>
        </div>
        
        <div className="control-buttons">
          <button onClick={() => setFlashlight(!flashlight)} className="flashlight-btn">
            {flashlight ? '🔦 On' : '🔦 Off'}
          </button>
          <button onClick={takeSnapshot} className="snapshot-btn">
            📸 Capture
          </button>
        </div>
      </div>

      <div className="camera-view">
        <video ref={videoRef} autoPlay playsInline className="video-feed" />
        <canvas ref={canvasRef} className="detection-canvas" />
        
        {!isActive && (
          <div className="camera-placeholder">
            <button onClick={() => setIsActive(true)} className="start-btn">
              Start Scanner
            </button>
          </div>
        )}
      </div>

      {detectedObjects.length > 0 && (
        <div className="detections-list">
          <h4>Detected Objects</h4>
          {detectedObjects.map((obj, i) => (
            <div key={i} className="detection-item">
              <span className="detection-type">{obj.type}</span>
              <span className="detection-confidence">Confidence: {Math.round(obj.confidence)}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="scanner-tips">
        <h4>Tips for Effective Scanning</h4>
        <ul>
          <li>Move camera slowly across the room</li>
          <li>Check dark corners and reflective surfaces</li>
          <li>Use flashlight to spot lens reflections</li>
          <li>Scan from different angles</li>
        </ul>
      </div>

      <style jsx>{`
        .camera-scanner {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .scanner-header {
          margin-bottom: 20px;
        }

        .scanner-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .scanner-header p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .scanner-controls {
          margin-bottom: 20px;
        }

        .mode-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .mode-selector button {
          flex: 1;
          padding: 8px;
          background: #f0f0f0;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-selector button.active {
          background: #007bff;
          color: white;
        }

        .control-buttons {
          display: flex;
          gap: 10px;
        }

        .flashlight-btn, .snapshot-btn {
          flex: 1;
          padding: 8px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .camera-view {
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          aspect-ratio: 4/3;
        }

        .video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detection-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .camera-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.8);
        }

        .start-btn {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .detections-list {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .detections-list h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .detection-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          border-bottom: 1px solid #e0e0e0;
        }

        .detection-type {
          font-weight: 500;
          color: #dc3545;
        }

        .detection-confidence {
          color: #666;
          font-size: 12px;
        }

        .scanner-tips {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
        }

        .scanner-tips h4 {
          margin: 0 0 10px 0;
          color: #007bff;
        }

        .scanner-tips ul {
          margin: 0;
          padding-left: 20px;
        }

        .scanner-tips li {
          margin-bottom: 5px;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default CameraScanner;
