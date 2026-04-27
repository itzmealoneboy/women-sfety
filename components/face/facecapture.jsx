import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import Button from '../common/Button';
import Card from '../common/Card';
import { CameraIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const FaceCapture = ({ onCapture, onComplete, maxAngles = 3 }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [currentAngle, setCurrentAngle] = useState('front');
  const [capturedAngles, setCapturedAngles] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [quality, setQuality] = useState(0);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const angles = [
    { name: 'front', instruction: 'Look straight at the camera', emoji: '👤' },
    { name: 'left', instruction: 'Turn your face slightly LEFT', emoji: '👈' },
    { name: 'right', instruction: 'Turn your face slightly RIGHT', emoji: '👉' }
  ];

  useEffect(() => {
    if (cameraActive) {
      startFaceDetection();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const startFaceDetection = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !cameraActive) {
        clearInterval(interval);
        return;
      }

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptors();

      if (detections.length > 0) {
        setFaceDetected(true);
        
        // Check image quality
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        
        const qualityScore = assessImageQuality(canvas);
        setQuality(qualityScore);
      } else {
        setFaceDetected(false);
        setQuality(0);
      }

      // Draw face detection box
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (detections.length > 0) {
          const box = detections[0].detection.box;
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 3;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        }
      }
    }, 100);
  };

  const assessImageQuality = (canvas) => {
    // Simplified quality assessment
    // In production, check brightness, contrast, sharpness
    return 85; // Mock quality score
  };

  const captureCurrentAngle = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Get face descriptor
    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
      alert('No face detected. Please look at the camera.');
      return;
    }

    const newCapture = {
      angle: currentAngle,
      image: imageData,
      descriptor: Array.from(detection.descriptor),
      timestamp: Date.now()
    };

    const newAngles = [...capturedAngles, newCapture];
    setCapturedAngles(newAngles);

    if (onCapture) {
      onCapture(newCapture);
    }

    // Move to next angle
    if (currentAngle === 'front') {
      setCurrentAngle('left');
    } else if (currentAngle === 'left') {
      setCurrentAngle('right');
    } else if (currentAngle === 'right') {
      stopCamera();
      if (onComplete) {
        onComplete(newAngles);
      }
    }
  };

  const resetCapture = () => {
    setCapturedAngles([]);
    setCurrentAngle('front');
    startCamera();
  };

  const currentAngleData = angles.find(a => a.name === currentAngle);

  return (
    <Card>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Face Capture</h3>
        <p className="text-sm text-gray-600">
          {capturedAngles.length} of {maxAngles} angles captured
        </p>
      </div>

      {!cameraActive && capturedAngles.length < maxAngles && (
        <div className="text-center py-8">
          <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Button variant="primary" onClick={startCamera}>
            Start Camera
          </Button>
        </div>
      )}

      {cameraActive && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />

            {faceDetected && (
              <div className="absolute top-2 right-2 bg-success/90 text-white px-2 py-1 rounded-full text-xs">
                ✓ Face Detected
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {currentAngleData?.emoji} {currentAngleData?.instruction}
                </span>
                {quality > 0 && (
                  <span className={`text-xs ${
                    quality > 80 ? 'text-success' : 'text-warning'
                  }`}>
                    Quality: {quality}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {angles.map((angle, index) => (
              <div
                key={angle.name}
                className={`p-2 rounded-lg text-center ${
                  capturedAngles.find(a => a.angle === angle.name)
                    ? 'bg-success/10 text-success'
                    : currentAngle === angle.name
                    ? 'bg-primary-500/10 text-primary-600 border-2 border-primary-500'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span className="block text-xs font-medium">
                  {index + 1}. {angle.name}
                </span>
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={captureCurrentAngle}
            disabled={!faceDetected || quality < 70}
          >
            Capture {currentAngle} face
          </Button>
        </div>
      )}

      {capturedAngles.length === maxAngles && (
        <div className="text-center py-4">
          <CheckCircleIcon className="w-16 h-16 text-success mx-auto mb-3" />
          <p className="text-success font-medium mb-4">
            All {maxAngles} angles captured successfully!
          </p>
          <Button variant="success" onClick={() => onComplete(capturedAngles)}>
            Continue
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-danger/10 text-danger rounded-lg text-sm">
          {error}
        </div>
      )}
    </Card>
  );
};

export default FaceCapture;
