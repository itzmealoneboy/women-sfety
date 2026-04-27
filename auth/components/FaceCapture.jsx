import { useState, useRef } from 'react';
import Button from '../../../components/common/Button';
import { CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FaceCapture = ({ onComplete }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [captured, setCaptured] = useState({ front: false, left: false, right: false });
  const [currentAngle, setCurrentAngle] = useState('front');
  const [faceData, setFaceData] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const angles = ['front', 'left', 'right'];
  const instructions = { front: 'Look straight at camera', left: 'Turn face slightly LEFT', right: 'Turn face slightly RIGHT' };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    videoRef.current.srcObject = stream;
    streamRef.current = stream;
    setCameraActive(true);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    setFaceData({ ...faceData, [currentAngle]: imageData });
    setCaptured({ ...captured, [currentAngle]: true });
    const nextIndex = angles.indexOf(currentAngle) + 1;
    if (nextIndex < angles.length) setCurrentAngle(angles[nextIndex]);
    else { stopCamera(); onComplete(faceData); }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        {!cameraActive && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Button variant="primary" onClick={startCamera}><CameraIcon className="w-5 h-5 mr-2" /> Start Camera</Button>
          </div>
        )}
        {cameraActive && <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">Capture {currentAngle} face</div>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {angles.map(a => <div key={a} className={`p-2 rounded-lg text-center ${captured[a] ? 'bg-success/10 text-success' : currentAngle === a ? 'bg-primary-100 text-primary-600' : 'bg-gray-100'}`}>{a}</div>)}
      </div>
      {cameraActive && <Button variant="primary" className="w-full" onClick={capture}>Capture {currentAngle} face</Button>}
    </div>
  );
};

export default FaceCapture;
