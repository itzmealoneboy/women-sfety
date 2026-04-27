import React, { useState, useRef, useEffect } from 'react';

const FaceCamera = ({ onCapture, onFaceDetected }) => {
  const [isActive, setIsActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('No face detected');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        detectFace();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setDetectionStatus('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setFaceDetected(false);
    setDetectionStatus('Camera stopped');
  };

  const detectFace = () => {
    // Simulate face detection
    // In production, this would use a face detection API
    
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      animationFrameRef.current = setTimeout(() => detectFace(), 100);
      return;
    }
    
    // Simulate face detection with random success (80% chance)
    const hasFace = Math.random() > 0.2;
    
    if (hasFace) {
      setFaceDetected(true);
      setDetectionStatus('Face detected');
      
      // Simulate face position
      setFacePosition({
        x: video.videoWidth * 0.3 + Math.random() * 0.4,
        y: video.videoHeight * 0.2 + Math.random() * 0.4,
        width: video.videoWidth * 0.4,
        height: video.videoHeight * 0.4
      });
      
      if (onFaceDetected) {
        onFaceDetected(true);
      }
    } else {
      setFaceDetected(false);
      setDetectionStatus('No face detected');
      setFacePosition(null);
      
      if (onFaceDetected) {
        onFaceDetected(false);
      }
    }
    
    animationFrameRef.current = setTimeout(() => detectFace(), 500);
  };

  const captureImage = () => {
    if (!videoRef.current || !faceDetected) {
      setDetectionStatus('No face detected to capture');
      return;
    }
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw face outline if face detected
    if (facePosition) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(facePosition.x, facePosition.y, facePosition.width, facePosition.height);
      
      // Add detection markers
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillRect(facePosition.x, facePosition.y, facePosition.width, facePosition.height);
    }
    
    // Capture image
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    
    if (onCapture) {
      onCapture(imageData);
    }
    
    setTimeout(() => setIsCapturing(false), 1000);
  };

  const retakeImage = () => {
    setCapturedImage(null);
  };

  const getFaceGuidance = () => {
    if (!faceDetected) {
      return "Please position your face in the center of the frame";
    }
    
    if (facePosition && facePosition.width < videoRef.current?.videoWidth * 0.3) {
      return "Move closer to the camera";
    }
    
    if (facePosition && facePosition.width > videoRef.current?.videoWidth * 0.6) {
      return "Move slightly away from the camera";
    }
    
    return "Face detected - Good position";
  };

  return (
    <div className="face-camera">
      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="camera-feed"
        />
        
        {facePosition && faceDetected && (
          <div
            className="face-overlay"
            style={{
              left: `${(facePosition.x / videoRef.current?.videoWidth) * 100}%`,
              top: `${(facePosition.y / videoRef.current?.videoHeight) * 100}%`,
              width: `${(facePosition.width / videoRef.current?.videoWidth) * 100}%`,
              height: `${(facePosition.height / videoRef.current?.videoHeight) * 100}%`
            }}
          />
        )}
        
        {!isActive && (
          <div className="camera-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">📸</div>
              <p>Click Start Camera to begin</p>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      <div className="camera-controls">
        {!isActive ? (
          <button onClick={() => setIsActive(true)} className="btn-start-camera">
            Start Camera
          </button>
        ) : (
          <>
            <button onClick={stopCamera} className="btn-stop-camera">
              Stop Camera
            </button>
            {!capturedImage ? (
              <button 
                onClick={captureImage} 
                className="btn-capture"
                disabled={!faceDetected || isCapturing}
              >
                {isCapturing ? 'Capturing...' : 'Capture Face'}
              </button>
            ) : (
              <button onClick={retakeImage} className="btn-retake">
                Retake
              </button>
            )}
          </>
        )}
      </div>
      
      <div className="camera-status">
        <div className={`status-indicator ${faceDetected ? 'detected' : 'not-detected'}`}>
          <span className="status-dot"></span>
          <span className="status-text">{detectionStatus}</span>
        </div>
        
        {isActive && (
          <div className="face-guidance">
            <div className="guidance-icon">💡</div>
            <div className="guidance-text">{getFaceGuidance()}</div>
          </div>
        )}
        
        {capturedImage && (
          <div className="captured-preview">
            <h4>Captured Image</h4>
            <img src={capturedImage} alt="Captured face" className="preview-image" />
            <button className="btn-use-image" onClick={() => onCapture?.(capturedImage)}>
              Use This Image
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .face-camera {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .camera-container {
          position: relative;
          margin-bottom: 20px;
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

        .face-overlay {
          position: absolute;
          border: 3px solid #00ff00;
          border-radius: 8px;
          background: rgba(0, 255, 0, 0.1);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            border-color: #00ff00;
          }
          50% {
            border-color: #00cc00;
          }
        }

        .camera-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .placeholder-content {
          text-align: center;
        }

        .placeholder-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .camera-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .btn-start-camera, .btn-stop-camera, .btn-capture, .btn-retake {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-start-camera {
          background: #28a745;
          color: white;
        }

        .btn-start-camera:hover {
          background: #218838;
        }

        .btn-stop-camera {
          background: #dc3545;
          color: white;
        }

        .btn-stop-camera:hover {
          background: #c82333;
        }

        .btn-capture {
          background: #007bff;
          color: white;
        }

        .btn-capture:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-capture:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-retake {
          background: #ffc107;
          color: #333;
        }

        .btn-retake:hover {
          background: #e0a800;
        }

        .camera-status {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-indicator.detected .status-dot {
          background: #28a745;
          box-shadow: 0 0 5px #28a745;
        }

        .status-indicator.not-detected .status-dot {
          background: #dc3545;
        }

        .status-text {
          font-size: 14px;
          color: #333;
        }

        .face-guidance {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: #e7f3ff;
          border-radius: 6px;
          margin-bottom: 15px;
        }

        .guidance-icon {
          font-size: 20px;
        }

        .guidance-text {
          flex: 1;
          font-size: 13px;
          color: #0066cc;
        }

        .captured-preview {
          text-align: center;
        }

        .captured-preview h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .preview-image {
          max-width: 200px;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .btn-use-image {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default FaceCamera;
