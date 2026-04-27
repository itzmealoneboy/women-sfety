export const APP_NAME = 'SAKHI - Women Safety & Justice'
export const APP_VERSION = '1.0.0'

export const EMERGENCY_NUMBERS = {
  police: '100',
  ambulance: '108',
  women: '1091',
  fire: '101',
  cyber: '1930',
  child: '1098',
  legal: '15100',
  national: '112',
  disaster: '108',
  railway: '139',
  tourist: '1363'
}

export const SOS_TIMER_DURATION = 10 // seconds
export const AUTO_CHECKIN_INTERVAL = 15 * 60 // 15 minutes
export const MAX_RECORDING_DURATION = 300 // 5 minutes
export const LOCATION_UPDATE_INTERVAL = 5000 // 5 seconds

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
]

export const RIGHTS_CATEGORIES = {
  constitutional: '📜 Constitutional Rights',
  criminal: '⚖️ Criminal Laws',
  workplace: '💼 Workplace Rights',
  property: '🏠 Property Rights',
  marriage: '💒 Marriage Rights',
  cyber: '💻 Cyber Laws',
  health: '🏥 Health Rights',
  education: '📚 Education Rights',
  international: '🌍 International Laws'
}

export const FRAUD_KEYWORDS = [
  'kyc', 'refund', 'urgent', 'lottery', 'verify', 
  'update', 'otp', 'free', 'blocked', 'prize',
  'winner', 'claim', 'limited', 'offer', 'bank',
  'account', 'suspended', 'click', 'link', 'password'
]

export const SAFETY_ZONE_TYPES = [
  { id: 'police', name: 'Police Station', icon: 'fa-building-shield', color: '#ff4757' },
  { id: 'hospital', name: 'Hospital', icon: 'fa-hospital', color: '#4CAF50' },
  { id: 'atm', name: 'ATM', icon: 'fa-credit-card', color: '#f39c12' },
  { id: 'pharmacy', name: 'Pharmacy', icon: 'fa-prescription', color: '#3498db' },
  { id: 'shelter', name: 'Women Shelter', icon: 'fa-home', color: '#9b59b6' },
  { id: 'metro', name: 'Metro Station', icon: 'fa-subway', color: '#667eea' },
  { id: 'school', name: 'School/College', icon: 'fa-graduation-cap', color: '#e84342' },
  { id: 'market', name: 'Safe Market', icon: 'fa-store', color: '#00b894' }
]

export const VOICE_COMMANDS = {
  'help': 'sos',
  'emergency': 'sos',
  'bachao': 'sos',
  'save me': 'sos',
  'sakhi': 'sos',
  'police': 'police',
  'tracking': 'tracking',
  'fake call': 'fakecall',
  'call mother': 'fakecall_mother',
  'silent mode': 'silent',
  'threat detected': 'threat',
  'find police': 'find_police',
  'where am i': 'whereami',
  'safety score': 'safety_score',
  'check area': 'crime_analysis',
  'locate family': 'locate_family',
  'message mother': 'message_mother',
  'track sister': 'track_sister',
  'activate silent': 'silent',
  'secret help': 'silent',
  'start tracking': 'start_tracking'
}

export const THEMES = {
  light: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#4CAF50',
    danger: '#ff4757',
    warning: '#ffa502',
    background: '#ffffff',
    text: '#2d3748',
    textLight: '#718096'
  },
  dark: {
    primary: '#5a67d8',
    secondary: '#6b46a2',
    success: '#48bb78',
    danger: '#f56565',
    warning: '#ed8936',
    background: '#1a202c',
    text: '#f7fafc',
    textLight: '#a0aec0'
  }
}
