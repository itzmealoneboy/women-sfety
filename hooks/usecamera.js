import { useState, useEffect, useCallback, useRef } from 'react';

export const useCamera = (options = {}) => {
  const {
    facingMode = 'user',
    width = 1280,
    height = 720,
    audio = false
  } = options;

  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);
  const [supported, setSupported] = useState(true);
  const [flashAvailable, setFlashAvailable] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomAvailable, setZoomAvailable] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Check if camera is supported
  useEffect(() => {
    setSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Get available cameras
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      if (videoDevices.length > 0 && !activeDeviceId) {
        setActiveDeviceId(videoDevices[0].deviceId);
      }
      
      return videoDevices;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [activeDeviceId]);

  // Request camera permission
  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio });
      setPermission('granted');
      
      // Stop the stream immediately after permission check
      stream.getTracks().forEach(track => track.stop());
      
      // Get available cameras
      await getCameras();
      
      return true;
    } catch (err) {
      setPermission('denied');
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [audio, getCameras]);

  // Start camera
  const startCamera = useCallback(async (deviceId = activeDeviceId) => {
    try {
      setLoading(true);
      setError(null);
      
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: deviceId ? undefined : facingMode,
          width: { ideal: width },
          height: { ideal: height }
        },
        audio
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(stream);
      streamRef.current = stream;
      
      // Check for flash/torch support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.();
      
      if (capabilities?.torch) {
        setFlashAvailable(true);
      }
      
      if (capabilities?.zoom) {
        setZoomAvailable(true);
      }
      
      setPermission('granted');
      
      return stream;
    } catch (err) {
      setError(err.message);
      setPermission('denied');
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeDeviceId, facingMode, width, height, audio]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Switch camera
  const switchCamera = useCallback(async () => {
    if (devices.length < 2) return;

    const currentIndex = devices.findIndex(d => d.deviceId === activeDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDeviceId = devices[nextIndex].deviceId;
    
    setActiveDeviceId(nextDeviceId);
    
    if (stream) {
      stopCamera();
      await startCamera(nextDeviceId);
    }
  }, [devices, activeDeviceId, stream, startCamera, stopCamera]);

  // Capture photo
  const capturePhoto = useCallback(async (quality = 0.9) => {
    if (!stream || !videoRef.current || !canvasRef.current) {
      throw new Error('Camera not ready');
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    
    // Mirror if front camera
    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Reset transformation
    context.setTransform(1, 0, 0, 1, 0, 0);
    
    // Apply flash effect if enabled
    if (flashOn) {
      context.fillStyle = 'white';
      context.globalAlpha = 0.3;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const imageData = canvas.toDataURL('image/jpeg', quality);
    
    return {
      data: imageData,
      width: canvas.width,
      height: canvas.height,
      facingMode,
      timestamp: Date.now()
    };
  }, [stream, facingMode, flashOn]);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (!stream || !flashAvailable) return;
    
    const track = stream.getVideoTracks()[0];
    
    try {
      await track.applyConstraints({
        advanced: [{ torch: !flashOn }]
      });
      setFlashOn(!flashOn);
    } catch (err) {
      setError(err.message);
    }
  }, [stream, flashAvailable, flashOn]);

  // Set zoom
  const setCameraZoom = useCallback(async (value) => {
    if (!stream || !zoomAvailable) return;
    
    const track = stream.getVideoTracks()[0];
    const clampedZoom = Math.max(1, Math.min(value, track.getCapabilities?.().zoom?.max || 3));
    
    try {
      await track.applyConstraints({
        advanced: [{ zoom: clampedZoom }]
      });
      setZoom(clampedZoom);
    } catch (err) {
      setError(err.message);
    }
  }, [stream, zoomAvailable]);

  // Get video element ref
  const getVideoRef = useCallback(() => videoRef, []);

  // Get canvas element ref
  const getCanvasRef = useCallback(() => canvasRef, []);

  // Check if camera is active
  const isActive = useCallback(() => {
    return stream !== null && stream.active;
  }, [stream]);

  // Get current track
  const getTrack = useCallback(() => {
    return stream?.getVideoTracks()[0] || null;
  }, [stream]);

  // Get track capabilities
  const getCapabilities = useCallback(() => {
    const track = getTrack();
    return track?.getCapabilities?.() || {};
  }, [getTrack]);

  // Get track settings
  const getSettings = useCallback(() => {
    const track = getTrack();
    return track?.getSettings?.() || {};
  }, [getTrack]);

  return {
    // State
    stream,
    devices,
    activeDeviceId,
    error,
    loading,
    permission,
    supported,
    flashAvailable,
    flashOn,
    zoomAvailable,
    zoom,
    videoRef: videoRef.current,
    canvasRef: canvasRef.current,

    // Actions
    requestPermission,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    toggleFlash,
    setCameraZoom,
    getCameras,

    // Getters
    isActive,
    getTrack,
    getCapabilities,
    getSettings,
    getVideoRef,
    getCanvasRef,

    // Utilities
    clearError: useCallback(() => setError(null), [])
  };
};
