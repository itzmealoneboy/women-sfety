import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import Button from '../../../components/common/Button';
import { CameraIcon } from '@heroicons/react/24/outline';

const GenderDetection = ({ onVerified }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [gender, setGender] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    loadModels();
    return () => stopCamera();
  }, []);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.ageGenderNet.loadFromUri('/models');
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
    videoRef.current.srcObject = stream;
    streamRef.current = stream;
    setCameraActive(true);
    detectGender();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  const detectGender = async () => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !cameraActive) return;
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender();
      if (detections.length > 0) {
        setGender(detections[0].gender);
        setConfidence(detections[0].genderProbability * 100);
        if (detections[0].gender === 'male' && detections[0].genderProbability > 0.8) {
          alert('This app is only for women. Access denied.');
          stopCamera();
        }
      }
    }, 500);
    return () => clearInterval(interval);
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!cameraActive && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Button variant="primary" onClick={startCamera}><CameraIcon className="w-5 h-5 mr-2" /> Start Camera</Button>
          </div>
        )}
        {cameraActive && gender && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
            <div className="flex justify-between"><span>Gender: {gender === 'male' ? '♂️ Male' : '♀️ Female'}</span><span>Confidence: {confidence.toFixed(1)}%</span></div>
          </div>
        )}
      </div>
      {gender === 'female' && confidence > 80 && (
        <Button variant="success" className="w-full" onClick={() => { stopCamera(); onVerified({ gender, confidence }); }}>Gender Verified - Continue</Button>
      )}
    </div>
  );
};

export default GenderDetection;
