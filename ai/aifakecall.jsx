/*
 * ============================================================================
 * AI FAKE CALL DETECTOR - Complete Women Safety Feature
 * ============================================================================
 * 
 * The AI Fake Call Detector is an intelligent real-time phone call screening system designed specifically for women's safety, which automatically analyzes incoming calls within 0.5 seconds to detect fake, spam, harassment, and scam calls before they become a threat. This feature works by performing five layers of analysis: first, it checks the caller ID against a community-reported blacklist database of known harassers and scammers; second, it uses voice biometrics to create a voice fingerprint and detect if the caller is using voice changers, pre-recorded audio, or AI-generated deepfake voices; third, it converts speech to text in real-time and scans for danger keywords like "bank details," "Aadhaar number," "OTP," "you are alone," or "your son is kidnapped" which indicate scam attempts; fourth, it analyzes behavioral patterns including pressuring tactics, question dodging, emotional manipulation, and abusive language; and fifth, it calculates a dynamic risk score from 0% to 100% that updates every 2 seconds during the call. When a high-risk call is detected (above 70% score), the system automatically blocks the call, silently records the entire conversation as legal evidence with timestamp and location, sends immediate alerts to all family members with the caller's details, reports the number to police authorities, and adds the number to the community blacklist to protect other women. For low-risk suspicious calls, the screen displays a real-time warning showing "⚠️ SCAM LIKELY - 23 women reported this number" along with recommendations. All call recordings are stored in encrypted cloud storage and can be directly submitted as evidence for filing police complaints or restraining orders. This feature has successfully prevented over 85% of phone scams and harassment calls in testing, providing women with complete phone call security whether they are at home, traveling alone at night, or in any vulnerable situation.
 * 
 * ============================================================================
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheckIcon,
  PhoneIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  FingerPrintIcon,
  CheckCircleIcon,
  SpeakerWaveIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';

const AIFakeCall = () => {
  const [callState, setCallState] = useState('idle'); // idle | ringing | active | blocked
  const [scamType, setScamType] = useState('low-risk'); // low-risk | high-risk

  // Analysis States
  const [blacklistStatus, setBlacklistStatus] = useState('analyzing'); // analyzing | safe | flagged
  const [voiceFingerprint, setVoiceFingerprint] = useState('analyzing'); 
  const [behavioralStatus, setBehavioralStatus] = useState('analyzing');
  
  const [transcript, setTranscript] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const transcriptTimer = useRef(null);
  const riskTimer = useRef(null);
  const callTimer = useRef(null);

  // Pre-defined scenarios based on the user's prompt
  const scenarios = {
    'low-risk': {
      caller: 'Unknown Number',
      number: '+91 98765 43210',
      blacklistFlag: true,
      blacklistCount: 23,
      script: [
        { time: 2, speaker: 'Caller', text: "Hello, am I speaking to Priya?" },
        { time: 5, speaker: 'Caller', text: "I am calling from your network provider." },
        { time: 8, speaker: 'Caller', text: "Your connection will be disconnected tonight." },
        { time: 11, speaker: 'Caller', text: "Please press 1 to speak with an executive." }
      ],
      finalRisk: 45
    },
    'high-risk': {
      caller: 'Urgent Police',
      number: '+91 8888 999 111',
      blacklistFlag: false,
      script: [
         { time: 2, speaker: 'Caller', text: "Are you alone right now?" },
         { time: 5, speaker: 'Caller', text: "Your son is kidnapped. Do not cut the call." },
         { time: 8, speaker: 'Caller', text: "Send 50,000 to this Aadhaar number immediately or else..." },
         { time: 11, speaker: 'Caller', text: "We need your bank details right now!" },
         { time: 14, speaker: 'Caller', text: "Quickly give the OTP sent to your mobile!" }
      ],
      finalRisk: 95
    }
  };

  const startSimulation = (type) => {
    setScamType(type);
    setCallState('ringing');
    setTranscript([]);
    setRiskScore(0);
    setTimeElapsed(0);
    setBlacklistStatus('analyzing');
    setVoiceFingerprint('analyzing');
    setBehavioralStatus('analyzing');

    setTimeout(() => {
        setCallState('active');
        runAnalysisEngine(type);
    }, 2000);
  };

  const runAnalysisEngine = (type) => {
    const scenario = scenarios[type];
    let elapsed = 0;
    
    // Call Timer
    callTimer.current = setInterval(() => {
        elapsed++;
        setTimeElapsed(elapsed);
    }, 1000);

    // Initial 0.5s check (Blacklist)
    setTimeout(() => {
       if (scenario.blacklistFlag) setBlacklistStatus('flagged');
       else setBlacklistStatus('safe');
    }, 500);

    // Dynamic Risk Score (Updates every 2 seconds)
    riskTimer.current = setInterval(() => {
        setRiskScore(prev => {
            const next = prev + Math.floor(Math.random() * 15) + (type === 'high-risk' ? 10 : 2);
            if (type === 'high-risk' && next >= 70) {
               blockAndRecordCall();
               return 75;
            }
            if (next >= scenario.finalRisk) {
                clearInterval(riskTimer.current);
                return scenario.finalRisk;
            }
            return next;
        });

        // Toggle other states based on progression
        if (elapsed > 4) setVoiceFingerprint(type === 'high-risk' ? 'deepfake' : 'safe');
        if (elapsed > 7) setBehavioralStatus(type === 'high-risk' ? 'pressuring' : 'safe');

    }, 2000);

    // Transcript Generator
    let dialogIndex = 0;
    transcriptTimer.current = setInterval(() => {
       if (callState === 'blocked') return;
       const line = scenario.script[dialogIndex];
       if (line && elapsed >= line.time) {
           setTranscript(prev => [...prev, line]);
           dialogIndex++;
       }
       if (dialogIndex >= scenario.script.length) clearInterval(transcriptTimer.current);
    }, 1000);
  };

  const blockAndRecordCall = () => {
      clearInterval(callTimer.current);
      clearInterval(transcriptTimer.current);
      clearInterval(riskTimer.current);
      setCallState('blocked');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const highlightKeywords = (text) => {
      const keywords = ['bank details', 'Aadhaar number', 'OTP', 'you are alone', 'your son is kidnapped'];
      let highlighted = text;
      keywords.forEach(kw => {
          const regex = new RegExp(`(${kw})`, 'gi');
          highlighted = highlighted.replace(regex, `<span class="bg-red-500/20 text-red-400 font-bold px-1 rounded border border-red-500/30">$1</span>`);
      });
      return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  useEffect(() => {
      return () => {
          clearInterval(callTimer.current);
          clearInterval(transcriptTimer.current);
          clearInterval(riskTimer.current);
      };
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-32 text-gray-200 font-sans relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Feature Documentation / Header */}
        <div className="mb-10 max-w-5xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center gap-4 mb-4">
               <ShieldCheckIcon className="w-12 h-12 text-purple-500" /> AI FAKE CALL DETECTOR
            </h1>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-2xl">
                <p className="text-sm text-gray-400 leading-relaxed text-justify">
                    The AI Fake Call Detector is an intelligent real-time phone call screening system designed specifically for women's safety, which automatically analyzes incoming calls within 0.5 seconds to detect fake, spam, harassment, and scam calls before they become a threat. This feature works by performing five layers of analysis: first, it checks the caller ID against a community-reported blacklist database of known harassers and scammers; second, it uses voice biometrics to create a voice fingerprint and detect if the caller is using voice changers, pre-recorded audio, or AI-generated deepfake voices; third, it converts speech to text in real-time and scans for danger keywords like "bank details," "Aadhaar number," "OTP," "you are alone," or "your son is kidnapped" which indicate scam attempts; fourth, it analyzes behavioral patterns including pressuring tactics, question dodging, emotional manipulation, and abusive language; and fifth, it calculates a dynamic risk score from 0% to 100% that updates every 2 seconds during the call. When a high-risk call is detected (above 70% score), the system automatically blocks the call, silently records the entire conversation as legal evidence with timestamp and location, sends immediate alerts to all family members with the caller's details, reports the number to police authorities, and adds the number to the community blacklist to protect other women. For low-risk suspicious calls, the screen displays a real-time warning showing "⚠️ SCAM LIKELY - 23 women reported this number" along with recommendations. All call recordings are stored in encrypted cloud storage and can be directly submitted as evidence for filing police complaints or restraining orders. This feature has successfully prevented over 85% of phone scams and harassment calls in testing, providing women with complete phone call security whether they are at home, traveling alone at night, or in any vulnerable situation.
                </p>
            </div>
        </div>

        {/* Simulation Dashboard */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Column: Phone Interface */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Simulator Controls */}
                {callState === 'idle' && (
                    <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 shadow-xl">
                        <h2 className="font-bold text-white mb-4">Run Simulation Engine</h2>
                        <button onClick={() => startSimulation('low-risk')} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl mb-3 flex items-center justify-between border border-gray-700 transition-colors">
                            <span>Test Low-Risk Harassment Call</span> <PhoneIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => startSimulation('high-risk')} className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold py-3 px-4 rounded-xl flex items-center justify-between border border-red-900 transition-colors">
                            <span>Test High-Risk Deepfake Scam</span> <PhoneIcon className="w-5 h-5"/>
                        </button>
                    </div>
                )}

                {/* Active Phone Screen */}
                {callState !== 'idle' && (
                <div className="bg-black rounded-[3rem] border-[8px] border-gray-800 p-6 flex flex-col h-[650px] shadow-2xl relative overflow-hidden ring-4 ring-black">
                    {/* Dynamic Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-2xl"></div>

                    {/* Caller Info */}
                    <div className="text-center mt-12 mb-8">
                        <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                            <span className="text-4xl text-gray-400 font-black">{scenarios[scamType].caller.charAt(0)}</span>
                        </div>
                        <h2 className="text-3xl font-light text-white mb-1">{scenarios[scamType].caller}</h2>
                        <p className="text-gray-400 font-mono tracking-widest">{scenarios[scamType].number}</p>
                        <p className="text-gray-500 text-sm mt-2 font-mono">{callState === 'ringing' ? 'Incoming Call...' : formatTime(timeElapsed)}</p>
                    </div>

                    {/* Call Alerts Overlay */}
                    {callState === 'active' && scamType === 'low-risk' && blacklistStatus === 'flagged' && (
                        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-500 p-4 rounded-2xl mb-4 animate-pulse text-center space-y-1">
                            <div className="font-bold flex justify-center items-center gap-2"><ExclamationTriangleIcon className="w-5 h-5" /> SCAM LIKELY</div>
                            <div className="text-xs">23 women reported this number</div>
                        </div>
                    )}

                    {callState === 'blocked' && (
                        <div className="bg-red-500/10 border-2 border-red-500 p-5 rounded-2xl mb-4 text-center">
                            <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                                <PhoneXMarkIcon className="w-6 h-6"/>
                            </div>
                            <h3 className="font-black text-red-500 text-lg mb-2">CALL AUT0-BLOCKED</h3>
                            <div className="text-xs text-red-300 space-y-2 mt-4 text-left bg-red-900/30 p-3 rounded-lg border border-red-500/30">
                                <div className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-400"/> Silently recording legal evidence...</div>
                                <div className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-400"/> Alerts sent to family with timestamp.</div>
                                <div className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-400"/> Automatic Police Report Generated.</div>
                                <div className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-400"/> Added to Community Blacklist.</div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <button onClick={() => setCallState('idle')} className="bg-red-500 text-white py-4 rounded-full flex justify-center items-center hover:bg-red-600 transition-colors">
                            <PhoneXMarkIcon className="w-8 h-8" />
                        </button>
                        <button disabled className="bg-green-500/50 text-white/50 py-4 rounded-full flex justify-center items-center cursor-not-allowed">
                            <PhoneIcon className="w-8 h-8" />
                        </button>
                    </div>

                </div>
                )}
            </div>

            {/* Right Column: 5-Layer AI Analysis Engine */}
            {callState !== 'idle' && (
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Risk Score & Status Header */}
                <div className="bg-[#111] backdrop-blur-xl border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3"><ShieldCheckIcon className="w-8 h-8 text-purple-500"/> AI Analysis Engine</h2>
                        <p className="text-gray-400 text-sm mt-1">Real-time processing active. Re-evaluating every 2.0s</p>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-gray-900 p-4 rounded-2xl border border-gray-800">
                        <div className="text-right">
                           <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Dynamic Risk</div>
                           <div className={`text-4xl font-black ${riskScore >= 70 ? 'text-red-500 animate-pulse' : riskScore >= 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                               {riskScore}%
                           </div>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center relative border-gray-800">
                             {/* SVG Circle for progress */}
                             <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                                 <circle cx="28" cy="28" r="26" fill="transparent" stroke="currentColor" strokeWidth="4" className={riskScore >= 70 ? 'text-red-500' : riskScore >= 40 ? 'text-yellow-500' : 'text-green-500'} strokeDasharray="163" strokeDashoffset={163 - (163 * riskScore) / 100} />
                             </svg>
                             <ChartBarIcon className={`w-6 h-6 ${riskScore >= 70 ? 'text-red-500' : riskScore >= 40 ? 'text-yellow-500' : 'text-green-500'}`}/>
                        </div>
                    </div>
                </div>

                {/* 5 Layers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Layer 1: Blacklist */}
                    <div className="bg-[#111] border border-gray-800 p-5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl"><UserGroupIcon className="w-5 h-5 text-blue-500" /></div>
                            <h3 className="font-bold text-white text-sm">1. Caller Blacklist DB</h3>
                        </div>
                        {blacklistStatus === 'analyzing' ? <div className="text-gray-500 animate-pulse text-sm">Querying 10M+ records...</div> : 
                         blacklistStatus === 'safe' ? <div className="text-green-400 font-mono text-sm">[✓] No reports found</div> : 
                         <div className="text-yellow-500 font-mono text-sm">[!] 23 Harassment Reports match caller ID.</div>}
                    </div>

                    {/* Layer 2: Voice Fingerprint */}
                    <div className="bg-[#111] border border-gray-800 p-5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-pink-500/10 rounded-xl"><FingerPrintIcon className="w-5 h-5 text-pink-500" /></div>
                            <h3 className="font-bold text-white text-sm">2. Voice Biometrics</h3>
                        </div>
                        {voiceFingerprint === 'analyzing' ? <div className="text-gray-500 animate-pulse text-sm">Creating vocal hash...</div> : 
                         voiceFingerprint === 'safe' ? <div className="text-green-400 font-mono text-sm">[✓] Natural biological voice detected</div> : 
                         <div className="text-red-400 font-mono text-sm font-bold">[!] DEEPFAKE DETECTED. Synthetic voice changer signature found.</div>}
                    </div>

                    {/* Layer 3: Speech to Text (Transcript Box) */}
                    <div className="bg-[#111] border border-gray-800 p-5 rounded-3xl md:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl"><DocumentTextIcon className="w-5 h-5 text-emerald-500" /></div>
                                <h3 className="font-bold text-white text-sm">3. Speech-to-Text & Keyword Scan</h3>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-gray-800 border border-gray-700 text-gray-400 text-[10px] px-2 py-1 rounded">Language: Auto (English/Hindi)</span>
                                <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20"><div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></div> Live Listen</span>
                            </div>
                        </div>
                        <div className="bg-gray-900 border border-black rounded-2xl p-4 h-[180px] overflow-y-auto space-y-3 font-mono text-sm">
                            {transcript.length === 0 && <div className="text-gray-600 italic">Waiting for audio input...</div>}
                            {transcript.map((line, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="text-gray-600">[{formatTime(line.time)}]</div>
                                    <div className="font-bold text-blue-400">{line.speaker}:</div>
                                    <div className="text-gray-300 flex-1">{highlightKeywords(line.text)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Layer 4: Behavioral Analysis */}
                    <div className="bg-[#111] border border-gray-800 p-5 rounded-3xl md:col-span-2">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-xl"><SpeakerWaveIcon className="w-5 h-5 text-orange-500" /></div>
                                <h3 className="font-bold text-white text-sm">4. Behavioral Pattern Analysis</h3>
                            </div>
                            {behavioralStatus !== 'analyzing' && <div className="text-xs text-gray-500">Models: NLP Sentiment, Aggression Vector</div>}
                        </div>
                        
                        <div className="w-full bg-gray-900 rounded-full h-2.5 mb-2 overflow-hidden flex border border-gray-800">
                             <div className="bg-green-500 h-2.5 transition-all w-1/3"></div>
                             <div className={`bg-orange-500 h-2.5 transition-all ${behavioralStatus === 'pressuring' ? 'w-1/3' : 'w-0'}`}></div>
                             <div className={`bg-red-500 h-2.5 transition-all ${behavioralStatus === 'pressuring' && riskScore > 60 ? 'w-1/3' : 'w-0'}`}></div>
                        </div>
                        
                        {behavioralStatus === 'analyzing' ? <div className="text-gray-500 text-xs">Awaiting sufficient dialog data...</div> : 
                         behavioralStatus === 'safe' ? <div className="text-green-400 font-mono text-sm">[✓] Calm tone. Normal conversational pacing.</div> : 
                         <div className="text-red-400 font-mono text-sm space-y-1">
                             <div>[!] High Pressuring Tactics Detected (89% match)</div>
                             <div>[!] Emotional Manipulation Signature: "Your son is kidnapped"</div>
                         </div>}
                    </div>

                </div>
            </div>
            )}
        </div>
    </div>
  );
};

export default AIFakeCall;
