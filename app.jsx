// src/app.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuthStore } from './store/authstores';
import { useSakshiEyeStore } from './store/sakshieyestore';
import { isInitialized } from './config/firebases';
import { Toaster } from 'react-hot-toast';

// Import pages - Fixed all paths
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Logout from './pages/auth/logout';
import ForgotPassword from './pages/auth/forgetpassword';
import MainDashboard from './pages/dashboard/MainDashboard';

// AI Pages - Fixed typo
import AIFakeCall from './pages/ai/aifakecall';
import AIThreatDetections from './pages/ai/aithreatdetections';
import AIVoiceClone from './pages/ai/VoiceClone';
import AICrimePredictions from './pages/ai/aicrimepredictions';
import FaceRecgonizations from './pages/ai/facerecgonizations';
import SakhiEye from './pages/ai/SakhiEye';
import SakhiEyeDetails from './pages/ai/SakhiEyeDetails';

// Benifits - Fixed folder name to 'benifits'
import BenifitsHub from './pages/benifits/benifitshub';
import Schemes from './pages/benifits/schemes';
import Scholarship from './pages/benifits/scholarship';

// Community
import CommunityHub from './pages/community/communityhub';
import CommunityModerations from './pages/community/communitymoderations';
import Forum from './pages/community/forum';
import SocialFeed from './pages/community/socialfeed';

// Cyber - Fixed typo
import CyberCrimePortal from './pages/cyber/cybercrimeportal';
import FileComplaints from './pages/cyber/filecomplaints'; // Fixed from filecomplients

// Devices
import SpyCameraDetection from './pages/devices/spycameradetection';
import WearableDevices from './pages/devices/wearableDevices'; // Fixed case

// Education - Fixed typo
import DigitalLiteracy from './pages/educations/digitalliteracy';
import SafetyEducations from './pages/educations/safetyeducations';
import SelfDefense from './pages/educations/selfdefense'; // Fixed from selfdefence

// Emergency
import EmergencyHub from './pages/emergency/emergencyhub';
import SilentEmergency from './pages/emergency/silentemergency';
import SosPages from './pages/emergency/sospages';

// Evidence
import EvidenceManage from './pages/evidence/evidencemanage';

// Legal
import LegalAid from './pages/legal/legalaid';
import LegalHub from './pages/legal/legalhub';
import Lokadalat from './pages/legal/lokadalat';
import WomenRights from './pages/legal/womenrights';

// Media - Fixed typo
import AIMisuseDetection from './pages/media/aimissusedetections'; // Fixed from aimissusedetections
import CameraPage from './pages/media/camera';
import Gallery from './pages/media/gallery';
import MediaHub from './pages/media/mediahub';

// NGO
import NGOsFinder from './pages/ngo/ngofinder';

// Records
import Documents from './pages/records/documents';
import EvidenceManagers from './pages/records/evidencemanagers';
import MyRecordsHub from './pages/records/myrecordshub';
import NewComplaint from './pages/records/newcomplaint';
import MyReports from './pages/records/myreports';
import Reports from './pages/records/reports';
import VoiceFIR from './pages/records/VoiceFIR';

// Safety
import HotelSafety from './pages/safety/hotelsafety';
import JoinFamily from './pages/safety/joinfamily';
import LiveTrackings from './pages/safety/livetrackings';
import LocationsHistory from './pages/safety/locationshistory';
import SafetyNavigations from './pages/safety/safetynavigations';
import ShareLocations from './pages/safety/sharelocations';
import TransportSafety from './pages/safety/transportsafety';

// Settings
import Profile from './pages/settings/profile';
import SettingsPage from './pages/settings/settings';

// Smart
import SmartSafety from './pages/smart/smartsafety';

// UPI
import FraudDetections from './pages/upi/frauddetections';
import UPISafety from './pages/upi/upisafety';

// Voice
import VoiceHub from './pages/voice/voicehub';
import SchedulesHub from './pages/voice/SchedulesHub';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './layouts/mainlayouts';

