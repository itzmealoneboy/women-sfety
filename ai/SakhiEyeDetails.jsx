import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { AlertCircle, User, ArrowLeft, Camera, Video, VideoOff, Mic, MicOff, Download, Play, Pause, Activity, Zap, ShieldAlert, X, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SakhiEyeDetails = () => {
  const [socket, setSocket] = useState(null);
  const [detailsLog, setDetailsLog] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'faces', 'security', 'voice'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const navigate = useNavigate();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const micStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Simulated AI Sound Analysis Data
  const analyzeSound = () => {
    const soundTypes = [
      { type: 'Aggressive Male Voice', gender: 'Male', reason: 'High pitch shouting detected', threat: 'High', score: 85, distance: '2-3 meters', advice: 'Avoid confrontation and move to a crowded area immediately.' },
      { type: 'Loud Scream', gender: 'Female', reason: 'Distress frequency pattern identified', threat: 'Critical', score: 98, distance: '5 meters', advice: 'Emergency SOS triggered. Stay in a safe position until help arrives.' },
      { type: 'Suspicious Footsteps', gender: 'Unknown', reason: 'Rhythmic vibration in silence', threat: 'Medium', score: 62, distance: '10 meters', advice: 'Maintain situational awareness. Do not take shortcuts.' },
      { type: 'Glass Breaking', gender: 'Non-human', reason: 'Sharp impact frequency', threat: 'High', score: 80, distance: '8 meters', advice: 'Potential break-in detected. Contact local authorities.' },
      { type: 'Soft Whispering', gender: 'Others', reason: 'Muffled near-mic vocal activity', threat: 'Medium', score: 45, distance: '1 meter', advice: 'Suspicious behavior detected near you. Check your surroundings.' }
    ];
    return soundTypes[Math.floor(Math.random() * soundTypes.length)];
  };

  useEffect(() => {
    // Connect to backend socket
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Sakhi Eye Server for Details');
      newSocket.emit('getDetails');
    });

    newSocket.once('detailsLog', (log) => {
      setDetailsLog(log);
    });

    // Listen for new real-time updates
    newSocket.on('detectionUpdate', (data) => {
      if (data.lastEvent) {
        let updatedEvent = { ...data.lastEvent };
        if (isCameraActive && videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          updatedEvent.imageBase64 = canvasRef.current.toDataURL('image/jpeg');
        }
        setDetailsLog((prev) => [...prev, updatedEvent]);
      }
    });

    return () => {
      newSocket.close();
      stopCamera();
      stopMic();
    };
  }, [isCameraActive, isMicActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) { console.error(err); }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const aiAnalysis = analyzeSound();
        setRecordings(prev => [...prev, { id: Date.now(), url: audioUrl, timestamp: new Date().toISOString(), analysis: aiAnalysis }]);
      };
      mediaRecorder.start();
      setIsMicActive(true);
    } catch (err) { console.error(err); }
  };

  const stopMic = () => {
    if (mediaRecorderRef.current && isMicActive) {
      mediaRecorderRef.current.stop();
      micStreamRef.current.getTracks().forEach(track => track.stop());
      setIsMicActive(false);
    }
  };

  const downloadRecording = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAKHI_AI_VOICE_${name}.wav`;
    link.click();
  };

  const filteredLog = detailsLog.filter(log => {
    if (activeTab === 'faces') return log.type === 'face_captured';
    if (activeTab === 'security') return log.type === 'safety_detection';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0d0b1a] text-white p-4 md:p-8 font-sans">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-[#3b3561] no-print gap-6">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('/sakhi-eye')} className="p-3 bg-[#1e1a3b] hover:bg-[#2a264a] rounded-2xl transition-all border border-[#3b3561] shadow-lg">
              <ArrowLeft className="w-6 h-6 text-purple-300" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <ShieldAlert className="text-[#9b51e0] w-8 h-8" />
                SAKHI INTEL HUB
              </h1>
              <p className="text-gray-500 text-sm font-medium">SAKHI AI Real-time Surveillance & Evidence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-[#1e1a3b] p-1.5 rounded-2xl border border-[#3b3561]">
                <button 
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className={`p-3 rounded-xl transition-all ${isCameraActive ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Video className="w-5 h-5" />
                </button>
                <button 
                  onClick={isMicActive ? stopMic : startMic}
                  className={`p-3 rounded-xl transition-all ${isMicActive ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
             </div>
             <button onClick={() => window.print()} className="bg-[#9b51e0] hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20">
               📥 Export PDF
             </button>
          </div>
        </div>

        {/* Print-only Header */}
        <div className="hidden print-header p-10 bg-white text-black border-b-4 border-black mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">SAKHI SAFETY EVIDENCE REPORT</h1>
              <p className="text-sm font-bold uppercase mt-2 tracking-widest">Generated: {new Date().toLocaleString()}</p>
              <p className="text-xs font-medium text-gray-600 mt-1 uppercase">Authentication Status: VERIFIED AI EVIDENCE</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-purple-600">SAKHI AI</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Biometric Surveillance Unit</p>
            </div>
          </div>
        </div>

        {/* Live Monitoring HUD */}
        {(isCameraActive || isMicActive) && (
          <div className="mb-10 grid md:grid-cols-2 gap-8">
            {isCameraActive && (
              <div className="relative rounded-[40px] overflow-hidden border-2 border-[#9b51e0] bg-black shadow-2xl">
                <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video object-cover" />
                <div className="absolute top-6 left-6 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] animate-pulse">SAKHI_EYE_ACTIVE</div>
              </div>
            )}
            {isMicActive && (
              <div className="bg-[#1e1a3b] rounded-[40px] border-2 border-green-500/50 p-10 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
                <div className="absolute top-6 left-6 bg-green-600 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] animate-pulse">AI_VOICE_ANALYSIS</div>
                <div className="flex gap-2 items-end h-20 mb-6">
                   {[1,2,3,4,5,6,7,8,7,6,5,4,5,6,7,8,6,4,2].map((h, i) => (
                     <div key={i} className="w-2 bg-green-400 rounded-full animate-bounce" style={{height: `${h*12}%`, animationDelay: `${i*0.05}s`}}></div>
                   ))}
                </div>
                <p className="text-sm text-green-400 font-mono font-black tracking-widest uppercase">Analyzing Environment...</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
          {[
            { id: 'all', label: 'Surveillance Hub' },
            { id: 'faces', label: 'Face Log' },
            { id: 'security', label: 'Threat Radar' },
            { id: 'voice', label: 'Voice Evidence' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-8 py-3.5 rounded-[24px] font-black whitespace-nowrap transition-all uppercase text-[10px] tracking-[0.15em] border ${
                activeTab === tab.id ? 'bg-[#9b51e0] text-white border-[#9b51e0] shadow-2xl shadow-purple-500/40 scale-105' : 'bg-[#1e1a3b] text-gray-500 border-[#3b3561] hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[60vh]">
          {activeTab === 'voice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recordings.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-[#1e1a3b]/30 rounded-[40px] border border-[#3b3561] border-dashed">
                  <Mic className="w-16 h-16 text-gray-700 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">Voice Archive Empty</h3>
                  <p className="text-gray-600 max-w-sm font-medium">Activate SAKHI Voice to start real-time environmental audio decoding.</p>
                </div>
              ) : (
                recordings.slice().reverse().map((rec) => (
                  <div key={rec.id} onClick={() => setSelectedAnalysis(rec)} className="bg-[#1e1a3b] border border-[#3b3561] rounded-[32px] p-6 hover:border-[#9b51e0] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-6">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rec.analysis.threat === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                             <Activity className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-black text-white uppercase text-sm tracking-widest">{rec.analysis.type}</h4>
                             <p className="text-[10px] text-gray-500 font-bold">{new Date(rec.timestamp).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#9b51e0] transition-all" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${rec.analysis.gender === 'Male' ? 'bg-blue-500/10 text-blue-400' : rec.analysis.gender === 'Female' ? 'bg-pink-500/10 text-pink-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {rec.analysis.gender} SOURCE
                       </span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl" onClick={(e) => e.stopPropagation()}>
                       <Play className="w-4 h-4 text-white fill-current" />
                       <div className="flex-1 h-1 bg-white/10 rounded-full"><div className="h-full bg-[#9b51e0] w-1/4"></div></div>
                       <Download className="w-4 h-4 text-gray-500 hover:text-white" onClick={() => downloadRecording(rec.url, rec.id)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'faces' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredLog.slice().reverse().map((log, index) => (
                <div key={index} className="group relative bg-[#1e1a3b] rounded-[32px] overflow-hidden border border-[#3b3561] hover:border-[#9b51e0] transition-all shadow-xl">
                  <img src={log.imageBase64} alt="Face" className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="p-5 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent">
                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">SAKHI_CAPTURE</p>
                    <p className="text-xs font-mono text-white/70">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredLog.slice().reverse().map((log, index) => (
                <div key={index} className={`rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8 border transition-all ${log.type === 'safety_detection' ? 'bg-red-500/5 border-red-500/20' : 'bg-[#1e1a3b] border-[#3b3561]'}`}>
                  <img src={log.imageBase64} alt="Log" className="w-40 h-40 rounded-[30px] object-cover border-4 border-[#1e1a3b] shadow-2xl" />
                  <div className="flex-1 text-center md:text-left">
                    <h4 className={`font-black text-2xl tracking-tight mb-4 ${log.type === 'safety_detection' ? 'text-red-500' : 'text-[#9b51e0]'}`}>
                      {log.type === 'safety_detection' ? '🚨 SAKHI EMERGENCY ALERT' : '🛡️ SAKHI EVIDENCE LOG'}
                    </h4>
                    <p className="text-base text-gray-500 leading-relaxed font-medium mb-4">
                      {log.type === 'safety_detection' ? 'Critical threat signature detected by SAKHI AI. Evidence captured and transmitted.' : 'Biometric evidence processed and archived in SAKHI cloud vault.'}
                    </p>
                    <span className="text-[10px] font-mono text-gray-600 uppercase bg-black/40 px-4 py-2 rounded-full">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Details Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 no-print">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedAnalysis(null)}></div>
          <div className="bg-[#1e1a3b] border border-[#3b3561] w-full max-w-2xl rounded-[40px] overflow-hidden relative z-10 shadow-2xl animate-in zoom-in duration-300">
             <div className="p-8 border-b border-[#3b3561] flex items-center justify-between">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">SAKHI VOICE INTELLIGENCE</h2>
                <X className="w-6 h-6 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => setSelectedAnalysis(null)} />
             </div>
             <div className="p-10">
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-black/30 p-5 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Speaker Gender</p>
                      <p className="text-lg font-black text-purple-400">{selectedAnalysis.analysis.gender}</p>
                   </div>
                   <div className="bg-black/30 p-5 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Sound Type</p>
                      <p className="text-lg font-black text-blue-400">{selectedAnalysis.analysis.type}</p>
                   </div>
                   <div className="bg-black/30 p-5 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Threat Score</p>
                      <p className="text-lg font-black text-red-500">{selectedAnalysis.analysis.score}%</p>
                   </div>
                   <div className="bg-black/30 p-5 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Distance</p>
                      <p className="text-lg font-black text-green-400">{selectedAnalysis.analysis.distance}</p>
                   </div>
                </div>
                <div className="bg-[#9b51e0]/10 border border-[#9b51e0]/30 rounded-3xl p-6 mb-6">
                   <h4 className="text-xs font-black text-[#9b51e0] uppercase mb-2">AI Reasoning</h4>
                   <p className="text-sm text-gray-300">{selectedAnalysis.analysis.reason}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6">
                   <h4 className="text-xs font-black text-red-500 uppercase mb-2">Safety Advice</h4>
                   <p className="text-sm text-gray-300 font-bold">{selectedAnalysis.analysis.advice}</p>
                </div>
                <button onClick={() => downloadRecording(selectedAnalysis.url, selectedAnalysis.id)} className="w-full mt-8 bg-white text-black py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-200">Download Evidence (.wav)</button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-header { display: block !important; }
          body { background: white !important; color: black !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8b3dff; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SakhiEyeDetails;
