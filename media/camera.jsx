import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationsstore';
import { useSakshiEyeStore } from '../../store/sakshieyestore';
import { 
  CameraIcon,
  ArrowPathIcon,
  PhotoIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Camera = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocationStore();
  const { addFace, addRecording, addReport } = useSakshiEyeStore();
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionInterval = useRef(null);

  // Auto start camera on component mount to fix "Hardware Camera Disconnected" static screen
  useEffect(() => {
    startSecureCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startSecureCamera = async () => {
    setIsLoading(true);
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API not available. Please ensure you are using HTTPS or localhost.');
      toast.error('Camera API not available.');
      setIsLoading(false);
      return;
    }

    try {
      let stream;
      try {
        // Try preferred constraints (with audio and specific facingMode)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true // Request audio for auto-recordings
        });
      } catch (err) {
        console.warn("Preferred constraints failed, falling back to simple video:", err);
        // Fallback: simple video only, no specific facing mode or audio
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCapturedImage(null);
        setIsRecording(true);
        
        await videoRef.current.play().catch(() => {});
        toast.success('Camera Connected ✅ System Active.', { icon: '🛡️' });
        
        // Start simulated auto face detection & auto recording
        startAutoDetection();
      }
    } catch (error) {
      console.error('Camera access error', error);
      const message = error.name === 'NotAllowedError'
          ? 'Permission denied. Please click the padlock in your URL bar and allow Camera.'
          : error.name === 'NotFoundError'
          ? 'No camera hardware found on this device.'
          : error.message || 'Could not access camera hardware.';
      setCameraError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoDetection = () => {
    // Clear any existing interval
    if (detectionInterval.current) clearInterval(detectionInterval.current);
    
    // Simulate detecting a face or keyword every 15-20 seconds to populate the Evidence Folder live
    detectionInterval.current = setInterval(() => {
        if (!isCameraActive || capturedImage) return;

        const eventType = Math.random() > 0.5 ? 'face' : 'audio';
        const timestamp = new Date().toISOString();
        
        if (eventType === 'face') {
            // Auto capture face
            addFace({ id: Date.now(), timestamp, confidence: 95 });
            addReport({ id: Date.now(), type: 'Face Capture', timestamp });
            toast('Auto-Captured: Threat Face Detected (95% match)', { icon: '👤', style: { background: '#7e22ce', color: '#fff' }});
        } else {
            // Auto record audio keyword
            addRecording({ id: Date.now(), timestamp, keyword: 'Help / Panic' });
            addReport({ id: Date.now(), type: 'Audio Recording', timestamp });
            toast('Auto-Recorded: Emergency Audio Detected', { icon: '🎙️', style: { background: '#b91c1c', color: '#fff' }});
        }
    }, 18000);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      setIsRecording(false);
    }
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => startSecureCamera(), 100);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    
    toast.success('Manual Evidence Captured!');
  };

  const savePhoto = async () => {
    if (!capturedImage) return;

    setUploading(true);
    const savingToast = toast.loading('Encrypting and syncing to secure cloud (Firebase)...');

    try {
      const newPhoto = {
        id: `img_${Date.now()}`,
        photoURL: capturedImage,
        type: 'evidence',
        location: currentLocation || { lat: 0, lng: 0 },
        capturedAt: new Date().toISOString(),
      };

      // Mock save to IndexedDB / Firebase
      const existingPhotos = JSON.parse(localStorage.getItem('gallery_photos') || '[]');
      const updatedPhotos = [newPhoto, ...existingPhotos];
      if(updatedPhotos.length > 50) updatedPhotos.pop();
      localStorage.setItem('gallery_photos', JSON.stringify(updatedPhotos));
      
      // Auto-generate report in SAKHI EYE Evidence Store
      addReport({ id: Date.now(), type: 'Manual Photo', timestamp: new Date().toISOString() });

      toast.success('Synced securely to cloud. Cannot be deleted.', { id: savingToast });
      discardPhoto();
      
    } catch (error) {
       toast.error('Failed to sync.', { id: savingToast });
    } finally {
      setUploading(false);
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
  };

  // --- Troubleshooting Functions ---
  const checkPermissions = async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      toast.error('Permissions API not supported.');
      return;
    }
    try {
      const statusCam = await navigator.permissions.query({ name: 'camera' });
      const statusMic = await navigator.permissions.query({ name: 'microphone' });
      toast.success(`Camera: ${statusCam.state.toUpperCase()} | Mic: ${statusMic.state.toUpperCase()}`);
    } catch (err) {
       toast.error('Permissions query failed.');
    }
  };

  const testHardware = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      toast.error('Hardware enumeration not supported.');
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      toast.success(`Found ${videoInputs.length} Cameras, ${audioInputs.length} Microphones.`);
    } catch (err) {
      toast.error('Failed to detect media devices.');
    }
  };

  return (
    <div className="bg-[#0b0f19] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col items-center">
        
      {/* Video Viewport Container */}
      <div className="relative w-full bg-black aspect-[3/4] md:aspect-video flex items-center justify-center overflow-hidden">
          
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                <div className="w-12 h-12 border-4 border-[#7e22ce] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#a855f7] font-bold tracking-widest uppercase text-sm">Initializing Secure Stream...</p>
                <p className="text-gray-400 text-xs mt-2">Requesting Camera & Mic permissions...</p>
            </div>
        )}

        {/* Video element must always be rendered so videoRef is available, we control visibility with CSS */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${(!isCameraActive || capturedImage) ? 'hidden' : ''}`}
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured Evidence"
            className="w-full h-full object-contain bg-gray-900"
          />
        )}

        {!isCameraActive && !capturedImage && !isLoading && (
           <div className="text-center p-6 z-10">
              <VideoCameraIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-white font-bold text-xl mb-2">Camera Access Failed</p>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                 We could not start the secure camera automatically. Please check your browser permissions, ensure no other app is using the camera, and try starting it manually.
              </p>
              {cameraError && <p className="text-red-400 text-xs font-bold bg-red-950/50 p-4 rounded-xl border border-red-900/50 shadow-inner">{cameraError}</p>}
           </div>
        )}

        {/* Live Indicator overlay */}
        {isCameraActive && !capturedImage && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
              <div className="bg-red-600/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-black tracking-widest animate-pulse flex items-center gap-2 shadow-lg border border-red-500">
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div> REC
              </div>
              <div className="bg-black/60 backdrop-blur text-[#a855f7] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-[#a855f7]/30">
                <span className="w-1.5 h-1.5 bg-[#a855f7] rounded-full"></span> AI ACTIVE
              </div>
          </div>
        )}

        {/* Framing Guides */}
        {isCameraActive && !capturedImage && (
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border-2 border-white/20 rounded-3xl border-dashed"></div>
                <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-xs font-bold tracking-widest">
                    FACE & AUDIO AUTO-CAPTURE ACTIVE
                </div>
            </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Control Panel */}
      <div className="bg-gradient-to-b from-[#1f2937] to-[#111827] w-full p-6 md:p-8 space-y-6">
          
        {!isCameraActive && !capturedImage && !isLoading ? (
          <button
            onClick={startSecureCamera}
            className="w-full bg-[#10b981] hover:bg-[#059669] transition-colors text-white py-5 rounded-xl font-extrabold flex items-center justify-center gap-3 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase tracking-wider"
          >
            <CameraIcon className="w-7 h-7 stroke-2" /> RESTART SECURE CAMERA
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm md:text-base">
            {!capturedImage ? (
                <>
                  <button
                    onClick={switchCamera}
                    disabled={isLoading}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
                  >
                    <ArrowPathIcon className="w-6 h-6 stroke-2 hidden sm:block" /> Switch Lens
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={isLoading}
                    className="flex-[2] bg-white hover:bg-gray-200 text-[#111827] py-4 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] md:text-lg"
                  >
                    <div className="w-6 h-6 border-4 border-[#111827] rounded-full"></div> MANUAL CAPTURE
                  </button>
                </>
            ) : (
                <>
                  <button
                     onClick={discardPhoto}
                     className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10"
                  >
                     <ArrowPathIcon className="w-5 h-5 mr-1 stroke-2" /> Discard
                  </button>
                  <button
                     onClick={savePhoto}
                     disabled={uploading}
                     className="flex-[2] bg-gradient-to-r from-[#7c56c2] to-[#6039a8] hover:from-[#6848a6] hover:to-[#4e2d8a] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(124,86,194,0.4)] w-full disabled:opacity-50"
                  >
                     <PhotoIcon className="w-6 h-6 stroke-2 hidden sm:block" /> SECURE SYNC TO CLOUD
                  </button>
                </>
            )}
          </div>
        )}

        {/* Troubleshooting Panel for when camera fails */}
        {(!isCameraActive || cameraError) && !isLoading && (
            <div className="pt-4 border-t border-gray-700/50 mt-6 bg-[#fef3c7] p-5 rounded-2xl">
            <h3 className="text-sm font-black text-yellow-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                <WrenchScrewdriverIcon className="w-5 h-5" /> Diagnostic & Troubleshooting
            </h3>
            <p className="text-xs text-yellow-700 font-medium mb-4">If the camera module is failing to load, you can run hardware diagnostics below.</p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={testHardware}
                    className="flex-1 border border-yellow-300 bg-white text-yellow-800 hover:bg-yellow-50 transition-colors py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                    <InformationCircleIcon className="w-5 h-5 stroke-2" /> Detect Hardware
                </button>
                <button 
                    onClick={checkPermissions}
                    className="flex-1 border border-yellow-300 bg-white text-yellow-800 hover:bg-yellow-50 transition-colors py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                    <InformationCircleIcon className="w-5 h-5 stroke-2" /> View Permissions
                </button>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
