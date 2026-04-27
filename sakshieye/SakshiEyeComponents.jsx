import React from 'react';
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  MicrophoneIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

// 1. AI Auto Detection Toggle Section (for Silent Emergency)
export const SakshiEyeAutoDetection = ({ enabled, onToggle, detections }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl shadow-lg p-6 md:p-8 border border-purple-400">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <EyeIcon className="w-8 h-8 text-white" />
          <div>
            <h3 className="text-2xl font-bold text-white">🤖 SAKHI EYE AI AUTO DETECTION</h3>
            <p className="text-purple-100 text-sm mt-1">Auto-detect danger without user action</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${
            enabled
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {enabled ? '✅ ON' : '❌ OFF'}
        </button>
      </div>

      {enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <MicrophoneIcon className="w-5 h-5 text-white" />
              <span className="font-bold text-white">Scream Detection</span>
            </div>
            <p className="text-sm text-purple-100">Detects loud screams/cries</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-green-400"></div>
              </div>
              <span className="text-xs text-green-300 font-bold">75%</span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
              <span className="font-bold text-white">Struggle Detection</span>
            </div>
            <p className="text-sm text-purple-100">Detects fight/struggle motions</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-green-400"></div>
              </div>
              <span className="text-xs text-green-300 font-bold">80%</span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              <span className="font-bold text-white">Following Detection</span>
            </div>
            <p className="text-sm text-purple-100">Detects if being followed</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-yellow-400"></div>
              </div>
              <span className="text-xs text-yellow-300 font-bold">60%</span>
            </div>
          </div>
        </div>
      )}

      {enabled && detections && (
        <div className="mt-6 bg-black/30 rounded-xl p-4 border border-white/20">
          <p className="text-sm text-purple-100">
            <strong>Status:</strong> <span className="text-green-300">🟢 MONITORING 24/7</span>
          </p>
          <p className="text-sm text-purple-100 mt-1">
            <strong>Today's Detections:</strong> {detections || 0}
          </p>
        </div>
      )}
    </div>
  );
};

// 2. SAKHI EYE Live Witness Card (for AI Threat Detection)
export const SakshiEyeLiveWitness = ({ threatLevel, facesCount, recordingsCount, isMonitoring }) => {
  const getThreatColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'from-red-600 to-red-700';
      case 'HIGH': return 'from-orange-600 to-orange-700';
      case 'MEDIUM': return 'from-yellow-600 to-yellow-700';
      default: return 'from-green-600 to-green-700';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getThreatColor(threatLevel)} rounded-3xl shadow-lg p-6 md:p-8 border border-white/20`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <EyeIcon className="w-8 h-8 text-white" />
          <div>
            <h3 className="text-2xl font-bold text-white">👁️ SAKHI EYE - LIVE WITNESS</h3>
            <p className="text-white/80 text-sm mt-1">AI Auto Surveillance System</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-white ${
          isMonitoring ? 'bg-green-500' : 'bg-gray-500'
        }`}>
          {isMonitoring ? '🟢 ACTIVE' : '⚫ INACTIVE'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 text-center">
          <div className="text-3xl font-black text-white">{threatLevel}</div>
          <p className="text-xs text-white/80 mt-2 font-bold uppercase">Threat Level</p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 text-center">
          <div className="text-3xl font-black text-white">{facesCount || 0}</div>
          <p className="text-xs text-white/80 mt-2 font-bold uppercase">Faces Captured</p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 text-center">
          <div className="text-3xl font-black text-white">{recordingsCount || 0}</div>
          <p className="text-xs text-white/80 mt-2 font-bold uppercase">Auto Recordings</p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 text-center">
          <div className="text-3xl font-black text-white">☁️</div>
          <p className="text-xs text-white/80 mt-2 font-bold uppercase">Cloud Safe</p>
        </div>
      </div>

      <div className="mt-6 bg-black/30 rounded-xl p-4 border border-white/20">
        <p className="text-sm text-white font-semibold">
          System continuously monitors for threats and automatically captures evidence
        </p>
      </div>
    </div>
  );
};

// 3. SAKHI EYE Evidence Folder Card (for Media Hub)
export const SakshiEyeEvidenceFolder = ({ facesCount, recordingsCount, reportsCount }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl shadow-lg p-6 md:p-8 border-2 border-purple-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="text-5xl">📁</div>
        <div>
          <h3 className="text-2xl font-bold text-purple-900">SAKHI EYE EVIDENCE</h3>
          <p className="text-purple-700 text-sm mt-1">🔒 Cloud Synced - Cannot Delete</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-xl p-4 border border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CameraIcon className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-bold text-gray-800">Auto Captured Faces</p>
              <p className="text-sm text-gray-600">Attacker identification</p>
            </div>
          </div>
          <div className="text-3xl font-black text-purple-600">{facesCount || 0}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MicrophoneIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-bold text-gray-800">Auto Recordings</p>
              <p className="text-sm text-gray-600">Voice & sound evidence</p>
            </div>
          </div>
          <div className="text-3xl font-black text-blue-600">{recordingsCount || 0}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-bold text-gray-800">Incident Reports</p>
              <p className="text-sm text-gray-600">Auto-generated logs</p>
            </div>
          </div>
          <div className="text-3xl font-black text-orange-600">{reportsCount || 0}</div>
        </div>
      </div>

      <div className="mt-6 bg-red-50 border border-red-300 rounded-xl p-4">
        <p className="text-sm text-red-800 font-semibold">
          ⚠️ This folder is protected and automatically synced to secure cloud storage
        </p>
      </div>
    </div>
  );
};

