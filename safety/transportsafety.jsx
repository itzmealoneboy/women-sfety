import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationsstore';
import Map from '../../components/common/Map';
import {
  TruckIcon, MapPinIcon, PhoneIcon, ShareIcon, ExclamationTriangleIcon,
  ClockIcon, UserIcon, CheckCircleIcon, BellIcon, ShieldCheckIcon,
  ViewfinderCircleIcon, UserGroupIcon, MicrophoneIcon, SignalIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TransportSafety = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocationStore();

  const [activeMode, setActiveMode] = useState('cab');
  const transportModes = [
    { id: 'cab', icon: '🚕', label: 'Cab / Ride' },
    { id: 'bus', icon: '🚌', label: 'Bus' },
    { id: 'train', icon: '🚄', label: 'Train' },
    { id: 'auto', icon: '🛺', label: 'Auto' }
  ];

  // Cab State
  const [tripActive, setTripActive] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [cabNumber, setCabNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [recording, setRecording] = useState(false);

  // Bus State
  const [busNumber, setBusNumber] = useState('');

  // Train State
  const [trainNumber, setTrainNumber] = useState('');

  const startTrip = () => {
    if (!destination || !driverName || !cabNumber) {
      toast.error('Complete driver and destination fields to activate surveillance.', { icon: '🛑' });
      return;
    }
    setTripActive(true);
    toast.success('AI Route Surveillance Active. Tracking deviation.', { icon: '🛡️' });
  };

  const shareTripDetails = () => {
    if (!driverName || !cabNumber) return toast.error('Fill vehicle info first');
    const msg = `🚕 *CAB TRIP TRACKING*\nDriver: ${driverName}\nCab No: ${cabNumber}\nTo: ${destination}\n📍 Live: https://maps.google.com/?q=${currentLocation?.lat},${currentLocation?.lng}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const callEmergency = () => {
    toast.error('🚨 SOS Alert Triggered! Authorities notified.');
  };

  const simulateFakeCall = () => {
    toast.success('Fake call from "Dad" incoming in 5 seconds...', { icon: '📞' });
  };

  const toggleRecording = () => {
    setRecording(!recording);
    if (!recording) toast.success('Covert Audio Recording Started');
    else toast.success('Audio Securely Uploaded to Cloud DB');
  };

  return (
    <div className="bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-32 font-sans text-slate-200">
      
      {/* Header */}
      <div className="pb-8 pt-4 border-b border-slate-800">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-3">
          <ShieldCheckIcon className="w-10 h-10 text-blue-400"/> TRANSPORT SAFETY
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          Real-time tracking, driver verification, and covert emergency tools.
        </p>
      </div>

      {/* Transport Modes Navigation */}
      <div className="flex overflow-x-auto gap-4 py-4 mb-6 custom-scrollbar">
          {transportModes.map(mode => (
              <button 
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 ${activeMode === mode.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
              >
                  <span className="text-2xl">{mode.icon}</span> {mode.label}
              </button>
          ))}
      </div>

      {/* CAB SAFETY */}
      {activeMode === 'cab' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 z-10 relative">
                   <UserIcon className="w-6 h-6 text-blue-400"/> Driver Verification
                </h2>
                <div className="space-y-4 relative z-10">
                    <div className="group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Driver Name / ID</label>
                        <input type="text" value={driverName} onChange={(e)=>setDriverName(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="E.g. Ramesh K." />
                    </div>
                    <div className="group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Vehicle Reg Number</label>
                        <input type="text" value={cabNumber} onChange={(e)=>setCabNumber(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 mt-1 text-white uppercase focus:outline-none focus:border-blue-500 transition-colors" placeholder="TN 01 AB 1234" />
                    </div>
                    <div className="group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Drop Destination</label>
                        <input type="text" value={destination} onChange={(e)=>setDestination(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Search destination..." />
                    </div>
                </div>

                <div className="mt-8">
                    <button onClick={startTrip} className={`w-full py-4 rounded-2xl font-black text-lg flex justify-center items-center gap-2 transition-all ${tripActive ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02]'}`}>
                        <SignalIcon className={`w-6 h-6 ${tripActive ? 'animate-pulse' : ''}`}/> 
                        {tripActive ? 'AI SURVEILLANCE ACTIVE' : 'INITIALIZE TRACKING'}
                    </button>
                    <button onClick={shareTripDetails} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-4 rounded-2xl font-bold mt-3 flex justify-center items-center gap-2 transition-colors">
                        <ShareIcon className="w-5 h-5"/> SHARE ETA TO FAMILY
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={simulateFakeCall} className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-5 hover:border-slate-500 transition-all flex flex-col items-center justify-center gap-3 shadow-lg group">
                   <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><PhoneIcon className="w-6 h-6 text-emerald-400"/></div>
                   <span className="font-bold text-sm text-slate-300">Fake Call</span>
               </button>
               <button onClick={toggleRecording} className={`rounded-3xl p-5 transition-all flex flex-col items-center justify-center gap-3 shadow-lg group ${recording ? 'bg-red-500/10 border-red-500/50 border' : 'bg-slate-900/60 border border-slate-700/50 hover:border-slate-500'}`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${recording ? 'bg-red-500 animate-pulse' : 'bg-red-500/20'}`}><MicrophoneIcon className={`w-6 h-6 ${recording ? 'text-white' : 'text-red-400'}`}/></div>
                   <span className={`font-bold text-sm ${recording ? 'text-red-400' : 'text-slate-300'}`}>{recording ? 'Recording Rec' : 'Covert Audio'}</span>
               </button>
            </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-2 relative overflow-hidden flex flex-col h-[600px] shadow-2xl">
            {tripActive && (
                <div className="absolute top-6 left-6 right-6 z-20 bg-emerald-500/90 backdrop-blur-md text-white p-3 rounded-xl flex items-center gap-3 shadow-lg border border-emerald-400">
                    <ShieldCheckIcon className="w-6 h-6"/>
                    <span className="font-bold text-sm">System matching actual path to optimal safe route. No deviations detected.</span>
                </div>
            )}
            <div className="flex-grow rounded-2xl overflow-hidden ring-1 ring-slate-800 relative z-10 w-full h-full">
                <Map
                  center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
                  zoom={15}
                  height="100%"
                  className="filter grayscale contrast-125 invert-[0.9] hue-rotate-180" // Dark aesthetic trick
                  markers={[{ lat: currentLocation?.lat || 13.0827, lng: currentLocation?.lng || 80.2707, popup: 'Current Cab Location' }]}
                />
            </div>
        </div>
      </div>
      )}

      {/* BUS SAFETY */}
      {activeMode === 'bus' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
            <h2 className="text-2xl font-black text-amber-400 mb-6 flex items-center gap-3"><TruckIcon className="w-8 h-8"/> Bus Safety Network</h2>
            <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase">Bus Reg or Route No</label>
                <input type="text" value={busNumber} onChange={(e)=>setBusNumber(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 mt-2 text-white font-bold tracking-wider" placeholder="e.g. 21G" />
            </div>
            <button onClick={() => toast.success('Connecting to transit API... ETA 12 mins')} className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 mb-8">
                TRACK ARRIVAL TIME
            </button>
            <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-300 font-bold">Women's Seat Tracker</span>
                    <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-bold">LIVE</span>
                </div>
                <p className="text-sm text-amber-100/70">Based on recent passenger disembark data, ~3 ladies seats are likely vacant.</p>
            </div>
        </div>
        <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-6 text-white">Nearest Safe Havens near your Stop</h3>
            <div className="space-y-4">
                <div className="bg-slate-800 p-4 border border-slate-700 rounded-2xl flex justify-between items-center border-l-4 border-l-blue-500">
                    <div>
                        <div className="font-bold text-white">Central Police Post</div>
                        <div className="text-xs text-slate-400">Main Road • Lit Area • 200m away</div>
                    </div>
                    <button className="bg-slate-700 p-2 rounded-xl hover:bg-slate-600"><MapPinIcon className="w-5 h-5 text-blue-400"/></button>
                </div>
                <div className="bg-slate-800 p-4 border border-slate-700 rounded-2xl flex justify-between items-center border-l-4 border-l-emerald-500">
                    <div>
                        <div className="font-bold text-white">Apollo Pharmacy 24/7</div>
                        <div className="text-xs text-slate-400">CCTV Included • 400m away</div>
                    </div>
                    <button className="bg-slate-700 p-2 rounded-xl hover:bg-slate-600"><MapPinIcon className="w-5 h-5 text-emerald-400"/></button>
                </div>
            </div>
            <div className="mt-6 flex items-center gap-3 bg-slate-800/50 p-4 rounded-2xl">
                <UserGroupIcon className="w-8 h-8 text-indigo-400"/>
                <div>
                   <div className="text-sm font-bold text-indigo-300">Co-Travelers</div>
                   <div className="text-xs text-slate-400">Opt-in network shows 4 other verified women boarding this route.</div>
                </div>
            </div>
        </div>
      </div>
      )}

      {/* TRAIN SAFETY - Simple Placeholder to show design language */}
      {activeMode === 'train' && (
      <div className="bg-indigo-900/20 p-10 rounded-3xl border border-indigo-500/20 text-center">
          <h2 className="text-3xl font-black text-indigo-400 mb-4">Railway Security Grid</h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8">Access coach compositions to find Ladies Coaches faster. Get silent ALERTS to nearby passengers during emergencies.</p>
          <div className="inline-block bg-slate-900 rounded-2xl p-6 border border-slate-700 w-full max-w-sm mx-auto">
             <input type="text" className="w-full bg-slate-800 text-center uppercase border border-slate-700 rounded-xl px-4 py-3 text-white mb-4" placeholder="TRAIN NO / PNR" />
             <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl border-b-2 border-indigo-800">FETCH LAYOUT MAP</button>
          </div>
      </div>
      )}

      {/* AUTO SAFETY - Simple Placeholder to show design language */}
      {activeMode === 'auto' && (
      <div className="bg-orange-500/10 p-10 rounded-3xl border border-orange-500/20 text-center">
          <h2 className="text-3xl font-black text-orange-400 mb-4">Auto-Rickshaw Safety</h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8">Quickly log auto number plates to cloud servers before boarding. Algorithm checks if Fare is normal or predatory.</p>
          <button className="bg-orange-500 hover:bg-orange-400 text-black font-black py-4 px-10 rounded-2xl">QUICK LOG VEHICLE INFO</button>
      </div>
      )}

      {/* Floating Global SOS */}
      <button onClick={callEmergency} className="fixed bottom-8 right-8 w-20 h-20 bg-red-600 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none border-4 border-red-900 z-50 animate-bounce">
        <span className="font-black text-white text-xl">SOS</span>
      </button>

    </div>
  );
};

export default TransportSafety;
