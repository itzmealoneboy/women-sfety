import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Eye, Bell, MessageSquare, User, AlertCircle, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SakhiEye = () => {
  const [socket, setSocket] = useState(null);
  const [facesCaptured, setFacesCaptured] = useState(0);
  const [todayDetections, setTodayDetections] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to backend socket
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Sakhi Eye Server');
    });

    newSocket.on('detectionUpdate', (data) => {
      setFacesCaptured(data.facesCaptured);
      setTodayDetections(data.todayDetections);
    });

    return () => newSocket.close();
  }, []);

  const handleViewDetails = () => {
    navigate('/sakhi-eye-details');
  };

  return (
    <div className="min-h-screen bg-[#8b3dff] text-white p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#8b3dff] p-2 rounded-full">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              SAKHI EYE - ACTIVE
            </h1>
            <p className="text-purple-200 text-sm">AI Safety Witness</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-colors ${
            isEnabled ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-500 hover:bg-gray-400'
          }`}
        >
          <div className={`w-3 h-3 rounded-full bg-white ${isEnabled ? 'animate-pulse' : ''}`}></div>
          {isEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Main Status Card */}
      <div className="bg-[#9b51e0]/50 backdrop-blur-sm border border-purple-400/50 rounded-xl p-6 mb-6">
        <p className="text-purple-100 text-sm mb-1">24/7 AI Monitoring</p>
        <h2 className="text-3xl font-bold tracking-wider">ENABLED</h2>
      </div>

      {/* Camera Feed Simulator & Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Camera Feed */}
        <div className="col-span-1 md:col-span-2 bg-gray-900 rounded-xl overflow-hidden relative min-h-[300px] flex flex-col items-center justify-center border-2 border-[#9b51e0]/30">
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Stream: Active
          </div>
          <Camera className="w-16 h-16 text-gray-700 mb-4" />
          <p className="text-gray-500 font-mono">Camera Feed Active</p>
          <p className="text-gray-600 text-sm mt-2">AI Processing Engine Running</p>
          
          {/* Scanning overlay effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#9b51e0]/10 to-transparent animate-[scan_3s_ease-in-out_infinite]"></div>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#9b51e0]/50 backdrop-blur-sm border border-purple-400/50 rounded-xl p-6 flex-1 flex flex-col justify-center">
            <h3 className="text-purple-100 mb-2 text-lg text-center">Today Detections</h3>
            <p className="text-5xl font-bold text-center text-white">{todayDetections}</p>
          </div>
          <div className="bg-[#9b51e0]/50 backdrop-blur-sm border border-purple-400/50 rounded-xl p-6 flex-1 flex flex-col justify-center">
            <h3 className="text-purple-100 mb-2 text-lg text-center">Faces Captured</h3>
            <p className="text-5xl font-bold text-center text-white">{facesCaptured}</p>
          </div>
        </div>
      </div>

      {/* Top Bar (From screenshot) */}
      <div className="bg-[#2a264a] rounded-t-xl p-4 flex justify-between items-center mt-8 border-b border-[#3b3561]">
        <div className="w-24 h-8 bg-[#3b3561] rounded-full"></div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-300" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#8b3dff] rounded-full"></div>
          </div>
          <MessageSquare className="w-5 h-5 text-gray-300" />
          <div className="flex items-center gap-3 border-l border-[#4b4376] pl-6">
            <div className="text-right">
              <p className="text-sm font-bold text-white">PORTAL USER</p>
              <p className="text-xs text-gray-400">PRO Membership</p>
            </div>
            <div className="w-10 h-10 bg-[#1e1a3b] rounded-lg flex items-center justify-center text-lg font-bold">
              U
            </div>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <button 
        onClick={handleViewDetails}
        className="w-full bg-white text-[#8b3dff] font-bold text-lg py-4 rounded-b-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        VIEW DETAILS <span className="text-xl">→</span>
      </button>

      {/* Details are now shown on a separate page */}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1a3b;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8b3dff;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default SakhiEye;
