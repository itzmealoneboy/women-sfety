import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  MapIcon,
  CameraIcon,
  UsersIcon,
  GiftIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  DocumentDuplicateIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  LinkIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  ArchiveBoxIcon,
  FolderIcon,
  ChartBarIcon,
  GlobeAltIcon,
  HeartIcon as HeartIconOutline
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const navigation = [
  { id: 'dash', name: 'Dashboard', to: '/dashboard', icon: HomeIcon, category: 'Main' },
  
  // Emergency
  { id: 'sos', name: 'SOS Center', to: '/sos', icon: ExclamationTriangleIcon, category: 'Emergency' },
  { id: 'silent', name: 'Silent Emergency', to: '/silent-emergency', icon: ShieldCheckIcon, category: 'Emergency' },
  { id: 'ehub', name: 'Emergency Hub', to: '/emergency-hub', icon: ExclamationTriangleIcon, category: 'Emergency' },
  
  // Safety
  { id: 'live', name: 'Live Tracking', to: '/live-tracking', icon: MapIcon, category: 'Safety' },
  { id: 'nav', name: 'Safety Navigation', to: '/safety-navigation', icon: MapIcon, category: 'Safety' },
  { id: 'trans', name: 'Transport Safety', to: '/transport-safety', icon: ShieldCheckIcon, category: 'Safety' },
  { id: 'hotel', name: 'Hotel Safety', to: '/hotel-safety', icon: ShieldCheckIcon, category: 'Safety' },
  { id: 'share', name: 'Share Location', to: '/share-location', icon: MapIcon, category: 'Safety' },
  
  // AI Safety
  { id: 'threat', name: 'AI Threat Detection', to: '/ai-threat', icon: ShieldCheckIcon, category: 'AI Safety' },
  { id: 'fakecall', name: 'AI Fake Call', to: '/ai-fake-call', icon: ShieldCheckIcon, category: 'AI Safety' },
  { id: 'voiceclone', name: 'Voice Clone AI', to: '/ai-voice-clone', icon: MicrophoneIcon, category: 'AI Safety' },
  { id: 'crime', name: 'Crime Prediction', to: '/crime-prediction', icon: ShieldCheckIcon, category: 'AI Safety' },
  { id: 'face', name: 'Face Recognition', to: '/face-recognition', icon: CameraIcon, category: 'AI Safety' },
  
  // Legal
  { id: 'lhub', name: 'Legal Hub', to: '/legal-hub', icon: ScaleIcon, category: 'Legal Support' },
  { id: 'lok', name: 'Lok Adalat', to: '/lokadalat', icon: ScaleIcon, category: 'Legal Support' },
  { id: 'rights', name: 'Women Rights', to: '/women-rights', icon: ScaleIcon, category: 'Legal Support' },
  
  // Evidence & Records
  { id: 'mhub', name: 'Media Hub', to: '/media-hub', icon: CameraIcon, category: 'Evidence' },
  { id: 'emanage', name: 'Evidence Management', to: '/evidence-manage', icon: ArchiveBoxIcon, category: 'Evidence' },
  { id: 'myrec', name: 'My Records', to: '/my-records', icon: FolderIcon, category: 'Records' },
  { id: 'myrep', name: 'My Reports', to: '/my-reports', icon: DocumentDuplicateIcon, category: 'Records' },
  { id: 'allrep', name: 'All Reports', to: '/reports', icon: ChartBarIcon, category: 'Records' },
  
  // Community
  { id: 'comhub', name: 'Community Hub', to: '/community', icon: UsersIcon, category: 'Community' },
  { id: 'forum', name: 'Forum', to: '/community/forum', icon: GlobeAltIcon, category: 'Community' },
  { id: 'feed', name: 'Social Feed', to: '/community/social-feed', icon: LinkIcon, category: 'Community' },
  
  // Education
  { id: 'edusafe', name: 'Safety Education', to: '/safety-education', icon: AcademicCapIcon, category: 'Education' },
  { id: 'digilit', name: 'Digital Literacy', to: '/digital-literacy', icon: AcademicCapIcon, category: 'Education' },
  { id: 'defense', name: 'Self Defense', to: '/self-defense', icon: AcademicCapIcon, category: 'Education' },
  
  // Finance
  { id: 'upis', name: 'UPI Safety', to: '/upi-safety', icon: CreditCardIcon, category: 'Finance' },
  { id: 'fraud', name: 'Fraud Detection', to: '/fraud-detections', icon: ShieldCheckIcon, category: 'Finance' },
  
  // Support
  { id: 'benhub', name: 'Benefits Hub', to: '/benifits', icon: GiftIcon, category: 'Support' },
  { id: 'schemes', name: 'Schemes', to: '/benifits/schemes', icon: GiftIcon, category: 'Support' },
  { id: 'schol', name: 'Scholarship', to: '/benifits/scholarship', icon: GiftIcon, category: 'Support' },
  
  // Devices & Cyber
  { id: 'wear', name: 'Wearable Devices', to: '/wearable', icon: DevicePhoneMobileIcon, category: 'Devices' },
  { id: 'spy', name: 'Spy Camera Detection', to: '/spy-camera', icon: VideoCameraIcon, category: 'Devices' },
  { id: 'cyber', name: 'Cyber Crime Portal', to: '/cyber-crime', icon: ShieldCheckIcon, category: 'Cyber Security' },
  
  // Others
  { id: 'ngo', name: 'NGO Finder', to: '/ngo-finder', icon: UsersIcon, category: 'System' },
  { id: 'vhub', name: 'Voice Hub', to: '/voice-hub', icon: MicrophoneIcon, category: 'System' },
  { id: 'smart', name: 'Smart Safety', to: '/smart-safety', icon: ShieldCheckIcon, category: 'System' },
  { id: 'lochist', name: 'Location History', to: '/location-history', icon: MapIcon, category: 'System' },
  { id: 'sett', name: 'Settings', to: '/settings', icon: Cog6ToothIcon, category: 'System' },
  { id: 'prof', name: 'Profile', to: '/profile', icon: Cog6ToothIcon, category: 'System' },
];

