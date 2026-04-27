import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ArrowRightOnRectangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Logout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Perform logout logic after a brief delay for the animation
        const timer = setTimeout(() => {
            logout();
            // We don't navigate immediately so the user can see the "Session Ended" state
        }, 2000);

        return () => clearTimeout(timer);
    }, [logout]);

    return (
        <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[30px] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-purple-500/20 relative"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-white rounded-[30px] blur-xl opacity-20"
                    ></motion.div>
                    <ArrowRightOnRectangleIcon className="w-12 h-12 text-white relative z-10" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-black text-white tracking-tight uppercase"
                >
                    Securing Your Session
                </motion.h1>
                
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500 mt-3 font-medium"
                >
                    Ending your SAKHI encrypted connection...
                </motion.p>

                <div className="mt-12 space-y-4">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-left"
                    >
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">Evidence Saved</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Cloud encryption verified</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-left"
                    >
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <ShieldCheckIcon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">SAKHI Protected</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Stay safe until we meet again</p>
                        </div>
                    </motion.div>
                </div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    onClick={() => navigate('/login')}
                    className="mt-12 w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-xl"
                >
                    Return to Login
                </motion.button>
            </div>
        </div>
    );
};

export default Logout;
