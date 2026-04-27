import React, { useState, useRef, useEffect } from 'react';

const CameraControls = () => {
  const [isActive, setIsActive] = useState(false);
  const [cameraMode, setCameraMode] = useState('photo');
  const [flash, setFlash] = useState('off');
  const [zoom, setZoom] = useState(1);
  const [capturedImages, setCapturedImages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [imageQuality, setImageQuality] = useState('high');
  const [gridEnabled, setGridEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, facingMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { exact: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          zoom: zoom
        }
      };
      
      if (torchEnabled) {
        constraints.video.torch = true;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (recording) {
      stopRecording();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions based on quality
    let width, height;
    switch(imageQuality) {
      case 'high':
        width = video.videoWidth;
        height = video.videoHeight;
        break;
      case 'medium':
        width = video.videoWidth * 0.75;
        height = video.videoHeight * 0.75;
        break;
      default:
        width = video.videoWidth * 0.5;
        height = video.videoHeight * 0.5;
    }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    
    // Apply grid if enabled
    if (gridEnabled) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      const stepX = width / 3;
      const stepY = height / 3;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(stepX * i, 0);
        ctx.lineTo(stepX * i, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, stepY * i);
        ctx.lineTo(width, stepY * i);
        ctx.stroke();
      }
    }
    
    const imageData = canvas.toDataURL('image/jpeg', imageQuality === 'high' ? 0.95 : imageQuality === 'medium' ? 0.85 : 0.75);
    
    const newPhoto = {
      id: Date.now(),
      data: imageData,
      timestamp: new Date(),
      size: Math.round(imageData.length / 1024),
      quality: imageQuality
    };
    
    setCapturedImages([newPhoto, ...capturedImages]);
    
    // Play shutter sound effect
    playShutterSound();
  };

  const playShutterSound = () => {
    const audio = new Audio('/shutter-sound.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    recordedChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    };
    
    mediaRecorderRef.current.start();
    setRecording(true);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFlash = () => {
    const modes = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flash);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setFlash(nextMode);
    
    // Simulate flash control
    if (nextMode === 'on') {
      console.log('Flash enabled');
    }
  };

  const toggleTorch = () => {
    setTorchEnabled(!torchEnabled);
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        track.applyConstraints({
          advanced: [{ torch: !torchEnabled }]
        }).catch(e => console.log('Torch not supported'));
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const adjustZoom = (delta) => {
    const newZoom = Math.max(1, Math.min(5, zoom + delta));
    setZoom(newZoom);
    
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && track.getCapabilities().zoom) {
        track.applyConstraints({
          advanced: [{ zoom: newZoom }]
        });
      }
    }
  };

  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.download = `photo-${image.id}.jpg`;
    link.href = image.data;
    link.click();
  };

  const deleteImage = (id) => {
    setCapturedImages(capturedImages.filter(img => img.id !== id));
  };

  return (
    <div className="camera-controls">
      <div className="camera-header">
        <h2>Camera Controls</h2>
        <p>Advanced camera controls for evidence capture</p>
      </div>

      <div className="camera-container">
        <div className="camera-view">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-feed"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {gridEnabled && (
            <div className="camera-grid">
              <div className="grid-line horizontal"></div>
              <div className="grid-line horizontal" style={{ top: '33.33%' }}></div>
              <div className="grid-line horizontal" style={{ top: '66.66%' }}></div>
              <div className="grid-line vertical"></div>
              <div className="grid-line vertical" style={{ left: '33.33%' }}></div>
              <div className="grid-line vertical" style={{ left: '66.66%' }}></div>
            </div>
          )}
          
          {recording && (
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <div className="recording-time">{formatTime(recordingTime)}</div>
            </div>
          )}
        </div>

        <div className="camera-controls-panel">
          <div className="control-group">
            <button onClick={() => setCameraMode('photo')} className={`mode-btn ${cameraMode === 'photo' ? 'active' : ''}`}>
              📷 Photo
            </button>
            <button onClick={() => setCameraMode('video')} className={`mode-btn ${cameraMode === 'video' ? 'active' : ''}`}>
              🎥 Video
            </button>
          </div>

          <div className="control-group">
            <button onClick={toggleFlash} className="control-btn" title={`Flash: ${flash}`}>
              ⚡ {flash === 'on' ? 'On' : flash === 'auto' ? 'Auto' : 'Off'}
            </button>
            <button onClick={toggleTorch} className={`control-btn ${torchEnabled ? 'active' : ''}`} title="Torch">
              🔦
            </button>
            <button onClick={switchCamera} className="control-btn" title="Switch Camera">
              🔄
            </button>
            <button onClick={() => setGridEnabled(!gridEnabled)} className={`control-btn ${gridEnabled ? 'active' : ''}`} title="Grid">
              🔲
            </button>
          </div>

          <div className="control-group">
            <button onClick={() => adjustZoom(-0.5)} className="zoom-btn" title="Zoom Out">-</button>
            <span className="zoom-value">{zoom}x</span>
            <button onClick={() => adjustZoom(0.5)} className="zoom-btn" title="Zoom In">+</button>
          </div>

          <div className="control-group">
            <select value={imageQuality} onChange={(e) => setImageQuality(e.target.value)} className="quality-select">
              <option value="low">Low Quality</option>
              <option value="medium">Medium Quality</option>
              <option value="high">High Quality</option>
            </select>
          </div>

          <div className="capture-section">
            {cameraMode === 'photo' ? (
              <button onClick={capturePhoto} className="capture-btn">
                Capture
              </button>
            ) : (
              <button onClick={recording ? stopRecording : startRecording} className={`capture-btn ${recording ? 'recording' : ''}`}>
                {recording ? 'Stop Recording' : 'Start Recording'}
              </button>
            )}
          </div>
        </div>
      </div>

      {capturedImages.length > 0 && (
        <div className="captured-gallery">
          <h3>Captured Images</h3>
          <div className="gallery-grid">
            {capturedImages.map(img => (
              <div key={img.id} className="gallery-item">
                <img src={img.data} alt={`Captured ${new Date(img.timestamp).toLocaleTimeString()}`} />
                <div className="gallery-info">
                  <span>{new Date(img.timestamp).toLocaleTimeString()}</span>
                  <span>{img.size} KB</span>
                </div>
                <div className="gallery-actions">
                  <button onClick={() => downloadImage(img)} className="download-btn">💾</button>
                  <button onClick={() => deleteImage(img.id)} className="delete-btn">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .camera-controls {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .camera-header {
          margin-bottom: 30px;
        }

        .camera-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .camera-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .camera-container {
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .camera-view {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
        }

        .camera-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .camera-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .grid-line {
          position: absolute;
          background: rgba(255,255,255,0.3);
        }

        .grid-line.horizontal {
          left: 0;
          right: 0;
          height: 1px;
        }

        .grid-line.vertical {
          top: 0;
          bottom: 0;
          width: 1px;
        }

        .recording-indicator {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.6);
          padding: 8px 12px;
          border-radius: 20px;
          color: white;
        }

        .recording-dot {
          width: 10px;
          height: 10px;
          background: #dc3545;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .camera-controls-panel {
          padding: 20px;
          background: #1a1a1a;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: center;
          justify-content: center;
        }

        .control-group {
          display: flex;
          gap: 10px;
          align-items: center;
          background: #2a2a2a;
          padding: 8px 15px;
          border-radius: 40px;
        }

        .mode-btn, .control-btn, .zoom-btn {
          padding: 8px 16px;
          background: #3a3a3a;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn.active {
          background: #007bff;
        }

        .control-btn.active {
          background: #ffc107;
          color: #333;
        }

        .zoom-btn {
          width: 36px;
          height: 36px;
          padding: 0;
          border-radius: 50%;
          font-size: 18px;
        }

        .zoom-value {
          color: white;
          font-weight: bold;
          min-width: 40px;
          text-align: center;
        }

        .quality-select {
          padding: 8px 12px;
          background: #3a3a3a;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .capture-section {
          margin-left: auto;
        }

        .capture-btn {
          padding: 12px 32px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .capture-btn:hover {
          background: #c82333;
          transform: scale(1.05);
        }

        .capture-btn.recording {
          background: #ffc107;
          color: #333;
          animation: pulse 1s infinite;
        }

        .captured-gallery {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .captured-gallery h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .gallery-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .gallery-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .gallery-info {
          padding: 8px;
          background: #f8f9fa;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
          color: #666;
        }

        .gallery-actions {
          position: absolute;
          top: 5px;
          right: 5px;
          display: flex;
          gap: 5px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .gallery-item:hover .gallery-actions {
          opacity: 1;
        }

        .download-btn, .delete-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .download-btn {
          background: #28a745;
          color: white;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        @media (max-width: 768px) {
          .camera-controls-panel {
            flex-direction: column;
          }
          
          .control-group {
            width: 100%;
            justify-content: center;
          }
          
          .capture-section {
            margin-left: 0;
            width: 100%;
          }
          
          .capture-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CameraControls;
