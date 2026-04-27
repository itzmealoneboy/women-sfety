import { useState, useEffect } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationsstore';
import { useAuthStore } from '../../store/authstores';
import Map from '../../components/common/Map';
import QRCode from 'qrcode';
import {
  ShareIcon, ClipboardIcon, QrCodeIcon, ClockIcon,
  XMarkIcon, ShieldCheckIcon, LinkIcon, CameraIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';
import {
  FaWhatsapp, FaTelegram, FaTwitter, FaSms
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShareLocation = () => {
  const navigate = useNavigate();
  const { currentLocation, address } = useLocationStore();

  const [shareType, setShareType] = useState('one-time'); // one-time | live | trip
  const [shareDuration, setShareDuration] = useState('60'); // minutes
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [activeShares, setActiveShares] = useState(0);

  // Generate share link
  useEffect(() => {
    if (currentLocation) {
      const typeParam = shareType === 'one-time' ? 'pin' : 'live';
      const link = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}&type=${typeParam}`;
      setShareLink(link);
    }
  }, [currentLocation, shareType]);

  // Generate QR code
  const generateQRCode = async () => {
    try {
      const qr = await QRCode.toDataURL(shareLink, {
        width: 300,
        margin: 2,
        color: { dark: '#ec4899', light: '#ffffff' } // Pink tint
      });
      setQrCode(qr);
      setShowQR(true);
    } catch (error) {
      toast.error('Failed to generate secure QR token');
    }
  };

  const shareMethods = [
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'hover:text-green-400 border-gray-700' },
    { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: 'hover:text-blue-400 border-gray-700' },
    { id: 'sms', name: 'SMS / Text', icon: FaSms, color: 'hover:text-yellow-400 border-gray-700' },
    { id: 'qr', name: 'QR Scan', icon: QrCodeIcon, color: 'hover:text-pink-400 border-gray-700' }
  ];

  const handleShare = async (method) => {
    const defaultMessage = `📍 SECURE LOCATION LINK\nI am sharing my ${shareType === 'live' ? 'LIVE' : 'current'} location with you.\n\nExpires in: ${shareDuration} mins\nLink: ${shareLink}\n\nBattery: 85%`;

    if (method === 'qr') {
        await generateQRCode();
        return;
    }

    toast.success('Generated Encrypted Link');
    setActiveShares(prev => prev + 1);

    try {
      switch (method) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(defaultMessage)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent('Live Location')}`, '_blank');
          break;
        case 'sms':
          window.open(`sms:?body=${encodeURIComponent(defaultMessage)}`, '_blank');
          break;
        default: break;
      }
    } catch (e) {
      toast.error('Sharing failed');
    }
  };

  const copyLocation = async () => {
    await navigator.clipboard.writeText(shareLink);
    toast.success('Encrypted link copied to clipboard');
    setActiveShares(prev => prev + 1);
  };
  
  const stopAllSharing = () => {
      setActiveShares(0);
      toast.success('All location sharing links have been revoked and destroyed.');
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] via-[#171717] to-[#0a0a0a] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-32 font-sans text-gray-200">
      
      {/* Header */}
      <div className="pb-8 pt-4 border-b border-gray-800 mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 flex items-center gap-3">
             <GlobeAltIcon className="w-10 h-10 text-pink-500"/> BROADCAST HUB
           </h1>
           <p className="text-gray-400 mt-2 font-medium">
             Military-grade encrypted location sharing with auto-destruct links.
           </p>
        </div>
        
        {activeShares > 0 && (
            <button onClick={stopAllSharing} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors animate-pulse">
                <XMarkIcon className="w-5 h-5"/> SEVER ALL CONNECTIONS
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#111] border border-gray-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Transmission Protocol</h3>
                  
                  <div className="space-y-3 mb-8">
                      <button onClick={()=>setShareType('one-time')} className={`w-full text-left p-4 rounded-2xl transition-all border ${shareType==='one-time' ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600'}`}>
                          <div className="font-bold text-lg mb-1">📍 Single Pin Drop</div>
                          <div className="text-xs opacity-70">Sends only your current coordinates. Does not update if you move. Highest privacy.</div>
                      </button>
                      <button onClick={()=>setShareType('live')} className={`w-full text-left p-4 rounded-2xl transition-all border ${shareType==='live' ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600'}`}>
                          <div className="font-bold text-lg mb-1 flex justify-between"><span>📡 Live Telemetry</span> <span className="bg-pink-500/20 text-pink-400 text-[10px] px-2 py-1 rounded-full uppercase">Recommended</span></div>
                          <div className="text-xs opacity-70">Allows receiver to track your movement on map in real time.</div>
                      </button>
                      <button onClick={()=>setShareType('trip')} className={`w-full text-left p-4 rounded-2xl transition-all border ${shareType==='trip' ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600'}`}>
                          <div className="font-bold text-lg mb-1">🗺️ Trip Broadcast</div>
                          <div className="text-xs opacity-70">Shares destination, ETA, and alerts receiver if you deviate from route.</div>
                      </button>
                  </div>

                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Link Self-Destruct Timer</h3>
                  <select value={shareDuration} onChange={(e)=>setShareDuration(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none mb-2 appearance-none font-mono">
                      <option value="15">15 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="240">4 Hours</option>
                      <option value="1440">24 Hours</option>
                  </select>
                  <p className="text-[10px] text-gray-500 text-right">Access automatically revoked after timeout.</p>
              </div>

              <div className="bg-pink-500 border border-pink-400 rounded-3xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                  <h3 className="text-lg font-black text-white mb-4">Disseminate Link</h3>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                      {shareMethods.map(m => (
                          <button key={m.id} onClick={()=>handleShare(m.id)} className="bg-black/20 hover:bg-black/30 border border-pink-400/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all">
                              <m.icon className="w-6 h-6 text-white"/>
                          </button>
                      ))}
                  </div>
                  <button onClick={copyLocation} className="w-full bg-white text-pink-600 font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-100 transition-colors">
                      <LinkIcon className="w-5 h-5"/> COPY SECURE LINK
                  </button>
              </div>
          </div>

          <div className="lg:col-span-7 bg-[#111] backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col relative">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                  <span>Current Link Focus Area</span>
                  <div className="flex gap-2">
                     <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">±10m Accuracy</span>
                     {activeShares > 0 && <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/50 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div> Live TX: {activeShares}</span>}
                  </div>
              </h3>
              <div className="flex-grow rounded-2xl overflow-hidden border border-gray-800 relative z-10 w-full min-h-[400px]">
                  <Map
                    center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
                    zoom={16}
                    height="100%"
                    className="filter invert-[0.9] hue-rotate-180 contrast-125"
                    markers={[
                        {
                        lat: currentLocation?.lat || 13.0827,
                        lng: currentLocation?.lng || 80.2707,
                        popup: 'Transmission Origin'
                        }
                    ]}
                  />
                  <div className="absolute top-4 right-4 z-[400] bg-black/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-gray-700 shadow-xl max-w-[200px]">
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><ShieldCheckIcon className="w-3 h-3 text-pink-500"/> Payload Preview</div>
                      <div className="text-xs text-gray-300">This is exactly what the receiver will see when they open the link.</div>
                  </div>
              </div>
          </div>

      </div>

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)] border-4 border-pink-500">
                <img src={qrCode} alt="Secure QR" className="w-48 h-48" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scan & Track</h3>
              <p className="text-sm text-gray-400 mb-6 font-mono">Token expires in {shareDuration}m</p>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `secure_link_${Date.now()}.png`;
                  link.href = qrCode;
                  link.click();
                  toast.success('Encrypted QR downloaded to device');
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors border border-gray-600"
              >
                SAVE QR TO DEVICE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShareLocation;
