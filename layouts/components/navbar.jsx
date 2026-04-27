import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { useState, useRef, useEffect } from 'react';
import { 
  Bars3Icon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  MicrophoneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'AI Fake Call Detected', desc: 'A suspected scam call was auto-blocked.', time: '2m ago', icon: ShieldExclamationIcon, color: 'text-red-500', unread: true },
  { id: 2, title: 'Safe Zone Reached', desc: 'You have entered your designated safe zone.', time: '1h ago', icon: MapPinIcon, color: 'text-green-500', unread: true },
  { id: 3, title: 'Voice Clone Active', desc: 'Your voice fingerprint is successfully secured.', time: '3h ago', icon: MicrophoneIcon, color: 'text-purple-500', unread: false },
  { id: 4, title: 'System Updated', desc: 'SAKHI security protocols updated to v2.1.', time: '1d ago', icon: CheckCircleIcon, color: 'text-blue-500', unread: false },
];

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-white/5 z-[60] h-16 shadow-xl w-full">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all transform active:scale-95"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 md:hidden bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden md:block">
              SAKHI <span className="text-purple-500">.</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 w-80 group focus-within:border-purple-500/50 transition-all">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 group-focus-within:text-purple-400" />
            <input 
              type="text" 
              placeholder="Search features..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-gray-500 w-full ml-2" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5 relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all relative"
          >
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)] border border-slate-900"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-0 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                  <h3 className="text-white font-bold tracking-tight">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-purple-400 font-bold hover:text-purple-300 transition-colors">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-white/5 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-purple-900/10' : ''}`}>
                        <div className={`mt-0.5 ${notif.color}`}>
                          <notif.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${notif.unread ? 'text-white' : 'text-gray-300'}`}>{notif.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-widest">{notif.time}</p>
                        </div>
                        {notif.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No notifications right now.
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-white/10 text-center bg-slate-800/30">
                  <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                    View All Activity
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
           onClick={() => navigate('/community/forum')}
           className="hidden md:flex items-center gap-2 p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>

          <div className="h-8 w-px bg-white/10 hidden md:block"></div>

          <Link to="/profile" className="flex items-center gap-3 pl-2 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-purple-400 transition-colors uppercase tracking-tight">{user?.name || 'Portal User'}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-1">PRO Membership</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
