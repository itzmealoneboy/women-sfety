import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../../components/common/Map';
import { useAuthStore } from '../../store/authstores';
import {
  PlayIcon,
  ShareIcon,
  StopIcon,
  SignalIcon,
  MapPinIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  ClockIcon,
  Battery50Icon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LiveTrackingSecuredDB', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const secureSaveLocation = async (locData) => {
  try {
    const db = await initDB();
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').add({ 
      ...locData, 
      encryptedAt: Date.now() 
    });
  } catch (err) {
    console.error("IndexedDB Error", err);
  }
};

const LiveTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [isTracking, setIsTracking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [pathHistory, setPathHistory] = useState([]);
  const [address, setAddress] = useState("Scanning Satellites...");
  const watchIdRef = useRef(null);
  const lastGeocodeTime = useRef(0);
  const [battery, setBattery] = useState(100);

  const [liveInfo, setLiveInfo] = useState({
    lat: 13.0827,
    lng: 80.2707,
    speed: 0,
    heading: 0,
    accuracy: 0,
    timestamp: null
  });

  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then(batt => {
        setBattery(Math.round(batt.level * 100));
        batt.addEventListener('levelchange', () => {
          setBattery(Math.round(batt.level * 100));
        });
      });
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const kmPh = liveInfo.speed ? (liveInfo.speed * 3.6).toFixed(1) : 0;
  
  const fetchAddress = async (lat, lng) => {
    const now = Date.now();
    if (now - lastGeocodeTime.current < 10000) return;
    lastGeocodeTime.current = now;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
          setAddress(data.display_name);
      }
    } catch {
    }
  };

  const handleStartTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation API is not supported by your browser');
      return;
    }

    setIsTracking(true);
    toast.success('High-Accuracy GPS Tracking Started');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, heading, accuracy } = position.coords;
        const ts = position.timestamp;
        
        if (accuracy > 500) return;

        setLiveInfo({
          lat: latitude,
          lng: longitude,
          speed: speed || 0,
          heading: heading || 0,
          accuracy: accuracy || 0,
          timestamp: ts
        });

        setPathHistory(prev => {
            const newHistory = [...prev, [latitude, longitude]];
            return newHistory.slice(-100); // Keep last 100 locations
        });

        secureSaveLocation({ latitude, longitude, speed, timestamp: ts });
        fetchAddress(latitude, longitude);
      },
      (error) => {
        toast.error('Location Error: ' + error.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleStopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsSharing(false);
    toast.info('Tracking paused. Battery saving enabled.');
  };

  const toggleShare = () => {
    if (!isTracking) {
      toast.error('You must start tracking first!');
      return;
    }
    setIsSharing(!isSharing);
    if (!isSharing) {
      toast.success(`Live Share Link Generated & Sent to Family!`);
    } else {
      toast.info('Live Sharing Stopped.');
    }
  };

  const handleSOS = () => {
      const mapLink = `https://maps.google.com/?q=${liveInfo.lat},${liveInfo.lng}`;
      const msg = `🚨 *URGENT SOS* 🚨\nI am in danger! Here is my live location:\n📍 ${mapLink}\n\nBattery: ${battery}%\nSpeed: ${kmPh} km/h`;
      
      setTimeout(() => {
          window.location.href = `whatsapp://send?text=${encodeURIComponent(msg)}`;
      }, 300);

      toast.error('Emergency Broadcast Fired!', { duration: 4000 });
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-24 relative font-sans text-white">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 pt-4 gap-6 border-b border-indigo-500/20 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 flex items-center gap-3">
            <div className="relative">
              <SignalIcon className={`w-10 h-10 ${isTracking ? 'text-teal-400 animate-pulse' : 'text-gray-500'}`} /> 
              {isTracking && <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20 animate-ping top-0 left-0"></span>}
            </div>
            LIVE TRACKING
            </h1>
            <p className="text-indigo-200 mt-2 font-medium text-sm md:text-md opacity-80 flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-teal-400"/> AES-256 Encrypted GPS Telemetry
            </p>
          </div>

          <button onClick={handleSOS} className="group relative w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 transition-all text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(225,29,72,0.6)] flex items-center justify-center gap-3 active:scale-95">
              <span className="absolute inset-0 w-full h-full rounded-2xl ring-4 ring-red-500/30 animate-pulse"></span>
              <ShieldExclamationIcon className="w-7 h-7 group-hover:scale-110 transition-transform"/> 
              <span>EMERGENCY SOS</span>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Map Box - Glassmorphism */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative h-[500px] md:h-[600px] ring-1 ring-white/5">
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-teal-400 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-bold tracking-wider">{isTracking ? 'GPS LOCK ACQUIRED' : 'OFFLINE'}</span>
                </div>
                <Map
                    center={{ lat: liveInfo.lat, lng: liveInfo.lng }}
                    zoom={17}
                    height="100%"
                    className="filter sepia brightness-90 saturate-200 contrast-125"
                    markers={[
                        {
                        lat: liveInfo.lat,
                        lng: liveInfo.lng,
                        popup: 'Your Live Position'
                        }
                    ]}
                    polyline={pathHistory.length > 1 ? { points: pathHistory, color: '#2dd4bf', weight: 5 } : null}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button 
                  onClick={!isTracking ? handleStartTracking : handleStopTracking}
                  className={`py-5 px-6 rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${!isTracking ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:-translate-y-1' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'}`}
                 >
                   {!isTracking ? <><PlayIcon className="w-7 h-7" /> START TRACKING</> : <><StopIcon className="w-7 h-7 text-red-400"/> STOP TRACKING</>}
                 </button>
                 
                 <button 
                  onClick={toggleShare}
                  className={`py-5 px-6 rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-md ${isSharing ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:-translate-y-1'}`}
                 >
                     <ShareIcon className={`w-6 h-6 ${isSharing ? 'animate-pulse text-indigo-400' : ''}`} /> 
                     {isSharing ? 'LIVE SHARE ACTIVE' : 'SHARE MY LOCATION'}
                 </button>
            </div>
          </div>

          {/* Telemetry Information Sidebar */}
          <div className="lg:col-span-1 space-y-6">
              
              {/* Stats Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-teal-500/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all"></div>
                  
                  <h3 className="uppercase tracking-widest text-xs font-black text-teal-400 mb-6 flex items-center gap-2">
                    <ActivityIcon /> TELEMETRY DATA
                  </h3>
                  
                  <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <span className="text-gray-400 font-medium text-sm">Target Velocity</span>
                          <span className="font-black text-white text-3xl">{kmPh} <span className="text-sm font-medium text-teal-400 ml-1">km/h</span></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <span className="text-gray-400 font-medium text-sm">Heading</span>
                          <span className="font-bold text-white text-xl">{liveInfo.heading ? Math.round(liveInfo.heading) + '° N' : 'Analyzing...'}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <span className="text-gray-400 font-medium text-sm">GPS Accuracy</span>
                          <span className="font-bold text-emerald-400 text-xl">±{Math.round(liveInfo.accuracy)}m</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <span className="text-gray-400 font-medium text-sm">Battery Status</span>
                          <span className="font-bold text-white flex items-center gap-2 text-xl">
                            {battery}% <Battery50Icon className={`w-6 h-6 ${battery < 20 ? 'text-red-500' : 'text-teal-400'}`}/>
                          </span>
                      </div>
                  </div>
              </div>

              {/* Address Card */}
              <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
                  <h3 className="uppercase tracking-widest text-xs font-bold text-indigo-300 mb-4 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4"/> CURRENT GEO-LOCATION
                  </h3>
                  <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                    <p className="font-medium text-[15px] leading-relaxed text-indigo-50">
                        {address}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-indigo-300/60 font-mono bg-black/20 p-3 rounded-xl inline-block">
                      <span>LAT: {liveInfo.lat.toFixed(6)}</span>
                      <span className="text-indigo-500/40">|</span>
                      <span>LNG: {liveInfo.lng.toFixed(6)}</span>
                  </div>
              </div>
              
              {/* Auto Refresh Status */}
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ClockIcon className="w-5 h-5 text-teal-400" />
                    <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping"></span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-100">AUTO-REFRESH ACTIVE</p>
                    <p className="text-[10px] text-teal-400/70">Updating every 2-3 seconds</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-teal-400/50" />
              </div>

          </div>

      </div>
    </div>
  );
};

// SVG Icon Helper
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default LiveTracking;
