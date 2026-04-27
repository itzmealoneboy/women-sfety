export const APP_NAME = 'SAKHI - Women Safety & Sakhi Portal'

export const EMERGENCY_NUMBERS = {
  police: '100',
  ambulance: '108',
  women: '1091',
  fire: '101',
  cyber: '1930',
  child: '1098',
  legal: '15100',
  national: '112'
}

export const MAP_CONFIG = {
  apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
  defaultCenter: { lat: 13.0827, lng: 80.2707 },
  defaultZoom: 13
}

export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
}

export const LANGUAGES = [
  { code: 'ta', name: 'தமிழ்' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' }
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
  'update', 'otp', 'free', 'blocked', 'prize'
]

export const SOS_TIMER_DURATION = 10 // seconds
export const AUTO_CHECKIN_INTERVAL = 15 * 60 // 15 minutes
