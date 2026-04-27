import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import Card from '../common/Card';

const FaceApiLoader = ({ children, onLoaded }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      
      setProgress(10);
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setProgress(30);
      
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setProgress(50);
      
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setProgress(70);
      
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setProgress(85);
      
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
      setProgress(100);

      setLoaded(true);
      if (onLoaded) onLoaded();
    } catch (err) {
      console.error('Failed to load face-api models:', err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <Card className="text-center p-8">
        <div className="w-16 h-16 bg-danger/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">❌</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Face Detection</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadModels}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
        >
          Retry
        </button>
      </Card>
    );
  }

  if (!loaded) {
    return (
      <Card className="text-center p-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Face Detection</h3>
        <p className="text-gray-600 mb-4">Please wait while we load the face recognition models...</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
      </Card>
    );
  }

  return children;
};

export default FaceApiLoader;
