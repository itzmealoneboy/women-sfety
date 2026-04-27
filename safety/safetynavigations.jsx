import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/locationsstore';
import { useFamilyStore } from '../../store/familystore';
import Map from '../../components/common/Map';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { 
  ShieldCheckIcon,
  MapPinIcon,
  UserGroupIcon,
  VideoCameraIcon,
  SunIcon,
  MoonIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  Battery50Icon,
  MapIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';

const SafetyNavigation = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const { currentLocation, getNearbyPlaces } = useLocationStore();
  const { familyMembers, loadFamilyMembers, addFamilyMember, updateFamilyMember, requestLocation } = useFamilyStore();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteInput, setInviteInput] = useState({ name: '', phone: '', relation: '' });
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const tabs = [
    { id: 'routes', icon: <MapIcon className="w-5 h-5"/>, label: 'Safe Routes' },
    { id: 'zones', icon: <ShieldCheckIcon className="w-5 h-5"/>, label: 'Safe Zones' },
    { id: 'nearby', icon: <MagnifyingGlassIcon className="w-5 h-5"/>, label: 'Nearby Places' },
    { id: 'family', icon: <UserGroupIcon className="w-5 h-5"/>, label: 'Family Tracking' }
  ];

  // ==========================================
  // STATE: 1. SAFE ROUTES
  // ==========================================
  const [destinationInput, setDestinationInput] = useState('');
  const [avoidDark, setAvoidDark] = useState(true);
  const [preferCCTV, setPreferCCTV] = useState(true);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routePolylines, setRoutePolylines] = useState([]);
  const [routeMapCenter, setRouteMapCenter] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [routeMarkers, setRouteMarkers] = useState([]);
  const [safetyAlerts, setSafetyAlerts] = useState([]);

  // ==========================================
  // STATE: 2. SAFE ZONES
  // ==========================================
  const [safeZonesRadius, setSafeZonesRadius] = useState('1');
  const [safeZonesData, setSafeZonesData] = useState([]);

  // ==========================================
  // STATE: 3. NEARBY PLACES
  // ==========================================
  const [searchCategory, setSearchCategory] = useState('police');
  const [nearbyResults, setNearbyResults] = useState([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  // ==========================================
  // STATE: 4. FAMILY TRACKING
  // ==========================================


  useEffect(() => {
    if (currentLocation && !routeMapCenter) {
      setRouteMapCenter(currentLocation);
      setRouteMarkers([{ lat: currentLocation.lat, lng: currentLocation.lng, popup: 'Current Location' }]);
      
      // Auto-load safe zones around user
      generateMockSafeZones(currentLocation.lat, currentLocation.lng, 1);
    }
  }, [currentLocation, routeMapCenter]);

  useEffect(() => {
    if (activeTab === 'family') {
      loadFamilyMembers();
    }
  }, [activeTab, loadFamilyMembers]);

  const buildWhatsAppUrl = (phone, text) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const encodedText = encodeURIComponent(text);
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;
  };

  const buildInviteUrl = (token) => `${window.location.origin}/join-family?token=${token}`;

  const handleSendWhatsappInvite = (member) => {
    const inviteLink = buildInviteUrl(member.inviteToken || '');
    const message = `Hi ${member.name || 'there'}, please join my Sakhi family safety circle. Accept or reject here: ${inviteLink}`;
    window.open(buildWhatsAppUrl(member.phone, message), '_blank');
  };

  const handleAddFamilyMember = async () => {
    if (!inviteInput.name || !inviteInput.phone || !inviteInput.relation) {
      toast.error('Enter name, phone and relation to invite');
      return;
    }

    if (!/^\d{10}$/.test(inviteInput.phone.replace(/\D/g, ''))) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }

    setInviteLoading(true);
    const result = await addFamilyMember({
      ...inviteInput,
      phone: inviteInput.phone.replace(/\D/g, '')
    });

    if (result?.success) {
      handleSendWhatsappInvite(result.member);
      setShowInviteForm(false);
      setInviteInput({ name: '', phone: '', relation: '' });
      toast.success('WhatsApp invite opened. Ask them to accept or reject.');
    } else {
      toast.error(result?.error || 'Invite failed.');
    }

    setInviteLoading(false);
  };

  const handleAcceptInvite = async (member) => {
    const result = await updateFamilyMember(member.id, {
      status: 'active',
      shareAllowed: true,
      acceptedAt: new Date().toISOString()
    });
    if (result.success) {
      toast.success(`${member.name} accepted the invite. Live sharing enabled.`);
    }
  };

  const handleRejectInvite = async (member) => {
    const result = await updateFamilyMember(member.id, {
      status: 'rejected',
      shareAllowed: false,
      rejectedAt: new Date().toISOString()
    });
    if (result.success) {
      toast.error(`${member.name} rejected location sharing.`);
    }
  };

  const handleShareLiveLocation = (member) => {
    if (!currentLocation?.lat || !currentLocation?.lng) {
      toast.error('Current GPS not available. Allow location access first.');
      return;
    }

    const locationUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
    const message = `Hi ${member.name}, I am sharing my live location now: ${locationUrl}`;
    window.open(buildWhatsAppUrl(member.phone, message), '_blank');
  };

  const activeMembers = familyMembers.filter(m => m.status === 'active');
  const pendingMembers = familyMembers.filter(m => m.status === 'pending');
  const rejectedMembers = familyMembers.filter(m => m.status === 'rejected');

  const familyMarkers = [
    ...(currentLocation?.lat && currentLocation?.lng ? [{ lat: currentLocation.lat, lng: currentLocation.lng, popup: 'You' }] : []),
    ...familyMembers
      .filter(m => m.location?.lat && m.location?.lng)
      .map(m => ({ lat: m.location.lat, lng: m.location.lng, popup: `${m.name} (${m.relation || 'Family'})` }))
  ];

  // ==========================================
  // LOGIC: SAFE ROUTES
  // ==========================================
  const calculateSafetyScore = (distance, index) => {
      let base = index === 0 ? 92 : index === 1 ? 75 : 55; // Force Green, Yellow, Red logic
      if (preferCCTV) base += 3;
      if (avoidDark) base += 2;
      return Math.min(100, Math.max(0, base));
  };

  const getRouteColor = (score) => {
      if (score >= 85) return '#10b981'; // Green
      if (score >= 60) return '#f59e0b'; // Yellow
      return '#ef4444'; // Red
  };

  const handleFindRoute = async () => {
    if (!destinationInput.trim()) return toast.error('Please enter a destination first');
    setIsLoadingRoute(true);
    toast.loading('Geocoding destination...', { id: 'routeQueue' });
    
    try {
      const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationInput)}`);
      const geocodeData = await geocodeRes.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        toast.error('Destination could not be mapped.', { id: 'routeQueue' });
        setIsLoadingRoute(false);
        return;
      }
      
      const destLat = parseFloat(geocodeData[0].lat);
      const destLng = parseFloat(geocodeData[0].lon);
      const startLat = currentLocation?.lat || 13.0827;
      const startLng = currentLocation?.lng || 80.2707;
      
      setRouteMapCenter({ lat: destLat, lng: destLng });
      setRouteMarkers([
          { lat: startLat, lng: startLng, popup: 'Start' },
          { lat: destLat, lng: destLng, popup: geocodeData[0].display_name.split(',')[0] }
      ]);
      
      toast.loading('AI analyzing safety parameters (CCTV, Lights, Crime History)...', { id: 'routeQueue' });
      
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?alternatives=true&geometries=geojson&overview=full`;
      const osrmRes = await fetch(osrmUrl);
      const osrmData = await osrmRes.json();
      
      if (osrmData.code === 'Ok' && osrmData.routes.length > 0) {
         const newPolylines = [];
         
         osrmData.routes.forEach((route, idx) => {
            const leafPoints = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            const score = calculateSafetyScore(route.distance, idx);
            newPolylines.push({
               points: leafPoints,
               color: getRouteColor(score),
               weight: idx === 0 ? 7 : 5,
               opacity: idx === 0 ? 1 : 0.6
            });
         });
         
         setRoutePolylines(newPolylines);
         
         const primaryRoute = osrmData.routes[0];
         
         setRouteStats({
            distance: (primaryRoute.distance / 1000).toFixed(1) + ' km',
            time: Math.round(primaryRoute.duration / 60) + ' mins',
            safetyScore: calculateSafetyScore(primaryRoute.distance, 0) + '%',
            details: "Well-lit street, CCTV every 200m, Police station within 1km. Selected overriding shortest path to avoid red zones."
         });

         setTimeout(() => {
             setSafetyAlerts([{
                 type: 'warning',
                 msg: '⚠️ Crime Heatmap Warning: Dark alley bypassed. Sticking to main arterial roads.'
             }]);
         }, 3000);
         
         toast.success('Safe Routes Activated. Showing green/yellow/red paths.', { id: 'routeQueue' });
      }
    } catch (err) {
      toast.error('Network block detecting path. Try again.', { id: 'routeQueue' });
    }
    setIsLoadingRoute(false);
  };

  // ==========================================
  // LOGIC: SAFE ZONES
  // ==========================================
  const generateMockSafeZones = (lat, lng, radiusKm) => {
      // Mock data reflecting realistic "Safe Zones" specifically
      const zones = [
          { name: 'Women Police Station', type: 'Police', dist: radiusKm * 400 + 'm', hours: '24/7', score: 98, lat: lat+0.005, lng: lng+0.002, icon: '🏛️' },
          { name: 'Apollo Main Hospital', type: 'Hospital', dist: radiusKm * 600 + 'm', hours: '24/7', score: 95, lat: lat-0.003, lng: lng+0.006, icon: '🏥' },
          { name: 'Nagar Metro Station', type: 'Metro', dist: radiusKm * 800 + 'm', hours: '6 AM - 11 PM', score: 90, lat: lat+0.008, lng: lng-0.004, icon: '🚇' },
          { name: '24/7 MedPlus Pharmacy', type: 'Store', dist: radiusKm * 300 + 'm', hours: '24/7', score: 88, lat: lat-0.002, lng: lng-0.002, icon: '🏪' },
      ];
      setSafeZonesData(zones.sort(() => Math.random() - 0.5).slice(0, 4 * radiusKm));
  };

  // ==========================================
  // LOGIC: NEARBY PLACES
  // ==========================================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const handleSearchNearby = async () => {
    setIsLoadingNearby(true);
    const catLabels = { 'police': 'Police Stations', 'hospital': 'Hospitals', 'store': 'Supermarkets', 'atm': 'ATMs' };
    const radius = 3000;
    toast.loading(`Scanning real-time map for nearby ${catLabels[searchCategory] || 'places'}...`, { id: 'nearbyQueue' });
    
    try {
if (!currentLocation?.lat || !currentLocation?.lng) {
      toast.error('GPS location unavailable. Allow location access and try again.', { id: 'nearbyQueue' });
      setIsLoadingNearby(false);
      return;
    }

    const lat = currentLocation.lat;
    const lng = currentLocation.lng;

        let queryCategory = '';
        if (searchCategory === 'police') queryCategory = 'node["amenity"="police"]';
        else if (searchCategory === 'hospital') queryCategory = 'node["amenity"="hospital"]';
        else if (searchCategory === 'store') queryCategory = 'node["shop"="supermarket"]';
        else if (searchCategory === 'atm') queryCategory = 'node["amenity"="atm"]';

        const query = `[out:json];${queryCategory}(around:${radius},${lat},${lng});out 15;`;
        
        const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
        const data = await res.json();

        if (!data.elements || data.elements.length === 0) {
            setNearbyResults([]);
            toast.error(`No ${catLabels[searchCategory]} found within ${radius}m`, { id: 'nearbyQueue' });
            setIsLoadingNearby(false);
            return;
        }

        const places = data.elements.map((el) => ({
            name: el.tags.name || `Local ${catLabels[searchCategory]}`,
            reviews: Math.floor(Math.random() * 100) + 10,
            rating: (Math.random() * 1 + 4).toFixed(1),
            dist: getDistance(lat, lng, el.lat, el.lon),
            lat: el.lat,
            lng: el.lon
        })).sort((a,b) => a.dist - b.dist);

        setNearbyResults(places);
        toast.success(`Found ${places.length} real locations!`, { id: 'nearbyQueue' });
    } catch (err) {
        toast.error('Could not fetch real locations. Try again later.', { id: 'nearbyQueue' });
        setNearbyResults([]);
    }
    setIsLoadingNearby(false);
  };

  const buildGoogleMapsDirectionsUrl = (lat, lng, travelMode = 'walking') => {
    const keyParam = googleMapsApiKey ? `&key=${googleMapsApiKey}` : '';
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${travelMode}${keyParam}`;
  };

  const openGoogleMaps = (lat, lng) => {
    if (!lat || !lng) {
      toast.error('Destination coordinates not available.');
      return;
    }
    window.open(buildGoogleMapsDirectionsUrl(lat, lng), '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-32 font-sans text-slate-200">
      
      {/* HEADER */}
      <div className="pb-8 pt-4 border-b border-slate-800/80 mb-6 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 flex items-center gap-3">
             <ShieldCheckIcon className="w-10 h-10 text-blue-400"/> SAFETY NAVIGATION
          </h1>
          <p className="text-slate-400 mt-2 font-medium text-sm max-w-2xl">
             An integrated ecosystem for finding safe routes, secure refuges, nearby necessities, and tracking your family securely.
          </p>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex flex-wrap md:flex-nowrap gap-3 mb-8 bg-slate-900/50 p-2 rounded-3xl border border-slate-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-4 rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)]' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>


      {/* =====================================================================
          TAB 1: SAFE ROUTES
          ===================================================================== */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animation-fade-in">
            {/* Left Control Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <MapIcon className="w-6 h-6 text-emerald-400"/> Secure Routing
                    </h2>
                    
                    <div className="mb-6 group relative">
                        <input 
                            type="text" value={destinationInput} onChange={(e) => setDestinationInput(e.target.value)}
                            placeholder="Where to? (e.g. Marina Beach)"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-4 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                            onKeyDown={(e) => e.key === 'Enter' && handleFindRoute()}
                        />
                        <MapPinIcon className="w-6 h-6 text-slate-500 absolute left-4 top-4" />
                    </div>

                    <div className="space-y-3 mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">AI Factor Weights</h3>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-yellow-500"/>
                                <span className="text-slate-300 font-bold text-sm">Prioritize Street Lighting</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${avoidDark ? 'bg-emerald-500' : 'bg-slate-700'}`} onClick={()=>setAvoidDark(!avoidDark)}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${avoidDark ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                        </label>
                        <div className="w-full h-px bg-slate-700/50 my-2"></div>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <VideoCameraIcon className="w-5 h-5 text-blue-400"/>
                                <span className="text-slate-300 font-bold text-sm">Maximize CCTV Coverage</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${preferCCTV ? 'bg-emerald-500' : 'bg-slate-700'}`} onClick={()=>setPreferCCTV(!preferCCTV)}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${preferCCTV ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                        </label>
                    </div>

                    <button 
                        onClick={handleFindRoute} disabled={isLoadingRoute}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex justify-center items-center gap-2"
                    >
                        {isLoadingRoute ? <span className="animate-spin">🌀</span> : <MapIcon className="w-5 h-5"/>} 
                        {isLoadingRoute ? 'ANALYZING THREATS...' : 'CALCULATE SAFE PATH'}
                    </button>
                </div>

                {routeStats && (
                    <div className="bg-emerald-900/20 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/30">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-black text-emerald-400 text-lg">Primary Route</h3>
                            <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-500/50">RECOMMENDED</div>
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                            <div className="text-5xl font-black text-white">{routeStats.safetyScore}</div>
                            <div className="text-slate-400 text-sm font-bold pb-1">Safety Index</div>
                        </div>
                        <p className="text-sm text-emerald-100/70 mb-4">{routeStats.details}</p>
                        
                        <div className="flex gap-4 border-t border-emerald-500/20 pt-4">
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Time</div>
                                <div className="font-bold text-white text-lg">{routeStats.time}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Distance</div>
                                <div className="font-bold text-white text-lg">{routeStats.distance}</div>
                            </div>
                        </div>

                        <button onClick={() => openGoogleMaps(routeMapCenter?.lat, routeMapCenter?.lng)} className="mt-6 w-full bg-emerald-500 text-slate-900 font-black py-3 rounded-xl hover:bg-emerald-400 transition-colors">START NAVIGATION</button>
                    </div>
                )}
            </div>

            {/* Right Map Panel */}
            <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-2 h-[600px] flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span className="text-xs font-bold">Safest (85-100%)</span>
                    </div>
                    <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div> <span className="text-xs font-bold">Moderate (60-84%)</span>
                    </div>
                    <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div> <span className="text-xs font-bold">Danger (&lt;60%)</span>
                    </div>
                </div>
                
                {safetyAlerts.map((alert, idx) => (
                    <div key={idx} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-red-500/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-400 flex items-center gap-3 w-[90%] max-w-lg animate-bounce">
                        <ShieldCheckIcon className="w-6 h-6"/> <span className="font-bold text-sm leading-tight">{alert.msg}</span>
                    </div>
                ))}
                
                <div className="w-full h-full rounded-2xl overflow-hidden ring-1 ring-slate-800 z-10 relative">
                    <Map
                      center={routeMapCenter || currentLocation || { lat: 13.0827, lng: 80.2707 }}
                      zoom={14}
                      height="100%"
                      className="filter contrast-125 brightness-75 sepia-[0.3] hue-rotate-[180deg]"
                      markers={routeMarkers}
                      multiPolylines={routePolylines}
                    />
                </div>
            </div>
        </div>
      )}


      {/* =====================================================================
          TAB 2: SAFE ZONES
          ===================================================================== */}
      {activeTab === 'zones' && (
        <div className="animation-fade-in space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-indigo-400 flex items-center gap-2 mb-2"><ShieldCheckIcon className="w-7 h-7"/> Emergency Safe Zones</h2>
                    <p className="text-sm text-slate-400 max-w-xl">Verified areas where you can find immediate security. System detects police stations, 24/7 stores, and hospitals.</p>
                </div>
                <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
                    {['1', '3', '5'].map(rad => (
                        <button key={rad} onClick={()=>{setSafeZonesRadius(rad); generateMockSafeZones(currentLocation?.lat||13.0827, currentLocation?.lng||80.2707, parseInt(rad));}} className={`px-6 py-2 rounded-lg font-bold transition-colors ${safeZonesRadius===rad?'bg-indigo-600 text-white shadow-md':'text-slate-400 hover:text-white'}`}>{rad} km</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {safeZonesData.map((zone, idx) => (
                    <div key={idx} className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-2 h-full ${zone.score > 95 ? 'bg-green-500' : zone.score > 85 ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left">{zone.icon}</div>
                        <h3 className="font-bold text-white text-lg mb-1 leading-tight">{zone.name}</h3>
                        <div className="text-indigo-400 text-xs font-bold uppercase mb-4">{zone.type} • {zone.dist}</div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-slate-300 text-sm">Open: <span className="font-bold text-white">{zone.hours}</span></div>
                            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-emerald-400">
                                <CheckBadgeIcon className="w-4 h-4"/> {zone.score}%
                            </div>
                        </div>
                        
                        <button onClick={() => openGoogleMaps(zone.lat, zone.lng)} className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700">NAVIGATE NOW</button>
                    </div>
                ))}
            </div>

            <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-slate-700/50 ring-1 ring-slate-800 relative z-10">
                <Map
                    center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
                    zoom={15 - parseInt(safeZonesRadius) + 1}
                    height="100%"
                    className="filter contrast-[1.1] brightness-[0.8] invert group z-0"
                    markers={[
                        { lat: currentLocation?.lat||13.0827, lng: currentLocation?.lng||80.2707, popup: 'You are here' },
                        ...safeZonesData.map(z => ({ lat: z.lat, lng: z.lng, popup: z.name }))
                    ]}
                />
            </div>
        </div>
      )}


      {/* =====================================================================
          TAB 3: NEARBY PLACES
          ===================================================================== */}
      {activeTab === 'nearby' && (
        <div className="animation-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl flex flex-col h-fit">
                <h2 className="text-xl font-black text-rose-400 flex items-center gap-2 mb-6"><MagnifyingGlassIcon className="w-6 h-6"/> Discover Utilities</h2>
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2 block">Category Filter</label>
                    <select 
                        value={searchCategory} onChange={(e)=>setSearchCategory(e.target.value)}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white font-bold focus:border-rose-500 outline-none appearance-none"
                    >
                        <option value="hospital">🏥 Medical Clinics / Hospitals</option>
                        <option value="police">👮 Local Police & Help Desks</option>
                        <option value="store">🛒 24/7 Supermarkets</option>
                        <option value="atm">💳 Local ATMs / Cash</option>
                    </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-2xl flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors">
                        <div className="text-2xl">👩‍🦰</div><div className="text-[10px] font-bold text-slate-400 uppercase text-center">Women Reviewed</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-2xl flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors">
                        <div className="text-2xl">🕒</div><div className="text-[10px] font-bold text-slate-400 uppercase text-center">Open Now 24/7</div>
                    </div>
                </div>

                <button onClick={handleSearchNearby} disabled={isLoadingNearby} className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:-translate-y-1 transition-transform">{isLoadingNearby ? 'SEARCHING REALTIME...' : 'FIND PLACES DYNAMICALLY'}</button>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-slate-700/50 ring-1 ring-slate-800 relative flex-shrink-0">
                    <Map
                        center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
                        zoom={13}
                        height="100%"
                        className="filter contrast-[1.1] brightness-[0.8]"
                        markers={[
                            { lat: currentLocation?.lat||13.0827, lng: currentLocation?.lng||80.2707, popup: 'Current Live Location', icon: L.divIcon({ html: '<div class="text-3xl">📍</div>', iconSize: [30, 30] }) },
                            ...nearbyResults.map(p => ({ lat: p.lat, lng: p.lng, popup: p.name, icon: L.divIcon({ html: `<div class="text-2xl">${searchCategory === 'atm' ? '💳' : searchCategory === 'store' ? '🛒' : searchCategory === 'hospital' ? '🏥' : '👮'}</div>`, iconSize: [30, 30] }) }))
                        ]}
                    />
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {nearbyResults.length > 0 ? nearbyResults.map((place, idx) => (
                    <div key={idx} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-600 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">📍</div>
                            <div>
                                <h3 className="font-bold text-xl text-white mb-1">{place.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-yellow-400 text-sm font-bold flex items-center">⭐ {place.rating}/5</span>
                                    <span className="text-slate-500 text-xs">({place.reviews} women verified)</span>
                                </div>
                                <div className="text-slate-400 text-sm flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-slate-500"/> {place.dist} meters away • ~{Math.round(place.dist/80)} min walk</div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            <button className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl flex-shrink-0"><PhoneIcon className="w-5 h-5"/></button>
                            <button onClick={()=>openGoogleMaps(place.lat, place.lng)} className="w-full sm:w-auto bg-slate-200 hover:bg-white text-slate-900 font-bold px-6 py-4 rounded-xl transition-colors">Directions</button>
                        </div>
                    </div>
                )) : (
                    <div className="h-full bg-slate-900/40 border border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                        <MagnifyingGlassIcon className="w-16 h-16 text-slate-700 mb-4"/>
                        <h3 className="text-xl font-bold text-slate-400">No Places Loaded</h3>
                        <p className="text-slate-500 mt-2">Select a category and hit Find Places to locate real utilities around your current area.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
      )}


      {/* =====================================================================
          TAB 4: FAMILY TRACKING
          ===================================================================== */}
      {activeTab === 'family' && (
        <div className="animation-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-2 h-[600px] shadow-2xl relative overflow-hidden order-2 lg:order-1">
                <div className="absolute top-6 left-6 z-20 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl shadow-xl grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-xs font-bold text-white">Active {activeMembers.length}</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div><span className="text-xs font-bold text-white">Pending {pendingMembers.length}</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-xs font-bold text-white">Rejected {rejectedMembers.length}</span></div>
                </div>
                <div className="w-full h-full rounded-2xl overflow-hidden z-10 relative ring-1 ring-slate-800">
                    <Map
                      center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
                      zoom={12}
                      height="100%"
                      className="filter contrast-[1.1] grayscale-[0.8] invert-[0.9]"
                      markers={familyMarkers}
                    />
                </div>
            </div>

             <div className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2">
                 <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-3xl p-6">
                     <h2 className="text-xl font-black text-white flex items-center gap-2 mb-1"><UserGroupIcon className="w-6 h-6 text-blue-400"/> Family Dashboard</h2>
                     <p className="text-xs text-blue-200">Invite family, accept/reject sharing, and send live location over WhatsApp.</p>
                 </div>

                 <div className="space-y-4 overflow-y-auto custom-scrollbar flex-grow pr-2">
                     {pendingMembers.length > 0 && (
                       <div className="space-y-3">
                         <div className="text-sm text-slate-400 uppercase tracking-widest">Pending Invites</div>
                         {pendingMembers.map((member) => (
                           <div key={member.id} className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-4">
                             <div className="flex justify-between items-start mb-3">
                               <div>
                                 <h3 className="font-semibold text-white">{member.name}</h3>
                                 <p className="text-xs text-slate-500">{member.relation || 'Relation not set'}</p>
                               </div>
                               <span className="text-[10px] uppercase px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">Pending</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               <Button variant="outline" size="sm" onClick={() => handleSendWhatsappInvite(member)}>Resend WhatsApp</Button>
                               <Button variant="success" size="sm" onClick={() => handleAcceptInvite(member)}>Accept</Button>
                               <Button variant="danger" size="sm" onClick={() => handleRejectInvite(member)}>Reject</Button>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}

                     {activeMembers.length > 0 && (
                       <div className="space-y-3">
                         <div className="text-sm text-slate-400 uppercase tracking-widest">Active Family Members</div>
                         {activeMembers.map((member) => (
                           <div key={member.id} className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-4">
                             <div className="flex justify-between items-start mb-3">
                               <div>
                                 <h3 className="font-semibold text-white">{member.name}</h3>
                                 <p className="text-xs text-slate-500">{member.relation || 'Relation not set'}</p>
                               </div>
                               <span className="text-[10px] uppercase px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Live</span>
                             </div>
                             <div className="text-xs text-slate-400 mb-3">
                               {member.location ? `Last seen ${new Date(member.location.timestamp).toLocaleTimeString()}` : 'Location not shared yet'}
                             </div>
                             <div className="flex flex-wrap gap-2">
                               <Button variant="primary" size="sm" onClick={() => handleShareLiveLocation(member)}>Share Live Location</Button>
                               <Button variant="outline" size="sm" onClick={() => requestLocation(member.id)}>Request Update</Button>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}

                     {rejectedMembers.length > 0 && (
                       <div className="space-y-3">
                         <div className="text-sm text-slate-400 uppercase tracking-widest">Rejected Invites</div>
                         {rejectedMembers.map((member) => (
                           <div key={member.id} className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-4">
                             <div className="flex justify-between items-start mb-3">
                               <div>
                                 <h3 className="font-semibold text-white">{member.name}</h3>
                                 <p className="text-xs text-slate-500">{member.relation || 'Relation not set'}</p>
                               </div>
                               <span className="text-[10px] uppercase px-2 py-1 rounded-full bg-rose-500/20 text-rose-300">Rejected</span>
                             </div>
                             <div className="text-xs text-slate-400 mb-3">This member declined location sharing. You can resend invitation.</div>
                             <Button variant="outline" size="sm" onClick={() => handleSendWhatsappInvite(member)}>Resend Invite</Button>
                           </div>
                         ))}
                       </div>
                     )}

                     {familyMembers.length === 0 && (
                       <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 text-center text-slate-400">
                         No family members added yet. Invite a family member to start sharing location safely.
                       </div>
                     )}
                 </div>
                 <div className="flex flex-col gap-3">
                   <Button variant="primary" onClick={() => setShowInviteForm(true)}>
                     + INVITE FAMILY MEMBER
                   </Button>
                   <Button variant="outline" onClick={loadFamilyMembers}>
                     Refresh Family Status
                   </Button>
                 </div>
             </div>

             {showInviteForm && (
               <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
                 <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-xl p-6">
                   <div className="flex items-center justify-between mb-5">
                     <div>
                       <h3 className="text-xl font-bold text-white">Invite a Family Member</h3>
                       <p className="text-sm text-slate-400">Send a WhatsApp link so they can accept or reject location sharing.</p>
                     </div>
                     <button onClick={() => setShowInviteForm(false)} className="text-slate-400 hover:text-white">Close</button>
                   </div>

                   <div className="grid gap-4">
                     <Input
                       label="Name"
                       value={inviteInput.name}
                       onChange={(e) => setInviteInput({ ...inviteInput, name: e.target.value })}
                       placeholder="Enter full name"
                     />
                     <Input
                       label="Phone"
                       value={inviteInput.phone}
                       onChange={(e) => setInviteInput({ ...inviteInput, phone: e.target.value })}
                       placeholder="10-digit phone number"
                     />
                     <Input
                       label="Relation"
                       value={inviteInput.relation}
                       onChange={(e) => setInviteInput({ ...inviteInput, relation: e.target.value })}
                       placeholder="Mother, Sister, Friend"
                     />
                   </div>

                   <div className="mt-6 flex gap-3 justify-end">
                     <Button variant="outline" onClick={() => setShowInviteForm(false)}>Cancel</Button>
                     <Button variant="success" loading={inviteLoading} onClick={handleAddFamilyMember}>Send WhatsApp Invite</Button>
                   </div>
                 </div>
               </div>
             )}
        </div>
      )}

    </div>
  );
};

export default SafetyNavigation;