const Sidebar = ({ onClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [collapsedCats, setCollapsedCats] = useState(['AI Safety', 'Legal Support', 'Evidence', 'Records', 'Community', 'Education', 'Finance', 'Support', 'Devices', 'System']);

  useEffect(() => {
    const savedFavs = localStorage.getItem('sidebar_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(f => f !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('sidebar_favs', JSON.stringify(newFavs));
    toast.success(favorites.includes(id) ? 'Removed from Quick Access' : 'Added to Quick Access');
  };

  const toggleCategory = (cat) => {
    setCollapsedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const categories = [...new Set(navigation.map(n => n.category))];

  return (
    <aside className="h-full w-72 bg-[#0f111a] border-r border-white/5 flex flex-col shadow-2xl z-[100]">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">SAKHI</h2>
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-black">Secure Link</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl lg:hidden transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Nav Content */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        
        {/* Quick Access Section */}
        {favorites.length > 0 && (
          <div>
            <h3 className="px-4 text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <HeartIconSolid className="w-3 h-3" /> Quick Access
            </h3>
            <div className="space-y-1">
              {navigation.filter(n => favorites.includes(n.id)).map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-all" />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  <button 
                    onClick={(e) => toggleFavorite(e, item.id)}
                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Categories */}
        {categories.map((cat) => (
          <div key={cat} className="space-y-1">
            <button 
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-4 py-2 group"
            >
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">
                {cat}
              </h3>
              <div className={`text-gray-600 group-hover:text-gray-400 transition-transform ${collapsedCats.includes(cat) ? 'rotate-0' : 'rotate-90'}`}>
                <ChevronRightIcon className="w-3 h-3" />
              </div>
            </button>

            {!collapsedCats.includes(cat) && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {navigation.filter(n => n.category === cat).map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20'
                          : 'text-gray-500 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-all" />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                    
                    <button 
                      onClick={(e) => toggleFavorite(e, item.id)}
                      className={`ml-auto opacity-0 group-hover:opacity-100 p-1 transition-all ${favorites.includes(item.id) ? 'text-purple-500' : 'hover:text-purple-400'}`}
                    >
                      {favorites.includes(item.id) ? <HeartIconSolid className="w-4 h-4" /> : <HeartIconOutline className="w-4 h-4" />}
                    </button>

                    <div className="absolute left-0 w-1 h-0 bg-purple-500 rounded-r-full transition-all group-[.active]:h-6" />
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-white/5 bg-slate-900/30">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 group cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-purple-500/50 transition-all">
            {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
                <span className="text-white font-black">{user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate uppercase tracking-tight">{user?.name || 'Portal User'}</p>
            <p className="text-[10px] text-gray-500 truncate font-bold">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest border border-transparent hover:border-red-500/20"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default Sidebar;
