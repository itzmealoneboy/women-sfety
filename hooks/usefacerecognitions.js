import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for face recognition functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Face recognition state and methods
 */
const useFaceRecognition = (options = {}) => {
  const {
    onDetect,
    onError,
    autoStart = false,
    detectionInterval = 100,
    modelPath = '/models',
    minConfidence = 0.6,
    maxDetections = 5
  } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faces, setFaces] = useState([]);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [models, setModels] = useState({});
  const [detectionStats, setDetectionStats] = useState({
    fps: 0,
    detections: 0,
    processingTime: 0
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastDetectionTimeRef = useRef(0);
  const detectionCountRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  // Check browser support
  useEffect(() => {
    const checkSupport = async () => {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasFaceApi = !!(window.faceapi || window.FaceAPI);
      
      setIsSupported(hasMediaDevices && hasFaceApi);
      
      if (!hasMediaDevices) {
        setError('Camera access is not supported in this browser');
      }
      if (!hasFaceApi) {
        setError('Face recognition library not loaded');
      }
    };
    
    checkSupport();
  }, []);

  // Load face recognition models
  const loadModels = useCallback(async () => {
    if (!window.faceapi && !window.FaceAPI) {
      setError('Face recognition library not available');
      return false;
    }

    try {
      const faceapi = window.faceapi || window.FaceAPI;
      
      // Load required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(`${modelPath}/tiny_face_detector`),
        faceapi.nets.faceLandmark68Net.loadFromUri(`${modelPath}/face_landmark_68`),
        faceapi.nets.faceRecognitionNet.loadFromUri(`${modelPath}/face_recognition`),
        faceapi.nets.faceExpressionNet.loadFromUri(`${modelPath}/face_expression`)
      ]);
      
      setModels(faceapi);
      setIsInitialized(true);
      return true;
    } catch (err) {
      console.error('Error loading face recognition models:', err);
      setError('Failed to load face recognition models');
      if (onError) onError(err);
      return false;
    }
  }, [modelPath, onError]);

  // Start camera stream
  const startCamera = useCallback(async (constraints = {}) => {
    if (!isSupported) {
      setError('Face recognition not supported');
      return false;
    }

    try {
      const defaultConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        Object.assign({}, defaultConstraints, constraints)
      );
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
        };
      }
      
      setStream(mediaStream);
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera');
      if (onError) onError(err);
      return false;
    }
  }, [isSupported, onError]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Detect faces in video frame
  const detectFaces = useCallback(async () => {
    if (!isInitialized || !cameraActive || !videoRef.current || !videoRef.current.videoWidth) {
      return;
    }

    const startTime = performance.now();
    
    try {
      const faceapi = models;
      const video = videoRef.current;
      
      // Detect faces with landmarks and expressions
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();
      
      // Filter by confidence
      const validDetections = detections.filter(d => d.detection.score >= minConfidence);
      const limitedDetections = validDetections.slice(0, maxDetections);
      
      // Draw detections if canvas is available
      if (canvasRef.current && validDetections.length > 0) {
        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(limitedDetections, displaySize);
        
        // Clear canvas and draw detections
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
      
      // Update faces state with additional data
      const faceData = limitedDetections.map(detection => ({
        confidence: detection.detection.score,
        boundingBox: detection.detection.box,
        landmarks: detection.landmarks,
        expressions: detection.expressions,
        descriptor: detection.descriptor,
        timestamp: Date.now()
      }));
      
      setFaces(faceData);
      
      // Update stats
      detectionCountRef.current++;
      const processingTime = performance.now() - startTime;
      setDetectionStats(prev => ({
        ...prev,
        detections: detectionCountRef.current,
        processingTime: Math.round(processingTime)
      }));
      
      // Callback with detected faces
      if (onDetect && faceData.length > 0) {
        onDetect(faceData);
      }
      
    } catch (err) {
      console.error('Error during face detection:', err);
      if (onError) onError(err);
    }
  }, [isInitialized, cameraActive, models, minConfidence, maxDetections, onDetect, onError]);

  // Animation loop for continuous detection
  const startDetection = useCallback(() => {
    if (!isInitialized || !cameraActive || isDetecting) return;
    
    setIsDetecting(true);
    detectionCountRef.current = 0;
    
    const detectLoop = () => {
      if (!isDetecting || !cameraActive) return;
      
      const now = Date.now();
      if (now - lastDetectionTimeRef.current >= detectionInterval) {
        detectFaces();
        lastDetectionTimeRef.current = now;
        
        // Update FPS
        frameCountRef.current++;
        if (now - lastFpsUpdateRef.current >= 1000) {
          setDetectionStats(prev => ({
            ...prev,
            fps: frameCountRef.current
          }));
          frameCountRef.current = 0;
          lastFpsUpdateRef.current = now;
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(detectLoop);
  }, [isInitialized, cameraActive, isDetecting, detectionInterval, detectFaces]);
  
  // Stop detection loop
  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsDetecting(false);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);
  
  // Initialize and optionally auto-start
  useEffect(() => {
    if (autoStart && isSupported && !isInitialized) {
      loadModels().then(success => {
        if (success) {
          startCamera().then(() => {
            startDetection();
          });
        }
      });
    }
    
    return () => {
      stopDetection();
      stopCamera();
    };
  }, [autoStart, isSupported, isInitialized, loadModels, startCamera, startDetection, stopDetection, stopCamera]);
  
  // Take photo/snapshot
  const takeSnapshot = useCallback(() => {
    if (!videoRef.current || !cameraActive) return null;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg');
  }, [cameraActive]);
  
  // Compare faces (for authentication)
  const compareFaces = useCallback(async (faceDescriptor1, faceDescriptor2) => {
    if (!models || !faceDescriptor1 || !faceDescriptor2) return 0;
    
    const faceapi = models;
    const distance = faceapi.euclideanDistance(faceDescriptor1, faceDescriptor2);
    const threshold = 0.6; // Lower distance = more similar
    
    return {
      distance,
      match: distance < threshold,
      confidence: Math.max(0, 1 - distance / threshold)
    };
  }, [models]);
  
  // Register face for authentication
  const registerFace = useCallback(async (userId, faceData) => {
    if (!faceData || faceData.length === 0) {
      throw new Error('No face detected');
    }
    
    // Get the best face (highest confidence)
    const bestFace = faceData.reduce((best, current) => 
      current.confidence > best.confidence ? current : best, faceData[0]
    );
    
    const registrationData = {
      userId,
      descriptor: Array.from(bestFace.descriptor),
      expressions: bestFace.expressions,
      timestamp: Date.now()
    };
    
    // Store in localStorage for demo (use backend in production)
    const registrations = JSON.parse(localStorage.getItem('face_registrations') || '{}');
    registrations[userId] = registrationData;
    localStorage.setItem('face_registrations', JSON.stringify(registrations));
    
    return registrationData;
  }, []);
  
  // Authenticate with face
  const authenticateFace = useCallback(async (userId, faceData) => {
    if (!faceData || faceData.length === 0) {
      return { success: false, message: 'No face detected' };
    }
    
    const registrations = JSON.parse(localStorage.getItem('face_registrations') || '{}');
    const registeredFace = registrations[userId];
    
    if (!registeredFace) {
      return { success: false, message: 'User not registered for face authentication' };
    }
    
    // Compare detected face with registered face
    const bestFace = faceData.reduce((best, current) => 
      current.confidence > best.confidence ? current : best, faceData[0]
    );
    
    const comparison = await compareFaces(
      new Float32Array(registeredFace.descriptor),
      bestFace.descriptor
    );
    
    return {
      success: comparison.match,
      confidence: comparison.confidence,
      distance: comparison.distance,
      message: comparison.match ? 'Authentication successful' : 'Face does not match'
    };
  }, [compareFaces]);
  
  // Get expression analysis
  const analyzeExpressions = useCallback((faceData) => {
    if (!faceData || faceData.length === 0) return null;
    
    const expressions = faceData.map(face => ({
      ...face.expressions,
      dominant: Object.entries(face.expressions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    }));
    
    return expressions;
  }, []);
  
  return {
    // Refs for video and canvas elements
    videoRef,
    canvasRef,
    
    // State
    isSupported,
    isInitialized,
    isDetecting,
    cameraActive,
    faces,
    error,
    detectionStats,
    
    // Methods
    loadModels,
    startCamera,
    stopCamera,
    startDetection,
    stopDetection,
    takeSnapshot,
    detectFaces,
    compareFaces,
    registerFace,
    authenticateFace,
    analyzeExpressions
  };
};

export default useFaceRecognition;