// 4. SAKHI EYE Settings Control (for Settings page)
export const SakshiEyeSettingsPanel = ({ settings, onToggle, onSensitivityChange }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <EyeIcon className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">👁️ SAKHI EYE SETTINGS</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="font-bold text-gray-800">Enable AI Auto Detection</p>
            <p className="text-sm text-gray-600">24/7 threat monitoring</p>
          </div>
          <button
            onClick={() => onToggle('isEnabled')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              settings.isEnabled ? 'translate-x-6' : ''
            }`}></span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="font-bold text-gray-800">Auto Face Capture</p>
            <p className="text-sm text-gray-600">Capture attacker photos</p>
          </div>
          <button
            onClick={() => onToggle('autoFaceCapture')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.autoFaceCapture ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              settings.autoFaceCapture ? 'translate-x-6' : ''
            }`}></span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="font-bold text-gray-800">Cloud Evidence Backup</p>
            <p className="text-sm text-gray-600">Auto-sync to secure cloud</p>
          </div>
          <button
            onClick={() => onToggle('cloudBackup')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.cloudBackup ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              settings.cloudBackup ? 'translate-x-6' : ''
            }`}></span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="font-bold text-gray-800">Predictive Alerts</p>
            <p className="text-sm text-gray-600">AI predicts danger before it happens</p>
          </div>
          <button
            onClick={() => onToggle('predictiveAlerts')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.predictiveAlerts ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              settings.predictiveAlerts ? 'translate-x-6' : ''
            }`}></span>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Detection Sensitivity: {Math.round(settings.sensitivity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(settings.sensitivity * 100)}
            onChange={(e) => onSensitivityChange(e.target.value / 100)}
            className="w-full h-3 bg-gradient-to-r from-yellow-400 to-red-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>LOW (More False Negatives)</span>
            <span>HIGH (More False Positives)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';

// 5. SAKHI EYE Status Card (for Dashboard)
export const SakshiEyeStatusCard = ({ isActive, detectionCount, facesCount, lastDetection }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl shadow-lg p-6 border border-purple-400 relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <EyeIcon className="w-8 h-8 text-white animate-pulse" />
          <div>
            <h3 className="text-xl font-bold text-white">👁️ SAKHI EYE - ACTIVE</h3>
            <p className="text-purple-100 text-xs">AI Safety Witness</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
          isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          <div className={`w-2 h-2 rounded-full bg-white ${isActive ? 'animate-ping' : ''}`}></div>
          {isActive ? 'ON' : 'OFF'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white/20 backdrop-blur rounded-xl p-3 border border-white/30 flex justify-between items-center">
          <div>
            <p className="text-sm text-purple-100">24/7 AI Monitoring</p>
            <p className="text-2xl font-black text-white mt-1">ENABLED</p>
          </div>
          {lastDetection && (
            <div className="text-right">
              <p className="text-[10px] text-purple-200 uppercase">Last Detect</p>
              <p className="text-xs font-mono text-white">{lastDetection}</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 border border-white/30 text-center">
            <p className="text-xs text-purple-100">Today Detections</p>
            <p className="text-xl font-black text-white">{detectionCount || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 border border-white/30 text-center">
            <p className="text-xs text-purple-100">Faces Captured</p>
            <p className="text-xl font-black text-white">{facesCount || 0}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/sakhi-eye-details')}
        className="w-full mt-4 bg-white text-purple-700 py-2 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg active:scale-95"
      >
        VIEW DETAILS →
      </button>
    </div>
  );
};

// 6. AI Auto Witness Card (for Emergency Hub)
export const AiAutoWitnessCard = ({ isMonitoring, cameraActive, micActive, lastDetection }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl shadow-lg p-6 md:p-8 border border-indigo-400">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <EyeIcon className="w-8 h-8 text-white" />
          <div>
            <h3 className="text-2xl font-bold text-white">👁️ AI AUTO WITNESS</h3>
            <p className="text-indigo-100 text-sm mt-1">Always Recording for Your Safety</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-white ${
          isMonitoring ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isMonitoring ? '🟢 MONITORING' : '⚫ PAUSED'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`rounded-xl p-4 border-2 flex items-center gap-3 ${
          cameraActive ? 'bg-white/20 border-green-400' : 'bg-white/10 border-gray-400'
        }`}>
          <CameraIcon className={`w-6 h-6 ${cameraActive ? 'text-green-300' : 'text-gray-300'}`} />
          <div>
            <p className="text-white font-bold">Camera</p>
            <p className={`text-sm ${cameraActive ? 'text-green-300' : 'text-gray-300'}`}>
              {cameraActive ? 'Recording' : 'Standby'}
            </p>
          </div>
        </div>

        <div className={`rounded-xl p-4 border-2 flex items-center gap-3 ${
          micActive ? 'bg-white/20 border-green-400' : 'bg-white/10 border-gray-400'
        }`}>
          <MicrophoneIcon className={`w-6 h-6 ${micActive ? 'text-green-300' : 'text-gray-300'}`} />
          <div>
            <p className="text-white font-bold">Microphone</p>
            <p className={`text-sm ${micActive ? 'text-green-300' : 'text-gray-300'}`}>
              {micActive ? 'Recording' : 'Standby'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-4 border border-white/20 mb-6">
        <p className="text-sm text-indigo-100">
          <strong>Last Detection:</strong> {lastDetection ? `${lastDetection} ago` : 'None'}
        </p>
      </div>

      <button className="w-full bg-white text-indigo-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
        🧪 TEST DETECTION
      </button>
    </div>
  );
};