function App() {
  const { initAuthListener, isLoading, isAuthenticated, setLoading } = useAuthStore();
  const { detectionCount, capturedFaces } = useSakshiEyeStore();

  useEffect(() => {
    // Connect to Sakhi Eye Real-time Server
    const socket = io('http://localhost:5000');
    
    socket.on('detectionUpdate', (data) => {
      // Update global state with real-time AI detections
      useSakshiEyeStore.setState({
        detectionCount: data.todayDetections,
        lastDetectionTime: new Date().toLocaleTimeString(),
        // Mocking face data since we don't have images from simulator yet
        capturedFaces: Array(data.facesCaptured).fill({ timestamp: new Date() })
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    // Initialize auth listener for our custom backend
    const unsubscribe = initAuthListener();
    
    // Fallback to stop loading if something goes wrong
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
        <style>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/join-family" element={<JoinFamily />} />

        {/* Protected Portal Routes with MainLayout */}
        <Route element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route path="/dashboard" element={<MainDashboard />} />

          {/* Emergency Routes */}
          <Route path="/sos" element={<SosPages />} />
          <Route path="/emergency-hub" element={<EmergencyHub />} />
          <Route path="/silent-emergency" element={<SilentEmergency />} />

          {/* Legal Routes */}
          <Route path="/legal-hub" element={<LegalHub />} />
          <Route path="/legal-aid" element={<LegalAid />} />
          <Route path="/lokadalat" element={<Lokadalat />} />
          <Route path="/women-rights" element={<WomenRights />} />

          {/* AI Routes */}
          <Route path="/ai-fake-call" element={<AIFakeCall />} />
          <Route path="/ai-threat" element={<AIThreatDetections />} />
          <Route path="/ai-voice-clone" element={<AIVoiceClone />} />
          <Route path="/crime-prediction" element={<AICrimePredictions />} />
          <Route path="/face-recognition" element={<FaceRecgonizations />} />
          <Route path="/sakhi-eye" element={<SakhiEye />} />
          <Route path="/sakhi-eye-details" element={<SakhiEyeDetails />} />

          {/* Safety Navigation Routes */}
          <Route path="/safety-navigation" element={<SafetyNavigations />} />
          <Route path="/live-tracking" element={<LiveTrackings />} />
          <Route path="/share-location" element={<ShareLocations />} />
          <Route path="/transport-safety" element={<TransportSafety />} />
          <Route path="/hotel-safety" element={<HotelSafety />} />

          {/* Media & Community Routes */}
          <Route path="/media-hub" element={<MediaHub />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/community/moderations" element={<CommunityModerations />} />
          <Route path="/community/forum" element={<Forum />} />
          <Route path="/community/social-feed" element={<SocialFeed />} />

          {/* Benefits Routes */}
          <Route path="/benifits" element={<BenifitsHub />} />
          <Route path="/benifits/schemes" element={<Schemes />} />
          <Route path="/benifits/scholarship" element={<Scholarship />} />

          {/* Education Routes */}
          <Route path="/safety-education" element={<SafetyEducations />} />
          <Route path="/digital-literacy" element={<DigitalLiteracy />} />
          <Route path="/self-defense" element={<SelfDefense />} />

          {/* Devices Routes */}
          <Route path="/wearable" element={<WearableDevices />} />
          <Route path="/spy-camera" element={<SpyCameraDetection />} />

          {/* Records Routes */}
          <Route path="/records" element={<MyRecordsHub />} />
          <Route path="/my-records" element={<MyRecordsHub />} />
          <Route path="/records/new-complaint" element={<NewComplaint />} />
          <Route path="/records/voice-fir" element={<VoiceFIR />} />
          <Route path="/records/case/:id" element={<MyRecordsHub />} />
          <Route path="/records/complaint/:id" element={<MyRecordsHub />} />
          <Route path="/records/upload-document" element={<Documents />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/evidence-manage" element={<EvidenceManage />} />
          <Route path="/evidence-managers" element={<EvidenceManagers />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/reports" element={<Reports />} />

          {/* Cyber & Other Routes */}
          <Route path="/cyber-crime" element={<CyberCrimePortal />} />
          <Route path="/cyber/file-complaints" element={<FileComplaints />} />
          <Route path="/ngo-finder" element={<NGOsFinder />} />
          <Route path="/voice-hub" element={<VoiceHub />} />
          <Route path="/schedules" element={<SchedulesHub />} />
          <Route path="/smart-safety" element={<SmartSafety />} />

          {/* Settings Routes */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/location-history" element={<LocationsHistory />} />

          {/* UPI Routes */}
          <Route path="/upi-safety" element={<UPISafety />} />
          <Route path="/fraud-detections" element={<FraudDetections />} />

          {/* Media Routes */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/ai-misuse-detections" element={<AIMisuseDetection />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;

