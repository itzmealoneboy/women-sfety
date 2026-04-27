import { create } from 'zustand';

export const useSakshiEyeStore = create((set) => ({
  // SAKHI EYE Global State
  isEnabled: true,
  isMonitoring: false,
  screams: [],
  struggles: [],
  following: [],
  capturedFaces: [],
  autoRecordings: [],
  threatLevel: 'LOW', // LOW, MEDIUM, HIGH, CRITICAL
  lastDetectionTime: null,
  detectionCount: 0,
  sensitivity: 0.7, // 0 to 1
  autoFaceCapture: true,
  autoRecording: true,
  cloudBackup: true,
  predictiveAlerts: true,

  // Actions
  toggleEnable: () => set(state => ({ isEnabled: !state.isEnabled })),
  startMonitoring: () => set({ isMonitoring: true, lastDetectionTime: new Date() }),
  stopMonitoring: () => set({ isMonitoring: false }),
  
  setSensitivity: (sensitivity) => set({ sensitivity }),
  
  addDetection: (type, data) => set(state => {
    let newState = { ...state };
    
    if (type === 'scream') {
      newState.screams = [...state.screams, { id: Date.now(), data, timestamp: new Date() }];
    } else if (type === 'struggle') {
      newState.struggles = [...state.struggles, { id: Date.now(), data, timestamp: new Date() }];
    } else if (type === 'following') {
      newState.following = [...state.following, { id: Date.now(), data, timestamp: new Date() }];
    }
    
    newState.detectionCount = state.detectionCount + 1;
    newState.lastDetectionTime = new Date();
    newState.threatLevel = calculateThreatLevel(newState.detectionCount);
    
    return newState;
  }),
  
  addFaceCapture: (face) => set(state => ({
    capturedFaces: [...state.capturedFaces, { id: Date.now(), face, timestamp: new Date() }]
  })),
  
  addRecording: (recording) => set(state => ({
    autoRecordings: [...state.autoRecordings, { id: Date.now(), recording, timestamp: new Date() }]
  })),
  
  updateThreatLevel: (level) => set({ threatLevel: level }),
  
  clearAllData: () => set({
    screams: [],
    struggles: [],
    following: [],
    capturedFaces: [],
    autoRecordings: [],
    detectionCount: 0,
    threatLevel: 'LOW',
    lastDetectionTime: null
  })
}));

// Helper function to calculate threat level
const calculateThreatLevel = (detectionCount) => {
  if (detectionCount === 0) return 'LOW';
  if (detectionCount < 3) return 'MEDIUM';
  if (detectionCount < 7) return 'HIGH';
  return 'CRITICAL';
};
