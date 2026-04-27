import React, { useState, useRef, useEffect } from "react";
import {
  MicrophoneIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  TrashIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const MAX_RECORDING_TIME = 300; // 5 minutes in seconds
const SCENARIOS = [
  {
    label: "Mother",
    icon: "👩",
    message: "Amma, come home now. Emergency",
  },
  {
    label: "Father",
    icon: "👨",
    message: "Daughter, I'm waiting outside",
  },
  {
    label: "Police",
    icon: "👮",
    message: "Emergency! Need help immediately",
  },
  {
    label: "Friend",
    icon: "👥",
    message: "Hey, where are you? Come fast",
  },
  {
    label: "Home",
    icon: "🏠",
    message: "House lock broken, come now",
  },
  {
    label: "Medical",
    icon: "🚑",
    message: "Take medicine, come home",
  },
  {
    label: "Office",
    icon: "🏢",
    message: "Meeting cancelled, come home",
  },
  {
    label: "Cab",
    icon: "🚗",
    message: "Cab is waiting, come down",
  },
];

const CALL_TYPES = [
  { label: "Voice Call Only", value: "voice" },
  { label: "Voice + SMS", value: "voice_sms" },
  { label: "SMS Fallback", value: "sms" },
];

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const getLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export default function AIVoiceClone() {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const timerRef = useRef(null);

  // Voice clone state
  const [voiceCloned, setVoiceCloned] = useState(getLS("voiceClonedStatus", false));
  const [isCloning, setIsCloning] = useState(false);

  // Call scheduling state
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    phone: "",
    time: "",
    date: "",
    scenario: "",
    message: "",
    callType: "voice",
  });
  const [scheduledCalls, setScheduledCalls] = useState(getLS("scheduledCalls", []));
  const [callLogs, setCallLogs] = useState(getLS("callLogs", []));
  const [totalCalls, setTotalCalls] = useState(getLS("totalCallsCount", 0));
  const [successCalls, setSuccessCalls] = useState(getLS("successCallsCount", 0));

  // Recording logic
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t + 1 >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [isRecording]);

  useEffect(() => {
    setLS("voiceClonedStatus", voiceCloned);
  }, [voiceCloned]);
  useEffect(() => {
    setLS("scheduledCalls", scheduledCalls);
  }, [scheduledCalls]);
  useEffect(() => {
    setLS("callLogs", callLogs);
  }, [callLogs]);
  useEffect(() => {
    setLS("totalCallsCount", totalCalls);
  }, [totalCalls]);
  useEffect(() => {
    setLS("successCallsCount", successCalls);
  }, [successCalls]);

  function startRecording() {
    if (isRecording) return;
    if (!navigator.mediaDevices) {
      toast.error("Microphone not supported");
      return;
    }
    setRecordingChunks([]);
    setRecordingTime(0);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mr = new window.MediaRecorder(stream);
        setMediaRecorder(mr);
        mr.start();
        setIsRecording(true);
        mr.ondataavailable = (e) => {
          setRecordingChunks((prev) => [...prev, e.data]);
        };
        mr.onstop = () => {
          const blob = new Blob(recordingChunks, { type: "audio/webm" });
          setRecordedAudio(blob);
          setAudioUrl(URL.createObjectURL(blob));
          setIsRecording(false);
        };
      })
      .catch(() => {
        toast.error("Microphone access denied");
      });
  }

  function stopRecording() {
    if (!isRecording || !mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
  }

  function playRecording() {
    if (!audioUrl) return toast.error("No recording available");
    const audio = new Audio(audioUrl);
    audio.play();
  }

  function cloneVoice() {
    if (!recordedAudio) {
      toast.error("Record your voice first");
      return;
    }
    setIsCloning(true);
    setTimeout(() => {
      setVoiceCloned(true);
      setIsCloning(false);
      toast.success("Voice cloned successfully!");
    }, 2000);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setScheduleForm((f) => ({ ...f, [name]: value }));
  }

  function scheduleCall(e) {
    e.preventDefault();
    const { name, phone, time, date, message, callType } = scheduleForm;
    if (!name || !phone || !time || !date || !message) {
      toast.error("Fill all fields");
      return;
    }
    const call = {
      id: Date.now(),
      name,
      phone,
      time,
      date,
      message,
      callType,
      status: "Pending",
      scenario: scheduleForm.scenario,
    };
    setScheduledCalls((calls) => [...calls, call]);
    toast.success("Call scheduled");
    setScheduleForm({
      name: "",
      phone: "",
      time: "",
      date: "",
      scenario: "",
      message: "",
      callType: "voice",
    });
  }

  function testCallNow(scenario, recipientName) {
    if (!voiceCloned) {
      toast.error("Clone your voice first");
      return;
    }
    const isSuccess = Math.random() > 0.2;
    setCallLogs((logs) => [
      {
        id: Date.now(),
        time: formatTime(new Date().getHours() * 60 + new Date().getMinutes()),
        name: recipientName,
        message: scenario,
        status: isSuccess ? "Success" : "Failed",
        duration: isSuccess ? `${Math.floor(Math.random() * 3) + 1} min` : "SMS sent",
      },
      ...logs.slice(0, 4),
    ]);
    setTotalCalls((c) => c + 1);
    if (isSuccess) setSuccessCalls((c) => c + 1);
    toast[isSuccess ? "success" : "error"](
      isSuccess ? "Call connected" : "Call failed, SMS sent"
    );
  }

  function executeScheduledCall(call) {
    if (!voiceCloned) {
      toast.error("Clone your voice first");
      return;
    }
    const isSuccess = Math.random() > 0.2;
    setCallLogs((logs) => [
      {
        id: Date.now(),
        time: call.time,
        name: call.name,
        message: call.message,
        status: isSuccess ? "Success" : "Failed",
        duration: isSuccess ? `${Math.floor(Math.random() * 3) + 1} min` : "SMS sent",
      },
      ...logs.slice(0, 4),
    ]);
    setTotalCalls((c) => c + 1);
    if (isSuccess) setSuccessCalls((c) => c + 1);
    setScheduledCalls((calls) =>
      calls.map((c) =>
        c.id === call.id ? { ...c, status: isSuccess ? "Sent" : "Failed" } : c
      )
    );
    toast[isSuccess ? "success" : "error"](
      isSuccess ? "Call sent" : "Call failed, SMS sent"
    );
  }

  function cancelScheduledCall(id) {
    setScheduledCalls((calls) => calls.filter((c) => c.id !== id));
    toast.success("Call deleted");
  }

  function quickScenarioCall(idx) {
    const sc = SCENARIOS[idx];
    testCallNow(sc.message, sc.label);
  }

  function clearLogs() {
    setCallLogs([]);
    toast.success("Logs cleared");
  }

  function refreshLogs() {
    toast.success("Logs refreshed");
  }

  // Dashboard calculations
  const failedCalls = totalCalls - successCalls;
  const successRate = totalCalls ? Math.round((successCalls / totalCalls) * 100) : 0;

  // UI
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#7c56c2] flex items-center gap-2">
        <MicrophoneIcon className="w-7 h-7 text-[#7c56c2]" /> AI Voice Clone System
      </h1>
      <p className="mb-6 text-gray-600">Your Voice → Your Safety → Your Escape</p>

      {/* Step 1: Record Voice */}
      <section className="mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-lg mb-2">STEP 1: RECORD YOUR VOICE</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-xs bg-gray-100 rounded-xl p-4 flex flex-col items-center">
              <div className="text-4xl mb-2">🎙️</div>
              <div className="mb-2 text-lg font-mono">
                ⏱️ {formatTime(recordingTime)} / 05:00
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div
                  className="h-2 bg-gradient-to-r from-[#7c56c2] to-[#ff556c] rounded-full transition-all"
                  style={{ width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%` }}
                ></div>
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-[#7c56c2] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#6a47b8] focus:ring-2 focus:ring-[#7c56c2]"
                  onClick={startRecording}
                  disabled={isRecording || recordingTime >= MAX_RECORDING_TIME}
                >
                  <PlayIcon className="w-5 h-5" /> Start
                </button>
                <button
                  className="bg-[#fdb022] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#e09e1a] focus:ring-2 focus:ring-[#fdb022]"
                  onClick={stopRecording}
                  disabled={!isRecording}
                >
                  <PauseIcon className="w-5 h-5" /> Stop
                </button>
                <button
                  className="bg-[#56bc56] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#4aa44a] focus:ring-2 focus:ring-[#56bc56]"
                  onClick={playRecording}
                  disabled={!audioUrl}
                >
                  <PlayIcon className="w-5 h-5" /> Play
                </button>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">💡 Tip: Speak naturally for 5 minutes in a quiet place</div>
          </div>
        </div>
      </section>

      {/* Step 2: Clone Voice */}
      <section className="mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-lg mb-2">STEP 2: CLONE YOUR VOICE</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-xs bg-gray-100 rounded-xl p-4 flex flex-col items-center">
              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-white text-lg mb-2 ${voiceCloned ? "bg-[#56bc56]" : isCloning ? "bg-[#fdb022] animate-pulse" : "bg-[#7c56c2] hover:bg-[#6a47b8]"}`}
                onClick={cloneVoice}
                disabled={isCloning || !recordedAudio || voiceCloned}
              >
                {isCloning ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : voiceCloned ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <MicrophoneIcon className="w-5 h-5" />
                )}
                {isCloning ? "Cloning..." : voiceCloned ? "Voice Cloned" : "Clone My Voice"}
              </button>
              <div className="flex flex-col items-center mt-2">
                <div className="text-sm text-gray-700">⏳ Status: {isCloning ? "Cloning..." : voiceCloned ? "Cloned" : "Ready to Clone"}</div>
                <div className="text-sm flex items-center gap-1 mt-1">
                  {voiceCloned ? (
                    <CheckCircleIcon className="w-4 h-4 text-[#56bc56]" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-[#ff556c]" />
                  )}
                  Voice Cloned: {voiceCloned ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Schedule Calls */}
      <section className="mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-lg mb-2">STEP 3: SCHEDULE EMERGENCY CALLS</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={scheduleCall}>
          <div className="flex flex-col gap-2">
            <label className="font-semibold flex items-center gap-1"><UserIcon className="w-4 h-4" /> Name</label>
            <input
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#7c56c2]"
              name="name"
              value={scheduleForm.name}
              onChange={handleFormChange}
              placeholder="Enter person name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold flex items-center gap-1"><PhoneIcon className="w-4 h-4" /> Phone Number</label>
            <input
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#7c56c2]"
              name="phone"
              value={scheduleForm.phone}
              onChange={handleFormChange}
              placeholder="Enter 10-digit number"
              pattern="[0-9]{10}"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold flex items-center gap-1"><ClockIcon className="w-4 h-4" /> Time</label>
            <input
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#7c56c2]"
              name="time"
              value={scheduleForm.time}
              onChange={handleFormChange}
              type="time"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> Date</label>
            <input
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#7c56c2]"
              name="date"
              value={scheduleForm.date}
              onChange={handleFormChange}
              type="date"
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="font-semibold flex items-center gap-1"><DocumentTextIcon className="w-4 h-4" /> Select Scenario</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              {SCENARIOS.slice(0, 4).map((sc, idx) => (
                <button
                  key={sc.label}
                  type="button"
                  className={`rounded-xl px-2 py-2 font-semibold flex flex-col items-center border shadow-sm focus:ring-2 focus:ring-[#7c56c2] ${scheduleForm.scenario === sc.label ? "bg-[#7c56c2] text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setScheduleForm((f) => ({ ...f, scenario: sc.label, message: sc.message }))}
                >
                  <span className="text-xl">{sc.icon}</span>
                  <span>{sc.label}</span>
                </button>
              ))}
            </div>
            <textarea
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#7c56c2]"
              name="message"
              value={scheduleForm.message}
              onChange={handleFormChange}
              placeholder="Message (What AI will say in YOUR voice)"
              rows={2}
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="font-semibold">Call Type</label>
            <div className="flex gap-4">
              {CALL_TYPES.map((ct) => (
                <label key={ct.value} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="callType"
                    value={ct.value}
                    checked={scheduleForm.callType === ct.value}
                    onChange={handleFormChange}
                  />
                  {ct.label}
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex gap-4 mt-2">
            <button
              type="submit"
              className="bg-[#7c56c2] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#6a47b8] focus:ring-2 focus:ring-[#7c56c2]"
            >
              💾 Save Call
            </button>
            <button
              type="button"
              className="bg-[#56bc56] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#4aa44a] focus:ring-2 focus:ring-[#56bc56]"
              onClick={() => testCallNow(scheduleForm.message, scheduleForm.name || "Test")}
              disabled={!voiceCloned}
            >
              📞 Test Now
            </button>
          </div>
        </form>
      </section>

      {/* Quick Escape Scenarios */}
      <section className="mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-lg mb-2">QUICK ESCAPE SCENARIOS (Ready to Use)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={sc.label}
              className="rounded-xl px-2 py-3 font-semibold flex flex-col items-center border shadow-sm bg-gray-100 hover:bg-[#fdb022] focus:ring-2 focus:ring-[#7c56c2]"
              onClick={() => quickScenarioCall(idx)}
              disabled={!voiceCloned}
            >
              <span className="text-xl mb-1">{sc.icon}</span>
              <span>{sc.label}</span>
              <span className="text-xs text-gray-500 mt-1 text-center">{sc.message}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Scheduled Calls & Call Logs */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled Calls */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="font-semibold text-lg mb-2">⏰ UPCOMING SCHEDULED CALLS</h2>
          {scheduledCalls.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No calls scheduled yet</div>
          ) : (
            <div className="divide-y">
              {scheduledCalls.map((call) => (
                <div key={call.id} className="flex items-center gap-2 py-2">
                  <span className="text-sm font-mono w-20">🕐 {call.time}</span>
                  <span className="font-semibold w-20">{call.name}</span>
                  <span className="flex-1 text-xs text-gray-600 truncate">"{call.message}"</span>
                  <span className={`text-xs font-semibold ${call.status === "Sent" ? "text-[#56bc56]" : call.status === "Failed" ? "text-[#ff556c]" : "text-[#fdb022]"}`}>
                    {call.status === "Sent" ? "✅ Sent" : call.status === "Failed" ? "❌ Failed" : "⏳ Pending"}
                  </span>
                  <button
                    className="ml-2 text-[#7c56c2] hover:text-[#ff556c]"
                    onClick={() => executeScheduledCall(call)}
                    title="Execute Now"
                  >
                    <PlayIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="ml-1 text-[#ff556c] hover:text-[#7c56c2]"
                    onClick={() => cancelScheduledCall(call.id)}
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Call Logs */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="font-semibold text-lg mb-2">📞 RECENT CALL LOGS</h2>
          {callLogs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No call logs yet</div>
          ) : (
            <div className="divide-y">
              {callLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-2 py-2">
                  <span className="w-6">{log.status === "Success" ? <CheckCircleIcon className="w-5 h-5 text-[#56bc56]" /> : <XCircleIcon className="w-5 h-5 text-[#ff556c]" />}</span>
                  <span className="text-sm font-mono w-20">{log.time}</span>
                  <span className="font-semibold w-20">{log.name}</span>
                  <span className="flex-1 text-xs text-gray-600 truncate">"{log.message}"</span>
                  <span className="text-xs text-gray-500 w-16">{log.duration}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              className="bg-[#7c56c2] text-white px-3 py-1 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#6a47b8] focus:ring-2 focus:ring-[#7c56c2]"
              onClick={refreshLogs}
            >
              <ArrowPathIcon className="w-4 h-4" /> Refresh
            </button>
            <button
              className="bg-[#ff556c] text-white px-3 py-1 rounded-xl font-semibold flex items-center gap-1 shadow-sm hover:bg-[#d13a4a] focus:ring-2 focus:ring-[#ff556c]"
              onClick={clearLogs}
            >
              <TrashIcon className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-lg mb-2">📊 VOICE CLONE DASHBOARD</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <MicrophoneIcon className="w-7 h-7 text-[#7c56c2] mb-1" />
            <div className="font-bold">VOICE CLONED</div>
            <div className="text-lg mt-1">{voiceCloned ? <span className="text-[#56bc56]">✅ YES</span> : <span className="text-[#ff556c]">❌ NO</span>}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <PhoneIcon className="w-7 h-7 text-[#7c56c2] mb-1" />
            <div className="font-bold">TOTAL CALLS</div>
            <div className="text-lg mt-1">{totalCalls}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <CheckCircleIcon className="w-7 h-7 text-[#56bc56] mb-1" />
            <div className="font-bold">SUCCESS CALLS</div>
            <div className="text-lg mt-1">{successCalls}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <XCircleIcon className="w-7 h-7 text-[#ff556c] mb-1" />
            <div className="font-bold">FAILED CALLS</div>
            <div className="text-lg mt-1">{failedCalls}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">🎯 SUCCESS RATE</div>
          <div className="w-full h-4 bg-gray-200 rounded-full relative">
            <div
              className="h-4 bg-gradient-to-r from-[#56bc56] to-[#7c56c2] rounded-full transition-all"
              style={{ width: `${successRate}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-[#7c56c2]">
              {successRate}%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
