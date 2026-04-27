import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authstores'
import { useSakshiEyeStore } from '../../store/sakshieyestore'
import { useLocationStore } from '../../store/locationsstore'
import { useEmergencyStore } from '../../store/emergencystore'
import { SakshiEyeStatusCard } from '../../components/sakshieye/SakshiEyeComponents'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebases'
import StatsCard from './components/statscard'
import QuickActions from './components/quickactions'
import SafetyChart from './components/safetycharts'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import {
  MapPinIcon,
  ShieldCheckIcon,
  UsersIcon,
  BuildingLibraryIcon,
  ScaleIcon,
  MicrophoneIcon,
  PhoneIcon,
  ChartBarIcon,
  CameraIcon,
  DocumentIcon,
  BellAlertIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon as HeartIconOutline,
  VideoCameraIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  FolderIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CreditCardIcon,
  GiftIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  LinkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

// Full Master List of Features (Mapped by the same IDs used in Sidebar)
const allFeaturesMaster = [
  { id: 'sos', title: 'SOS Center', route: '/sos', icon: ExclamationTriangleIcon, color: 'from-red-500 to-red-600' },
  { id: 'silent', title: 'Silent Emergency', route: '/silent-emergency', icon: ShieldCheckIcon, color: 'from-red-600 to-red-700' },
  { id: 'ehub', title: 'Emergency Hub', route: '/emergency-hub', icon: ExclamationTriangleIcon, color: 'from-red-500 to-red-600' },
  { id: 'live', title: 'Live Tracking', route: '/live-tracking', icon: MapPinIcon, color: 'from-blue-500 to-blue-600' },
  { id: 'nav', title: 'Safety Navigation', route: '/safety-navigation', icon: MapPinIcon, color: 'from-blue-500 to-blue-600' },
  { id: 'trans', title: 'Transport Safety', route: '/transport-safety', icon: ShieldCheckIcon, color: 'from-blue-500 to-blue-600' },
  { id: 'hotel', title: 'Hotel Safety', route: '/hotel-safety', icon: ShieldCheckIcon, color: 'from-blue-500 to-blue-600' },
  { id: 'share', title: 'Share Location', route: '/share-location', icon: MapPinIcon, color: 'from-blue-500 to-blue-600' },
  { id: 'threat', title: 'AI Threat Detection', route: '/ai-threat', icon: ShieldCheckIcon, color: 'from-purple-500 to-purple-600' },
  { id: 'fakecall', title: 'AI Fake Call', route: '/ai-fake-call', icon: ShieldCheckIcon, color: 'from-purple-500 to-purple-600' },
  { id: 'voiceclone', title: 'Voice Clone AI', route: '/ai-voice-clone', icon: MicrophoneIcon, color: 'from-purple-500 to-purple-600' },
  { id: 'crime', title: 'Crime Prediction', route: '/crime-prediction', icon: ShieldCheckIcon, color: 'from-purple-500 to-purple-600' },
  { id: 'face', title: 'Face Recognition', route: '/face-recognition', icon: CameraIcon, color: 'from-purple-500 to-purple-600' },
  { id: 'lhub', title: 'Legal Hub', route: '/legal-hub', icon: ScaleIcon, color: 'from-blue-700 to-blue-800' },
  { id: 'lok', title: 'Lok Adalat', route: '/lokadalat', icon: ScaleIcon, color: 'from-blue-700 to-blue-800' },
  { id: 'rights', title: 'Women Rights', route: '/women-rights', icon: ScaleIcon, color: 'from-blue-700 to-blue-800' },
  { id: 'mhub', title: 'Media Hub', route: '/media-hub', icon: CameraIcon, color: 'from-orange-500 to-orange-600' },
  { id: 'emanage', title: 'Evidence Management', route: '/evidence-manage', icon: ArchiveBoxIcon, color: 'from-orange-500 to-orange-600' },
  { id: 'myrec', title: 'My Records', route: '/my-records', icon: FolderIcon, color: 'from-green-500 to-green-600' },
  { id: 'myrep', title: 'My Reports', route: '/my-reports', icon: DocumentDuplicateIcon, color: 'from-green-500 to-green-600' },
  { id: 'allrep', title: 'All Reports', route: '/reports', icon: ChartBarIcon, color: 'from-green-500 to-green-600' },
  { id: 'comhub', title: 'Community Hub', route: '/community', icon: UsersIcon, color: 'from-pink-500 to-pink-600' },
  { id: 'forum', title: 'Forum', route: '/community/forum', icon: GlobeAltIcon, color: 'from-pink-500 to-pink-600' },
  { id: 'feed', title: 'Social Feed', route: '/community/social-feed', icon: LinkIcon, color: 'from-pink-500 to-pink-600' },
  { id: 'edusafe', title: 'Safety Education', route: '/safety-education', icon: AcademicCapIcon, color: 'from-yellow-500 to-yellow-600' },
  { id: 'digilit', name: 'Digital Literacy', route: '/digital-literacy', icon: AcademicCapIcon, color: 'from-yellow-500 to-yellow-600' },
  { id: 'defense', name: 'Self Defense', route: '/self-defense', icon: AcademicCapIcon, color: 'from-yellow-500 to-yellow-600' },
  { id: 'upis', name: 'UPI Safety', route: '/upi-safety', icon: CreditCardIcon, color: 'from-indigo-500 to-indigo-600' },
  { id: 'fraud', name: 'Fraud Detection', route: '/fraud-detections', icon: ShieldCheckIcon, color: 'from-indigo-500 to-indigo-600' },
  { id: 'benhub', name: 'Benefits Hub', route: '/benifits', icon: GiftIcon, color: 'from-teal-500 to-teal-600' },
  { id: 'schemes', name: 'Schemes', route: '/benifits/schemes', icon: GiftIcon, color: 'from-teal-500 to-teal-600' },
  { id: 'schol', name: 'Scholarship', route: '/benifits/scholarship', icon: GiftIcon, color: 'from-teal-500 to-teal-600' },
  { id: 'wear', name: 'Wearable Devices', route: '/wearable', icon: DevicePhoneMobileIcon, color: 'from-cyan-500 to-cyan-600' },
  { id: 'spy', name: 'Spy Camera Detection', route: '/spy-camera', icon: VideoCameraIcon, color: 'from-cyan-500 to-cyan-600' },
  { id: 'cyber', name: 'Cyber Crime Portal', route: '/cyber-crime', icon: ShieldCheckIcon, color: 'from-red-500 to-red-600' },
  { id: 'ngo', name: 'NGO Finder', route: '/ngo-finder', icon: UsersIcon, color: 'from-slate-500 to-slate-600' },
  { id: 'vhub', name: 'Voice Hub', route: '/voice-hub', icon: MicrophoneIcon, color: 'from-slate-500 to-slate-600' },
  { id: 'smart', name: 'Smart Safety', route: '/smart-safety', icon: ShieldCheckIcon, color: 'from-slate-500 to-slate-600' },
  { id: 'lochist', name: 'Location History', route: '/location-history', icon: MapPinIcon, color: 'from-slate-500 to-slate-600' },
  { id: 'sett', name: 'Settings', route: '/settings', icon: Cog6ToothIcon, color: 'from-slate-500 to-slate-600' },
  { id: 'prof', name: 'Profile', route: '/profile', icon: Cog6ToothIcon, color: 'from-slate-500 to-slate-600' },
];

const MainDashboard = () => {
  const { user } = useAuthStore()
  const { currentLocation } = useLocationStore()
  const { emergencyContacts } = useEmergencyStore()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    photos: 0,
    documents: 0,
    reports: 0,
    contacts: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])

  // Store Hooks for Sakshi Eye
  const isEnabled = useSakshiEyeStore((state) => state.isEnabled)
  const detectionCount = useSakshiEyeStore((state) => state.detectionCount)
  const capturedFacesCount = useSakshiEyeStore((state) => state.capturedFaces.length)
  const lastDetectionTime = useSakshiEyeStore((state) => state.lastDetectionTime)

  useEffect(() => {
    loadDashboardData()
    // Load favorites from local storage
    const savedFavs = localStorage.getItem('sidebar_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [])

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(f => f !== id);
      toast.success('Removed from Workspace');
    } else {
      newFavs = [...favorites, id];
      toast.success('Added to Workspace');
    }
    setFavorites(newFavs);
    localStorage.setItem('sidebar_favs', JSON.stringify(newFavs));
    
    // Dispatch custom event to notify sidebar
    window.dispatchEvent(new Event('storage'));
  };

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      let photoCount = 12;
      let docCount = 5;
      let reportCount = 2;

      try {
        const photosQuery = query(collection(db, 'photos'), where('userId', '==', user.uid || user.id))
        const photosSnapshot = await getDocs(photosQuery)
        photoCount = photosSnapshot.size;
      } catch (e) {}

      setStats({
        photos: photoCount,
        documents: docCount,
        reports: reportCount,
        contacts: emergencyContacts?.length || 0
      })

      const activities = [
        { id: 'photo', icon: CameraIcon, text: 'Recent photo captured', time: '2 hours ago', color: 'text-primary-500' },
        { id: 'report', icon: DocumentIcon, text: 'Safety report filed', time: '5 hours ago', color: 'text-warning' }
      ]
      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickStats = [
    { title: 'Safety Score', value: '85%', icon: ShieldCheckIcon, color: 'from-green-500 to-green-600', trend: '+5%' },
    { title: 'Emergency Contacts', value: stats.contacts.toString(), icon: UsersIcon, color: 'from-blue-500 to-blue-600', trend: '+2' },
    { title: 'Nearby Police', value: '2.3 km', icon: BuildingLibraryIcon, color: 'from-purple-500 to-purple-600', trend: '3 stations' },
    { title: 'Voice Clone', value: user?.voiceCloned ? 'Active' : 'Setup', icon: MicrophoneIcon, color: 'from-orange-500 to-orange-600', trend: user?.voiceCloned ? 'Ready' : 'Required' }
  ]

  // Filter features based on user's favorites
  const myWorkspaceFeatures = allFeaturesMaster.filter(f => favorites.includes(f.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-purple-600 mt-2 font-black text-xs uppercase tracking-widest">
            SAKHI SECURE PORTAL • {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-sm group hover:border-purple-500 transition-all">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-sm font-black text-gray-700 tracking-tight">
            {currentLocation && currentLocation.lat 
              ? `LIVE: ${currentLocation.lat.toFixed(4)}°N, ${currentLocation.lng.toFixed(4)}°E`
              : 'SYNCING GPS...'
            }
          </span>
        </div>
      </div>

      {/* Main Grid: Stats & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <SakshiEyeStatusCard
                isActive={isEnabled}
                detectionCount={detectionCount}
                facesCount={capturedFacesCount}
                lastDetection={lastDetectionTime}
            />

            <QuickActions />
        </div>

        <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white/80 backdrop-blur-xl border-white shadow-2xl rounded-[40px] p-8">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">Recent Intelligence</h3>
                <div className="space-y-4">
                {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group hover:border-purple-200 transition-all">
                        <div className={`p-3 rounded-xl bg-gray-50 ${activity.color} group-hover:scale-110 transition-transform`}>
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-gray-800">{activity.text}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{activity.time}</p>
                        </div>
                    </div>
                ))}
                </div>
            </Card>

            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Legal Aid Shield</h3>
                    <p className="text-xs opacity-80 mb-6 font-bold uppercase tracking-widest">NALSA Free Support: 15100</p>
                    <button onClick={() => navigate('/legal-hub')} className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-purple-50 hover:gap-4 transition-all shadow-xl shadow-black/10">
                        View Rights <ArrowRightIcon className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* NEW CUSTOM WORKSPACE SECTION */}
      <div className="mt-12 pt-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Your Secure Workspace</h2>
                <p className="text-gray-500 font-bold text-sm mt-1">
                    {myWorkspaceFeatures.length > 0 
                      ? 'Only showing the features you have selected from the sidebar.'
                      : 'Your workspace is empty. Click the heart icon in the sidebar to pin features here.'
                    }
                </p>
            </div>
            {myWorkspaceFeatures.length > 0 && (
                <div className="flex gap-2">
                    <span className="bg-purple-500/10 text-purple-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-200">
                        {myWorkspaceFeatures.length} Active Tools
                    </span>
                </div>
            )}
        </div>

        {myWorkspaceFeatures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-500">
                {myWorkspaceFeatures.map((feature) => (
                    <div 
                        key={feature.id}
                        onClick={() => navigate(feature.route)}
                        className={`bg-gradient-to-br ${feature.color} text-white rounded-[40px] p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all transform hover:-translate-y-2 text-left cursor-pointer relative group`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <button 
                                onClick={(e) => toggleFavorite(e, feature.id)}
                                className="p-3 bg-white/10 hover:bg-white/30 rounded-xl transition-all"
                            >
                                <HeartIconSolid className="w-5 h-5 text-white shadow-sm" />
                            </button>
                        </div>
                        <h4 className="font-black text-2xl mb-1 tracking-tight uppercase leading-none">{feature.title || feature.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Safe Tool</p>
                        
                        <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all group-hover:gap-4">
                            Open Console <ArrowRightIcon className="w-3 h-3" />
                        </div>
                    </div>
                ))}
                <button 
                    onClick={() => toast.success('Open Sidebar and click Heart Icon to add more!')}
                    className="border-4 border-dashed border-gray-200 rounded-[40px] p-8 flex flex-col items-center justify-center gap-4 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-gray-300 hover:text-purple-400 group"
                >
                    <PlusIcon className="w-12 h-12 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-xs uppercase tracking-widest">Add Tools</span>
                </button>
            </div>
        ) : (
            <div className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-[50px] p-24 text-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <HeartIconOutline className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">No Active Tools</h3>
                <p className="text-gray-400 mt-3 font-bold max-w-sm mx-auto">
                    Click the **Heart Icon ❤️** in the sidebar on any page you want to see here on your personalized dashboard.
                </p>
                <Button 
                    variant="outline" 
                    className="mt-10 border-gray-300 text-gray-500 font-black uppercase tracking-widest text-[10px] px-10 py-4"
                    onClick={() => toast.info('Look for the heart icons in the sidebar categories!')}
                >
                    Learn How to Customize
                </Button>
            </div>
        )}
      </div>

      {/* Global Impact Summary */}
      <div className="mt-20 bg-[#0f111a] rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 p-10 opacity-10">
            <ShieldCheckIcon className="w-64 h-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10 text-center">
            <div>
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">41+</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Modules Available</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">13</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Feature Categories</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">24/7</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Support</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">100%</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Secure Analytics</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
