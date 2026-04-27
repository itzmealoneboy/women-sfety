import React, { useState, useEffect, useRef } from "react";
import { MicrophoneIcon, PhoneIcon, CheckCircleIcon, XMarkIcon, PlayIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const VoiceClone = () => {
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceCloned, setVoiceCloned] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [scheduledCalls, setScheduledCalls] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [successCalls, setSuccessCalls] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    phone: "",
    time: "",
    date: "",
    scenario: "family",
    customMessage: ""
  });

  const quickScenarios = {
    family: "Amma, please come home immediately. Father is not well.",
    father: "Daughter, I am waiting outside. Come down now.",
    police: "Emergency! I need help immediately. Please come now.",
    friend: "Hey, where are you? Come fast, something happened.",
    home: "House lock broken, come home now immediately.",
    medical: "Take medicine and come home immediately please.",
    office: "Meeting cancelled, come home now immediately.",
    cab: "Cab is waiting, come down immediately please."
  };

  // Load data on mount
  useEffect(() => {
    const savedVoiceStatus = localStorage.getItem("voiceClonedStatus");
    const savedScheduled = localStorage.getItem("scheduledCalls");
    const savedLogs = localStorage.getItem("callLogs");
    const savedTotal = localStorage.getItem("totalCallsCount");
    const savedSuccess = localStorage.getItem("successCallsCount");

    if (savedVoiceStatus) setVoiceCloned(JSON.parse(savedVoiceStatus));
    if (savedScheduled) setScheduledCalls(JSON.parse(savedScheduled));
    if (savedLogs) setCallLogs(JSON.parse(savedLogs));
    if (savedTotal) setTotalCalls(parseInt(savedTotal));
    if (savedSuccess) setSuccessCalls(parseInt(savedSuccess));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("voiceClonedStatus", JSON.stringify(voiceCloned));
    localStorage.setItem("scheduledCalls", JSON.stringify(scheduledCalls));
    localStorage.setItem("callLogs", JSON.stringify(callLogs));
    localStorage.setItem("totalCallsCount", totalCalls);
    localStorage.setItem("successCallsCount", successCalls);
  }, [voiceCloned, scheduledCalls, callLogs, totalCalls, successCalls]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording && recordingTime < 300) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) {
            stopRecording();
            return 300;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        setRecordedAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.success("🎙️ Recording started");
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.success("✅ Recording stopped");
    }
  };

  const playRecording = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const audio = new Audio(url);
      audio.play();
      toast.success("🔊 Playing recording");
    } else {
      toast.error("No recording available");
    }
  };

  const cloneVoice = async () => {
    if (!recordedAudio) {
      toast.error("Please record your voice first");
      return;
    }

    setIsCloning(true);
    const toastId = toast.loading("🤖 Cloning your voice...");

    setTimeout(() => {
      setVoiceCloned(true);
      setIsCloning(false);
      toast.success("✅ Voice cloned successfully!", { id: toastId });
    }, 2000);
  };

  const scheduleCall = (e) => {
    e.preventDefault();
    if (!voiceCloned) {
      toast.error("Please clone your voice first");
      return;
    }
    if (!scheduleForm.name || !scheduleForm.phone || !scheduleForm.date || !scheduleForm.time) {
      toast.error("Please fill all fields");
      return;
    }

    const newCall = {
      id: Date.now(),
      name: scheduleForm.name,
      phone: scheduleForm.phone,
      date: scheduleForm.date,
      time: scheduleForm.time,
      message: scheduleForm.customMessage || quickScenarios[scheduleForm.scenario],
      scenario: scheduleForm.scenario,
      status: "Pending",
      createdAt: new Date().toLocaleString()
    };

    setScheduledCalls([newCall, ...scheduledCalls]);
    setScheduleForm({ name: "", phone: "", time: "", date: "", scenario: "family", customMessage: "" });
    toast.success(`📞 Call scheduled for ${scheduleForm.name}`);
  };

  const testCallNow = (scenario = "family", recipientName = "Recipient") => {
    if (!voiceCloned) {
      toast.error("Please clone your voice first");
      return;
    }

    const toastId = toast.loading(`📞 Calling ${recipientName}...`);

    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        name: recipientName,
        message: quickScenarios[scenario],
        timestamp: new Date().toLocaleString(),
        status: Math.random() > 0.2 ? "Success" : "Failed",
        duration: Math.floor(Math.random() * 5) + 1
      };

      setCallLogs([newLog, ...callLogs]);
      setTotalCalls(totalCalls + 1);
      if (newLog.status === "Success") {
        setSuccessCalls(successCalls + 1);
        toast.success(`✅ Call connected with ${recipientName}!`, { id: toastId });
      } else {
        toast.error(`❌ Call failed, SMS sent to ${recipientName}`, { id: toastId });
      }
    }, 2000);
  };

  const cancelScheduledCall = (id) => {
    setScheduledCalls(scheduledCalls.filter(call => call.id !== id));
    toast.success("📞 Call cancelled");
  };

  const executeScheduledCall = (call) => {
    const toastId = toast.loading(`📞 Executing call to ${call.name}...`);
    
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        name: call.name,
        message: call.message,
        timestamp: new Date().toLocaleString(),
        status: Math.random() > 0.2 ? "Success" : "Failed",
        duration: Math.floor(Math.random() * 5) + 1
      };

      setCallLogs([newLog, ...callLogs]);
      setTotalCalls(totalCalls + 1);
      if (newLog.status === "Success") {
        setSuccessCalls(successCalls + 1);
      }

      setScheduledCalls(scheduledCalls.map(c => c.id === call.id ? { ...c, status: "Sent" } : c));
      
      if (newLog.status === "Success") {
        toast.success(`✅ Call connected with ${call.name}!`, { id: toastId });
      } else {
        toast.error(`❌ Call failed, SMS sent`, { id: toastId });
      }
    }, 2000);
  };

  const successRate = totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 0;

  return (
    <div className="space-y-8 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen p-4 md:p-6 pb-20">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          🎤 AI VOICE CLONE SYSTEM
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Your Voice → Your Safety → Your Escape</p>
      </div>

      {/* Step 1: Record Voice */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MicrophoneIcon className="w-8 h-8 text-purple-600" />
          STEP 1: RECORD YOUR VOICE
        </h2>

        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8 mb-6 border-2 border-purple-300">
          <div className="text-center">
            <MicrophoneIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold mb-4">🎙️ RECORDING AREA</p>

            {/* Timer */}
            <div className="text-5xl font-black text-purple-600 mb-4 font-mono">
              {Math.floor(recordingTime / 60).toString().padStart(2, "0")}:{(recordingTime % 60).toString().padStart(2, "0")} / 05:00
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-300"
                style={{ width: `${(recordingTime / 300) * 100}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center mb-4">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${
                  isRecording
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                ▶ START
              </button>
              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className={`px-6 py-3 rounded-lg font-bold ${
                  isRecording
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ⏹ STOP
              </button>
              <button
                onClick={playRecording}
                disabled={!recordedAudio}
                className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${
                  recordedAudio
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <PlayIcon className="w-5 h-5" /> PLAY
              </button>
            </div>

            <p className="text-sm text-gray-600">💡 Speak naturally for 5 minutes in a quiet place</p>
          </div>
        </div>
      </div>

      {/* Step 2: Clone Voice */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          🤖 STEP 2: CLONE YOUR VOICE
        </h2>

        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 border-2 border-blue-300">
          <div className="text-center">
            <button
              onClick={cloneVoice}
              disabled={isCloning || !recordedAudio || voiceCloned}
              className={`px-8 py-4 text-xl font-bold rounded-lg mb-6 transition-all ${
                voiceCloned
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : isCloning
                  ? "bg-yellow-600 text-white animate-pulse"
                  : recordedAudio
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isCloning ? "⏳ CLONING..." : voiceCloned ? "✅ CLONED" : "🤖 CLONE MY VOICE"}
            </button>

            <div className="space-y-2">
              <p className="text-lg font-bold text-gray-700">
                ⏳ Status: {voiceCloned ? "✅ Voice Ready" : "Ready to Clone"}
              </p>
              <p className="text-lg font-bold text-gray-700">
                ✅ Voice Cloned: {voiceCloned ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Schedule Call */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <PhoneIcon className="w-8 h-8 text-green-600" />
          STEP 3: SCHEDULE EMERGENCY CALLS
        </h2>

        <form onSubmit={scheduleCall} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="👤 Person Name"
              value={scheduleForm.name}
              onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="📞 Phone Number"
              value={scheduleForm.phone}
              onChange={(e) => setScheduleForm({ ...scheduleForm, phone: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            <input
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            <input
              type="time"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">🗣️ Select Scenario:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(quickScenarios).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScheduleForm({ ...scheduleForm, scenario: key })}
                  className={`px-4 py-3 rounded-lg font-bold transition-all uppercase text-sm ${
                    scheduleForm.scenario === key
                      ? "bg-green-600 text-white ring-2 ring-green-400"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {key === "family" && "🏠 Family"}
                  {key === "father" && "👨 Father"}
                  {key === "police" && "👮 Police"}
                  {key === "friend" && "👥 Friend"}
                  {key === "home" && "🏠 Home"}
                  {key === "medical" && "🏥 Medical"}
                  {key === "office" && "🏢 Office"}
                  {key === "cab" && "🚗 Cab"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">💬 Message (optional):</label>
            <textarea
              placeholder="Leave empty to use scenario message"
              value={scheduleForm.customMessage}
              onChange={(e) => setScheduleForm({ ...scheduleForm, customMessage: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg h-24 focus:border-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!voiceCloned}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              voiceCloned
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            💾 SAVE CALL
          </button>
        </form>
      </div>

      {/* Quick Scenarios */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ QUICK ESCAPE SCENARIOS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: "👩", label: "MOTHER", scenario: "family" },
            { emoji: "👨", label: "FATHER", scenario: "father" },
            { emoji: "👮", label: "POLICE", scenario: "police" },
            { emoji: "👥", label: "FRIEND", scenario: "friend" },
            { emoji: "🏠", label: "HOME", scenario: "home" },
            { emoji: "🏥", label: "MEDICAL", scenario: "medical" },
            { emoji: "🏢", label: "OFFICE", scenario: "office" },
            { emoji: "🚗", label: "CAB", scenario: "cab" }
          ].map(({ emoji, label, scenario }) => (
            <button
              key={scenario}
              onClick={() => testCallNow(scenario, label)}
              disabled={!voiceCloned}
              className={`py-4 rounded-lg font-bold transition-all ${
                voiceCloned
                  ? "bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xs uppercase">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Calls */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">⏰ SCHEDULED CALLS</h2>
        {scheduledCalls.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No scheduled calls yet</p>
        ) : (
          <div className="space-y-3">
            {scheduledCalls.map(call => (
              <div key={call.id} className="flex justify-between items-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-bold text-gray-800">🕐 {call.time} | {call.name}</p>
                  <p className="text-sm text-gray-600">"{call.message}"</p>
                </div>
                <div className="flex gap-2">
                  {call.status === "Pending" && (
                    <button
                      onClick={() => executeScheduledCall(call)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold text-sm"
                    >
                      Execute
                    </button>
                  )}
                  <span className={`px-3 py-2 rounded font-bold text-sm ${
                    call.status === "Sent"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {call.status === "Sent" ? "✅ Sent" : "⏳ Pending"}
                  </span>
                  <button
                    onClick={() => cancelScheduledCall(call.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call Logs */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📞 RECENT CALL LOGS</h2>
        {callLogs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No call history yet</p>
        ) : (
          <div className="space-y-3">
            {callLogs.slice(0, 5).map(log => (
              <div key={log.id} className={`p-4 rounded-lg border-l-4 ${
                log.status === "Success"
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">
                      {log.status === "Success" ? "✅" : "❌"} {log.name}
                    </p>
                    <p className="text-sm text-gray-600">"{log.message}"</p>
                    <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                  </div>
                  <span className={`font-bold text-sm px-3 py-1 rounded ${
                    log.status === "Success"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}>
                    {log.duration} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 DASHBOARD</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
            <p className="text-3xl font-black">
              {voiceCloned ? "✅" : "❌"}
            </p>
            <p className="text-sm mt-2 font-bold">VOICE CLONED</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
            <p className="text-3xl font-black">{totalCalls}</p>
            <p className="text-sm mt-2 font-bold">TOTAL CALLS</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl text-center">
            <p className="text-3xl font-black">{successCalls}</p>
            <p className="text-sm mt-2 font-bold">SUCCESS CALLS</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl text-center">
            <p className="text-3xl font-black">{totalCalls - successCalls}</p>
            <p className="text-sm mt-2 font-bold">FAILED CALLS</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">🎯 SUCCESS RATE</label>
          <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${successRate}%` }}
            />
          </div>
          <p className="text-right mt-2 font-bold text-gray-700">{successRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceClone;
