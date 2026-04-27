import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { LANGUAGES } from '../../config/constant';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ShieldCheckIcon,
  PhoneIcon,
  CameraIcon,
  FingerPrintIcon,
  DocumentArrowUpIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    aadhaar: null,
    pan: null,
    fingerprint: '',
    faceImages: {
      front: null,
      left: null,
      right: null
    }
  });

  const { register } = useAuthStore();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.password || !formData.gender) {
        toast.error('Please fill all mandatory fields');
        return;
      }
      if (formData.phone.length !== 10) {
        toast.error('Mobile number must be 10 digits');
        return;
      }
      if (formData.gender.toLowerCase() !== 'female') {
        toast.error('Only women are allowed to register');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    if (step === 2) {
      if (!formData.faceImages.front || !formData.faceImages.left || !formData.faceImages.right) {
        toast.error('Please capture all 3 sides of your face');
        return;
      }
      stopCamera();
    }
    if (step === 3) {
      if (!formData.aadhaar) {
        toast.error('Aadhaar card upload is required');
        return;
      }
    }
    if (step === 4) {
      if (!formData.fingerprint) {
        toast.error('Fingerprint simulation required');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step === 2) stopCamera();
    setStep(prev => prev - 1);
  };

  // Camera Logic
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCapturing(true);
    } catch (err) {
      toast.error('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCapturing(false);
    }
  };

  const captureFace = (side) => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL('image/jpeg');
      setFormData(prev => ({
        ...prev,
        faceImages: { ...prev.faceImages, [side]: imgData }
      }));
      toast.success(`${side.charAt(0).toUpperCase() + side.slice(1)} face captured`);
    }
  };

  // Fingerprint Logic
  const simulateFingerprint = () => {
    setLoading(true);
    setTimeout(() => {
      const hash = 'fp_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      setFormData(prev => ({ ...prev, fingerprint: hash }));
      setLoading(false);
      toast.success('Fingerprint captured successfully');
    }, 1500);
  };

  // Final Registration
  const handleFinalRegister = async () => {
    setLoading(true);
    try {
      const result = await register({
        ...formData,
        faceImages: [formData.faceImages.front, formData.faceImages.left, formData.faceImages.right]
      });

      if (result.success) {
        toast.success('Registration successful! Welcome to SAKHI.');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <canvas ref={canvasRef} className="hidden"></canvas>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-purple-500/20"
            >
              <ShieldCheckIcon className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter">SAKHI</h1>
            <p className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest">Women Safety & Sakhi Portal</p>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-purple-500' : 'w-4 bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-purple-400" /> Personal Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                      placeholder="Enter full name"
                      className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mobile Number</label>
                    <Input
                      name="phone"
                      type="number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      icon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
                      placeholder="10-digit number"
                      className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address (Optional)</label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                      placeholder="name@gmail.com"
                      className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    >
                      <option value="" className="bg-slate-900">Select Gender</option>
                      <option value="female" className="bg-slate-900">Female</option>
                      <option value="male" className="bg-slate-900">Male (Restricted)</option>
                      <option value="other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm Password</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl py-4"
                    />
                  </div>
                </div>
                <Button 
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-2xl font-bold text-lg shadow-xl"
                >
                  Continue to Biometrics <ArrowRightIcon className="w-5 h-5 inline ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Face Capture */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CameraIcon className="w-6 h-6 text-purple-400" /> 3-Sided Face Capture
                </h3>
                
                <div className="relative bg-black/40 rounded-3xl overflow-hidden aspect-video border border-white/10 flex items-center justify-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover ${stream ? 'block' : 'hidden'}`} 
                  />
                  {!stream && (
                    <div className="text-center p-8">
                      <CameraIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <Button onClick={startCamera} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white">
                        Enable Camera
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {['left', 'front', 'right'].map(side => (
                    <div key={side} className="text-center space-y-2">
                      <div className="relative aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden group">
                        {formData.faceImages[side] ? (
                          <img src={formData.faceImages[side]} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-30">
                            <UserIcon className="w-10 h-10" />
                          </div>
                        )}
                        <button 
                          disabled={!stream}
                          onClick={() => captureFace(side)}
                          className="absolute inset-0 bg-purple-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all disabled:hidden"
                        >
                          <CameraIcon className="w-8 h-8 text-white" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase">{side}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={prevStep} className="flex-1 bg-white/5 border border-white/10">Back</Button>
                  <Button onClick={nextStep} className="flex-1 bg-purple-600">Next Step</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Aadhaar & Documents */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DocumentArrowUpIcon className="w-6 h-6 text-purple-400" /> Document Verification
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 border border-dashed border-white/20 rounded-3xl text-center space-y-4">
                    <DocumentArrowUpIcon className="w-12 h-12 text-gray-500 mx-auto" />
                    <div>
                      <p className="text-white font-bold">Upload Aadhaar Card</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input 
                      type="file" 
                      id="aadhaar-upload" 
                      className="hidden" 
                      onChange={(e) => setFormData(prev => ({ ...prev, aadhaar: e.target.files[0] }))}
                    />
                    <label 
                      htmlFor="aadhaar-upload" 
                      className={`inline-block px-6 py-2 rounded-xl cursor-pointer transition-all ${formData.aadhaar ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-purple-600 text-white'}`}
                    >
                      {formData.aadhaar ? 'Aadhaar Uploaded ✓' : 'Select File'}
                    </label>
                  </div>

                  <div className="p-6 bg-white/5 border border-dashed border-white/20 rounded-3xl text-center space-y-4">
                    <DocumentArrowUpIcon className="w-12 h-12 text-gray-500 mx-auto" />
                    <div>
                      <p className="text-white font-bold">Upload PAN Card (Optional)</p>
                      <p className="text-xs text-gray-400 mt-1">Required for advanced features</p>
                    </div>
                    <input 
                      type="file" 
                      id="pan-upload" 
                      className="hidden" 
                      onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.files[0] }))}
                    />
                    <label 
                      htmlFor="pan-upload" 
                      className={`inline-block px-6 py-2 rounded-xl cursor-pointer transition-all ${formData.pan ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/10 text-white border border-white/20'}`}
                    >
                      {formData.pan ? 'PAN Uploaded ✓' : 'Select File'}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={prevStep} className="flex-1 bg-white/5 border border-white/10">Back</Button>
                  <Button onClick={nextStep} className="flex-1 bg-purple-600">Next Step</Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Fingerprint Simulation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8 text-center"
              >
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <FingerPrintIcon className="w-6 h-6 text-purple-400" /> Biometric Fingerprint
                </h3>
                <p className="text-gray-400 text-sm">Please tap the pad below to simulate fingerprint capture.</p>
                
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  onClick={simulateFingerprint}
                  className={`w-48 h-64 mx-auto border-4 rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${formData.fingerprint ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-white/5 border-white/20 hover:border-purple-500/50 hover:bg-white/10'}`}
                >
                  <FingerPrintIcon className={`w-24 h-24 ${formData.fingerprint ? 'text-green-500' : 'text-gray-600'} ${loading ? 'animate-pulse' : ''}`} />
                  {formData.fingerprint && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-green-500 font-bold uppercase tracking-tighter">Verified</motion.div>}
                </motion.div>

                <div className="flex gap-4">
                  <Button onClick={prevStep} className="flex-1 bg-white/5 border border-white/10">Back</Button>
                  <Button onClick={nextStep} className="flex-1 bg-purple-600" disabled={!formData.fingerprint}>Continue</Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Final Review */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Verification Complete</h3>
                  <p className="text-gray-400 mt-1">Review your details before finishing.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-gray-400 text-sm">Identity</span>
                    <span className="text-white font-bold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-gray-400 text-sm">Mobile</span>
                    <span className="text-white font-bold">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-gray-400 text-sm">Biometrics</span>
                    <span className="text-green-400 font-bold flex items-center gap-1">Stored <CheckCircleIcon className="w-4 h-4" /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Gender Restriction</span>
                    <span className="text-purple-400 font-bold">Female Only Verified</span>
                  </div>
                </div>

                <Button 
                  onClick={handleFinalRegister}
                  loading={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-2xl font-bold text-lg shadow-2xl"
                >
                  Confirm & Create Account
                </Button>
                
                <Button onClick={prevStep} className="w-full bg-white/5 text-gray-400">Back to Edit</Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Link */}
          <p className="text-center mt-10 text-sm text-gray-500 font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
              Sign in to Portal
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
