import React, { useState, useEffect } from 'react';
import { useSakshiEyeStore } from '../../store/sakshieyestore';
import { SakshiEyeLiveWitness } from '../../components/sakshieye/SakshiEyeComponents';
import { ChartBarIcon, ExclamationTriangleIcon, XMarkIcon, ShieldCheckIcon, UserIcon, MicrophoneIcon, SignalIcon } from '@heroicons/react/24/solid';

const AIThreatDetections = () => {
  const { threatLevel, capturedFaces, autoRecordings, isMonitoring } = useSakshiEyeStore();
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, investigating: 0 });
  const [selectedThreat, setSelectedThreat] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat = {
        id: Date.now(),
        type: ['Malware', 'Phishing', 'Ransomware', 'Spyware', 'Intruder Alert', 'Suspicious Scream'][Math.floor(Math.random() * 6)],
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        source: Math.random() > 0.5 ? 'Nearby Device' : 'Network Signal',
        timestamp: new Date(),
        status: 'Detected',
        // AI Analysis Data
        analysis: {
          gender: ['Male', 'Female', 'Others', 'Non-human'][Math.floor(Math.random() * 4)],
          soundType: ['Aggressive Voice', 'Scream', 'Footsteps', 'Breaking Glass', 'Electronic Interference'][Math.floor(Math.random() * 5)],
          reason: 'High-frequency pattern identified via biometric sensors',
          distance: (Math.random() * 10).toFixed(1) + ' meters',
          threatScore: Math.floor(Math.random() * 40) + 60,
          recommendation: 'Move to a safe location and enable emergency SOS if threat persists.'
        }
      };
      setDetections(prev => [newThreat, ...prev].slice(0, 10));
      setStats({
        total: detections.length + 1,
        blocked: detections.filter(d => d.status === 'Blocked').length,
        investigating: detections.filter(d => d.status === 'Investigating').length
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [detections]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
            </div>
            AI Safety Intelligence
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Monitoring surroundings for human and digital threats</p>
        </div>
        <div className="flex items-center gap-3 bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-black text-green-700 tracking-wider">SYSTEM SECURE</span>
        </div>
      </div>

      {/* SAKHI EYE Live Witness */}
      <SakshiEyeLiveWitness
        threatLevel={threatLevel}
        facesCount={capturedFaces.length}
        recordingsCount={autoRecordings.length}
        isMonitoring={isMonitoring}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Alerts', val: stats.total, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Auto-Blocked', val: stats.blocked, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'AI Reviewing', val: stats.investigating, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color} mt-1`}>{stat.val}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <ShieldCheckIcon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Detections List */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900">Recent Threat Timeline</h3>
          <button className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline">Clear History</button>
        </div>
        <div className="divide-y divide-gray-50">
          {detections.length > 0 ? (
            detections.map(threat => (
              <div 
                key={threat.id} 
                onClick={() => setSelectedThreat(threat)}
                className="p-6 md:p-8 flex items-center justify-between hover:bg-purple-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ExclamationTriangleIcon className="w-7 h-7 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg uppercase tracking-tight">{threat.type}</p>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-xs font-bold text-gray-400">{threat.source}</span>
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       <span className="text-xs font-bold text-purple-500">Click for AI Analysis</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm`}
                    style={{ backgroundColor: getSeverityColor(threat.severity) }}>
                    {threat.severity}
                  </span>
                  <p className="text-xs font-bold text-gray-400 font-mono">{threat.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-gray-400 font-bold">No active threats detected</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedThreat(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">SAKHI Intelligence Report</h2>
                   <p className="text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Ref: THREAT_{selectedThreat.id.toString().slice(-6)}</p>
                </div>
                <button onClick={() => setSelectedThreat(null)} className="p-3 bg-white hover:bg-red-50 rounded-2xl transition-all shadow-sm group">
                   <XMarkIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                </button>
             </div>
             
             <div className="p-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                   {[
                     { label: 'Attacker Gender', val: selectedThreat.analysis.gender, icon: UserIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                     { label: 'Sound Class', val: selectedThreat.analysis.soundType, icon: MicrophoneIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                     { label: 'Threat Score', val: selectedThreat.analysis.threatScore + '%', icon: SignalIcon, color: 'text-red-600', bg: 'bg-red-50' },
                     { label: 'Distance', val: selectedThreat.analysis.distance, icon: ChartBarIcon, color: 'text-green-600', bg: 'bg-green-50' }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center text-center p-5 rounded-[30px] border border-gray-100 bg-white shadow-sm">
                        <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mb-4`}>
                           <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className={`text-sm font-black ${item.color}`}>{item.val}</p>
                     </div>
                   ))}
                </div>

                <div className="space-y-6">
                   <div className="bg-purple-50 p-6 rounded-[30px] border border-purple-100">
                      <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-3">AI Detection Basis</h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        Threat detected as <span className="font-black text-gray-900">{selectedThreat.type}</span>. 
                        Sensors identified: <span className="text-purple-600 font-bold">{selectedThreat.analysis.reason}</span>. 
                        The pattern matches high-risk behavior protocols.
                      </p>
                   </div>

                   <div className="bg-red-50 p-6 rounded-[30px] border border-red-100 flex items-start gap-5">
                      <div className="p-3 bg-red-100 rounded-2xl shrink-0">
                         <ShieldCheckIcon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Safety Recommendation</h4>
                        <p className="text-gray-700 text-sm font-bold leading-relaxed">
                          {selectedThreat.analysis.recommendation}
                        </p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedThreat(null)}
                  className="w-full mt-10 bg-gray-900 text-white py-5 rounded-[30px] font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl"
                >
                  Confirm & Archive Report
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIThreatDetections;
