import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { LANGUAGES } from '../../config/constant';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import {
    EnvelopeIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    FingerPrintIcon,
    CameraIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Login = () => {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'fingerprint', 'face'
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Camera/Fingerprint states
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        if (loginMethod === 'email') {
            if (!email || !password) {
                toast.error('Please enter email and password');
                return;
            }
        }

        setLoading(true);
        try {
            let result;
            if (loginMethod === 'email') {
                result = await login(email, password);
            } else if (loginMethod === 'fingerprint') {
                // Simulate fingerprint match
                const mockFingerprint = 'fp_match_' + Math.random().toString(36).substr(2, 9);
                result = await login(null, null, { fingerprint: mockFingerprint });
            } else if (loginMethod === 'face') {
                // Capture face frame
                const faceData = captureFace();
                result = await login(null, null, { faceImage: faceData });
            }

            if (result.success) {
                toast.success('Login successful!');
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
            if (stream) stopCamera();
        }
    };

    // Helper functions for Biometrics
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            toast.error('Camera access denied');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureFace = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg');
        }
        return null;
    };

    const switchMethod = (method) => {
        setLoginMethod(method);
        if (method === 'face') {
            startCamera();
        } else {
            stopCamera();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 rounded-3xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-purple-500/20"
                        >
                            <ShieldCheckIcon className="w-12 h-12 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">SAKHI</h1>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-1">Women Safety & Sakhi Portal</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {loginMethod === 'email' ? (
                            <motion.form 
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLogin} 
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Gmail Address</label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                                        placeholder="name@gmail.com"
                                        className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                                        <Link to="/forgot-password" size="sm" className="text-xs text-purple-400 hover:text-purple-300 font-bold">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 text-white focus:bg-white/10 rounded-2xl"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-2xl font-bold shadow-xl border-none"
                                    loading={loading}
                                >
                                    Login to Portal
                                </Button>
                            </motion.form>
                        ) : loginMethod === 'fingerprint' ? (
                            <motion.div
                                key="fingerprint"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center space-y-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => switchMethod('email')} className="text-gray-400 hover:text-white transition-colors">
                                        <ArrowLeftIcon className="w-5 h-5" />
                                    </button>
                                    <h3 className="text-white font-bold">Fingerprint Login</h3>
                                </div>
                                <motion.div 
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogin}
                                    className="w-40 h-52 mx-auto border-4 border-purple-500/30 bg-purple-500/5 rounded-[40px] flex items-center justify-center cursor-pointer hover:bg-purple-500/10 transition-all"
                                >
                                    <FingerPrintIcon className={`w-20 h-20 text-purple-500 ${loading ? 'animate-pulse' : ''}`} />
                                </motion.div>
                                <p className="text-gray-400 text-xs">Tap to scan and verify identity</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="face"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center space-y-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => switchMethod('email')} className="text-gray-400 hover:text-white transition-colors">
                                        <ArrowLeftIcon className="w-5 h-5" />
                                    </button>
                                    <h3 className="text-white font-bold">Face Verification</h3>
                                </div>
                                <div className="relative w-full aspect-video bg-black/40 rounded-3xl overflow-hidden border border-white/10">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 border-2 border-green-500/30 m-8 rounded-full pointer-events-none"></div>
                                </div>
                                <Button 
                                    onClick={handleLogin} 
                                    loading={loading}
                                    className="w-full bg-blue-600 rounded-2xl py-4 font-bold"
                                >
                                    Verify Face Identity
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Alternative Methods Divider */}
                    <div className="my-8 flex items-center justify-center space-x-4">
                        <div className="h-px flex-1 bg-white/10"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Biometric Options</span>
                        <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    {/* Method Switchers */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => switchMethod('fingerprint')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${loginMethod === 'fingerprint' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                        >
                            <FingerPrintIcon className="w-6 h-6 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Fingerprint</span>
                        </button>
                        <button
                            onClick={() => switchMethod('face')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${loginMethod === 'face' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                        >
                            <CameraIcon className="w-6 h-6 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Face Scan</span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <p className="text-center mt-8 text-sm text-gray-400 font-medium">
                        New to SAKHI?{' '}
                        <Link to="/register" className="text-purple-400 font-black hover:text-purple-300 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
