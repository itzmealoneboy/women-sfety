import { useState, useEffect } from 'react';
import L from 'leaflet';
import { useLocationStore } from '../../store/locationsstore';
import Map from '../../components/common/Map';
import {
    BuildingOffice2Icon, PhoneIcon, StarIcon, ShieldCheckIcon,
    VideoCameraIcon, LockClosedIcon, CheckBadgeIcon, ExclamationTriangleIcon,
    CreditCardIcon, DocumentCheckIcon, SparklesIcon, MapPinIcon, HomeIcon, DevicePhoneMobileIcon,
    ChevronRightIcon, ArrowRightIcon, TicketIcon, UserGroupIcon, HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const HotelSafety = () => {
    const { currentLocation } = useLocationStore();

    const [phase, setPhase] = useState('pre-booking'); // booking | verification | during-stay

    // Booking System State
    const [bookingSearch, setBookingSearch] = useState('');
    const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Mock Data for "Safe-Only" Hotels
    const safeHotels = [
        {
            id: 1,
            name: "SAKHI RESIDENCE - WOMEN ONLY",
            safetyScore: 99,
            historicalCases: 0,
            womenOnly: true,
            district: "Chennai Central",
            price: "₹2,500/night",
            rooms: [
                { id: "101", type: "Platinum Safe", floor: "1st", features: ["Panic Button", "Anti-Spy Scan"] },
                { id: "204", type: "Gold Secure", floor: "2nd", features: ["Biometric Lock"] },
                { id: "402", type: "Elite Witness", floor: "4th", features: ["24/7 Hallway AI Cam"] }
            ],
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "THE HERITAGE SECURE INN",
            safetyScore: 97,
            historicalCases: 0,
            womenOnly: true,
            district: "Coimbatore South",
            price: "₹1,800/night",
            rooms: [
                { id: "505", type: "Safe Haven", floor: "5th", features: ["Verified Doorbell Cam"] },
                { id: "508", type: "Safe Haven", floor: "5th", features: ["Double Bolt Lock"] }
            ],
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400"
        }
    ];

    // Pre-booking / Verification State
    const [searchQuery, setSearchQuery] = useState('');
    const [scannedHotel, setScannedHotel] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // Detailed Verification Form
    const [hotelDetails, setHotelDetails] = useState({
        hotelName: '',
        street: '',
        district: '',
        subPlace: '',
        mobileNumber: '',
        fullAddress: '',
        roomNumber: ''
    });

    // During stay
    const [checkedIn, setCheckedIn] = useState(false);
    const [safetyChecklist, setSafetyChecklist] = useState({
        cameraCheck: false,
        deadbolt: false,
        windows: false,
        balcony: false
    });
    const [safetyReports, setSafetyReports] = useState([
        { id: 1, hotel: "Grand Plaza", date: "2024-04-10", status: "Verified Safe", notes: "No issues with room sweep." },
        { id: 2, hotel: "City Stay", date: "2024-03-25", status: "Minor Concern", notes: "Window latch was loose, reported and fixed." }
    ]);
    const [staffAtDoor, setStaffAtDoor] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHotelDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleScanHotel = () => {
        if (!searchQuery) return toast.error("Enter hotel name to scan its safety records.");
        setIsScanning(true);
        setTimeout(() => {
            setScannedHotel({
                name: searchQuery,
                safetyScore: 96,
                areaScore: 88,
                incidentsLast30: 0,
                historicalCases: 0,
                hiddenCameraCases: 0,
                ownerContact: "+91-9080660562",
                ownerVerified: true,
                roomsAvailable: 4,
                womenOnlyRoomsAvailable: true,
                womenOnlyFloor: "4th Floor (Restricted Access)",
                securityAuditDate: "2024-03-10",
                reviews: "Highly recommended for women travelers. Solid security and respectful staff.",
                policeDist: "1.2 km",
                hospDist: "0.8 km",
                streetLight: "Verified High-Intensity",
                noHiddenCameras: true,
                deadboltVerified: true,
                balconySecurity: "Reinforced"
            });
            setHotelDetails(prev => ({ ...prev, hotelName: searchQuery }));
            setIsScanning(false);
            toast.success("Hotel Security Clearance Fetched.");
        }, 1500);
    };

    const triggerSafetyAlerts = () => {
        const alerts = [
            "SCAN FOR HIDDEN CAMERAS: Use your phone's flashlight to check for lens reflections.",
            "VERIFY DEADBOLT: Ensure the deadbolt is fully functional.",
            "WINDOW LOCKS: Check all windows and balcony doors.",
            "BALCONY SECURITY: Verify no shared access."
        ];
        
        alerts.forEach((msg, index) => {
            setTimeout(() => {
                toast(msg, {
                    icon: '🚨',
                    duration: 6000,
                    style: {
                        borderRadius: '10px',
                        background: '#1f2937',
                        color: '#fff',
                        border: '1px solid #ef4444'
                    },
                });
            }, index * 2000);
        });
    };

    const handleCheckIn = () => {
        const { hotelName, roomNumber, mobileNumber, district } = hotelDetails;
        if (!hotelName || !roomNumber || !mobileNumber || !district) {
            return toast.error("Please fill all hotel details and room number to verify your check-in.");
        }
        
        setCheckedIn(true);
        setPhase('during-stay');
        toast.success(`Check-In Verified for ${hotelName}. Tracking Started.`);
        toast.success(`Emergency SMS sent: "Safe at ${hotelName}, Room ${roomNumber}, ${district}"`);
        
        triggerSafetyAlerts();

        setTimeout(() => {
            setStaffAtDoor(true);
        }, 15000);
    };

    const handleOnlineBooking = () => {
        if (!selectedRoom || !selectedHotelForBooking) return toast.error("Please select a safe room first.");
        
        setHotelDetails({
            hotelName: selectedHotelForBooking.name,
            roomNumber: selectedRoom.id,
            district: selectedHotelForBooking.district,
            fullAddress: "Verified Safe SAKHI Location",
            mobileNumber: "+91-9999999999",
            street: "Secure Main Road",
            subPlace: "High-Light Zone"
        });
        
        toast.success(`Online Booking Confirmed: Room ${selectedRoom.id} at ${selectedHotelForBooking.name}`);
        setPhase('pre-booking');
    };

    const toggleChecklist = (key) => setSafetyChecklist(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="bg-[#0f111a] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-32 font-sans text-gray-200">

            {/* Premium Header */}
            <div className="pb-10 pt-6 border-b border-white/5 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <BuildingOffice2Icon className="w-10 h-10 text-purple-400" />
                        </div>
                        SAKHI HOTEL SECURE
                    </h1>
                    <p className="text-gray-500 mt-3 font-medium max-w-xl">
                        AI-powered hotel verification & online booking. Book only women-certified hotels with zero historical cases.
                    </p>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-[20px] border border-white/5 backdrop-blur-md">
                    <button onClick={() => setPhase('booking')} className={`px-6 py-2.5 rounded-2xl font-black text-xs tracking-widest transition-all uppercase ${phase === 'booking' ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}>Book Online</button>
                    <button onClick={() => setPhase('pre-booking')} className={`px-6 py-2.5 rounded-2xl font-black text-xs tracking-widest transition-all uppercase ${phase === 'pre-booking' ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}>Verification</button>
                    <button onClick={() => setPhase('during-stay')} className={`px-6 py-2.5 rounded-2xl font-black text-xs tracking-widest transition-all uppercase ${phase === 'during-stay' ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' : 'text-gray-500 hover:text-white'}`}>Live Stay</button>
                </div>
            </div>

            {phase === 'booking' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 border border-white/10 p-12 rounded-[50px] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <ShieldCheckIcon className="w-64 h-64 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Zero-Case Safe Marketplace</h2>
                        <p className="text-gray-400 font-medium max-w-2xl mx-auto">
                            We only list hotels that have passed the SAKHI 3-Tier Security Audit. 
                            <span className="text-green-400 block mt-2">✓ 0 Historical Cases ✓ Women-Only Floors ✓ 24/7 Verified Staff</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest px-4 border-l-4 border-purple-500">Safe Hotels Available</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {safeHotels.map(hotel => (
                                    <div key={hotel.id} 
                                        onClick={() => setSelectedHotelForBooking(hotel)}
                                        className={`bg-white/5 border-2 rounded-[40px] overflow-hidden group cursor-pointer transition-all ${selectedHotelForBooking?.id === hotel.id ? 'border-purple-500 scale-[1.02] shadow-2xl shadow-purple-500/20' : 'border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="h-48 relative">
                                            <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Safe Stay</span>
                                            </div>
                                            <div className="absolute bottom-4 left-4 bg-purple-600 px-4 py-1.5 rounded-xl text-white font-black text-xs">
                                                {hotel.price}
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-lg font-black text-white uppercase leading-tight group-hover:text-purple-400 transition-colors">{hotel.name}</h4>
                                                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-black border border-green-500/20">
                                                    {hotel.safetyScore}%
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">0 Past Cases</span>
                                                <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-2 py-1 rounded-md border border-pink-500/20">Women Only</span>
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">{hotel.district}</span>
                                            </div>
                                            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest group-hover:bg-purple-600 group-hover:border-purple-600 transition-all">Select Safe Room</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl sticky top-24">
                                <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Secure Checkout</h3>
                                {selectedHotelForBooking ? (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        <div className="p-6 bg-purple-500/5 rounded-3xl border border-purple-500/20">
                                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Booking for</p>
                                            <p className="text-lg font-black text-white">{selectedHotelForBooking.name}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Choose Your Secure Room</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedHotelForBooking.rooms.map(room => (
                                                    <button 
                                                        key={room.id}
                                                        onClick={() => setSelectedRoom(room)}
                                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedRoom?.id === room.id ? 'bg-green-500/10 border-green-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-lg font-black text-white">ROOM {room.id}</span>
                                                            <span className="text-[9px] font-black text-green-400 uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Available</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{room.type} • Floor {room.floor}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {room.features.map((f, i) => (
                                                                <span key={i} className="text-[8px] font-black text-purple-400 uppercase">{f}</span>
                                                            ))}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-gray-500 text-sm font-bold uppercase">Total Security Fee</span>
                                                <span className="text-xl font-black text-white">{selectedHotelForBooking.price}</span>
                                            </div>
                                            <button 
                                                onClick={handleOnlineBooking}
                                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all"
                                            >
                                                Confirm Online Booking
                                            </button>
                                            <p className="text-[9px] text-gray-600 font-bold uppercase mt-4 text-center">🔐 Encrypted Payment via SAKHI Secure UPI</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <TicketIcon className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                                        <p className="text-sm text-gray-600 font-bold uppercase">Select a hotel to view secure room options</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'pre-booking' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Form & Scan */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white">Security Verification</h2>
                                <span className="bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">Step 1 of 2</span>
                            </div>

                            <div className="relative mb-10 group">
                                <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    placeholder="Search Hotel by Name to Auto-Fetch..." 
                                    className="w-full bg-black/40 border-2 border-white/5 rounded-3xl px-8 py-5 text-white focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-600 font-bold" 
                                />
                                <button 
                                    onClick={handleScanHotel} 
                                    className="absolute right-3 top-3 bg-white text-black px-8 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
                                >
                                    {isScanning ? 'Syncing...' : 'Fetch AI Data'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Hotel Name *</label>
                                    <div className="relative">
                                        <BuildingOffice2Icon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input name="hotelName" value={hotelDetails.hotelName} onChange={handleInputChange} placeholder="Enter Official Name" className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-purple-500/30 outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Mobile Number *</label>
                                    <div className="relative">
                                        <DevicePhoneMobileIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input name="mobileNumber" value={hotelDetails.mobileNumber} onChange={handleInputChange} placeholder="+91 00000 00000" className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-purple-500/30 outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Street Name</label>
                                    <div className="relative">
                                        <HomeIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input name="street" value={hotelDetails.street} onChange={handleInputChange} placeholder="Street / Road Name" className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-purple-500/30 outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Locality / Sub-Place</label>
                                    <div className="relative">
                                        <MapPinIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input name="subPlace" value={hotelDetails.subPlace} onChange={handleInputChange} placeholder="Area / Landmark" className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-purple-500/30 outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">District / State *</label>
                                    <div className="relative">
                                        <SparklesIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input name="district" value={hotelDetails.district} onChange={handleInputChange} placeholder="Enter District" className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-purple-500/30 outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Full Registered Address</label>
                                    <textarea name="fullAddress" value={hotelDetails.fullAddress} onChange={handleInputChange} placeholder="Complete address as per booking..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-purple-500/30 outline-none font-bold h-24 resize-none" />
                                </div>
                                <div className="space-y-2 md:col-span-2 mt-4 bg-purple-500/5 p-8 rounded-3xl border border-purple-500/10">
                                    <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Step 2: Check-in Details</h4>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Allocated Room #</label>
                                            <input name="roomNumber" value={hotelDetails.roomNumber} onChange={handleInputChange} placeholder="e.g. 402" className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-2xl text-center focus:border-purple-500 outline-none" />
                                        </div>
                                        <button onClick={handleCheckIn} className="flex-[2] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-purple-500/20">
                                            Verify & Confirm Check-In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Insights & Mapping */}
                    <div className="lg:col-span-5 space-y-8">
                        {scannedHotel ? (
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">AI Safety Scorecard</h3>
                                <div className="flex items-center gap-8 mb-10">
                                    <div className="relative">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * scannedHotel.safetyScore) / 100} className="text-purple-500 transition-all duration-1000" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-white">{scannedHotel.safetyScore}%</span>
                                            <span className="text-[8px] font-black text-gray-500 uppercase">Secure</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white uppercase">{scannedHotel.name}</h4>
                                        <div className="flex gap-1 mt-1"><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4 opacity-30" /></div>
                                        <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2"><CheckBadgeIcon className="w-4 h-4" /> 100% Women-Safe Environment</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Police Dist</p>
                                        <p className="text-sm font-black text-white">{scannedHotel.policeDist}</p>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Hospital Dist</p>
                                        <p className="text-sm font-black text-white">{scannedHotel.hospDist}</p>
                                    </div>
                                </div>

                                <div className="mt-8 bg-black/40 p-6 rounded-3xl border border-white/5">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Live Safety Vectors</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Hidden Camera Check', status: 'Passed', color: 'text-green-400' },
                                            { label: 'Staff Verification', status: 'Background Verified', color: 'text-green-400' },
                                            { label: 'Street Lighting', status: 'Verified Bright', color: 'text-purple-400' }
                                        ].map((vec, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs font-bold">
                                                <span className="text-gray-500">{vec.label}</span>
                                                <span className={vec.color}>{vec.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                             <div className="bg-white/5 backdrop-blur-3xl border-2 border-dashed border-white/10 rounded-[40px] p-20 text-center flex flex-col items-center justify-center h-full">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <ShieldCheckIcon className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-black text-gray-600 uppercase tracking-widest">Ready to Verify</h3>
                                <p className="text-sm text-gray-700 mt-2 font-medium">Auto-fetch or manually enter hotel details to start the security audit.</p>
                             </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl h-80 relative overflow-hidden">
                             <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Perimeter Radar</h3>
                             <div className="absolute inset-0 top-20">
                                <Map 
                                    center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [13.0827, 80.2707]}
                                    zoom={14}
                                    markers={[
                                        { lat: 13.0827, lng: 80.2707, popup: "Your Location" }
                                    ]}
                                    height="100%"
                                />
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'during-stay' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-b from-purple-900/50 to-black border border-purple-500/30 p-10 rounded-[40px] text-center shadow-2xl">
                            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 relative">
                                <div className="absolute inset-0 bg-purple-500/20 blur-2xl animate-pulse"></div>
                                <LockClosedIcon className="w-12 h-12 text-purple-300 relative z-10" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">ROOM {hotelDetails.roomNumber || '???'}</h3>
                            <p className="text-purple-400 text-xs font-black uppercase tracking-widest mt-2">{hotelDetails.hotelName}</p>
                            <p className="text-gray-500 text-[10px] font-bold mt-1">{hotelDetails.subPlace}, {hotelDetails.district}</p>
                            
                            <button className="mt-10 w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-3xl border-b-[6px] border-red-900 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-[0.3em] text-xs">PANIC SOS</button>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] text-center relative overflow-hidden backdrop-blur-md">
                            <div className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Scheduled Safety Pulse</div>
                            <div className="text-4xl font-black text-white mb-6 font-mono tracking-tighter">03:59:42</div>
                            <p className="text-xs text-gray-600 mb-8 font-medium">Automatic alert will be sent to your emergency contacts if not confirmed.</p>
                            <button className="bg-green-500/10 text-green-400 border border-green-500/30 py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest w-full hover:bg-green-500/20 transition-all">I AM SAFE</button>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        {staffAtDoor && (
                            <div className="bg-red-500/10 border-2 border-red-500/50 p-8 rounded-[40px] flex items-start gap-6 animate-in slide-in-from-top duration-500">
                                <div className="p-4 bg-red-500 rounded-2xl shadow-xl shadow-red-500/20">
                                    <ExclamationTriangleIcon className="w-10 h-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">Staff Presence Detected</h4>
                                    <p className="text-red-300 mt-2 font-medium">Motion sensor at door activated. Do not open until you verify the staff ID via the hotel app or call the reception.</p>
                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setStaffAtDoor(false)} className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Dismiss</button>
                                        <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Call Reception</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                                <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <DocumentCheckIcon className="w-6 h-6 text-purple-400" />
                                </div>
                                SECURE ROOM SWEEP
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'cameraCheck', icon: VideoCameraIcon, label: 'Hidden Camera Scan', desc: 'Scan mirrors & smoke detectors' },
                                    { key: 'deadbolt', icon: LockClosedIcon, label: 'Deadbolt Verification', desc: 'Check primary room lock' },
                                    { key: 'windows', icon: DocumentCheckIcon, label: 'Window Security', desc: 'Check latches & perimeter' },
                                    { key: 'balcony', icon: ShieldCheckIcon, label: 'Balcony Check', desc: 'Verify no shared access' }
                                ].map((item) => (
                                    <button 
                                        key={item.key}
                                        onClick={() => toggleChecklist(item.key)} 
                                        className={`flex items-start gap-4 p-6 rounded-3xl border-2 transition-all text-left group ${safetyChecklist[item.key] ? 'bg-green-500/10 border-green-500/50' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className={`p-3 rounded-2xl ${safetyChecklist[item.key] ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-black uppercase tracking-tight ${safetyChecklist[item.key] ? 'text-green-400' : 'text-gray-400'}`}>{item.label}</p>
                                            <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase">{item.desc}</p>
                                        </div>
                                        {safetyChecklist[item.key] && <CheckBadgeIcon className="w-6 h-6 text-green-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
                             <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Verification History</h3>
                                <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:underline">View All</button>
                             </div>
                             <div className="space-y-4">
                                {safetyReports.map(report => (
                                    <div key={report.id} className="bg-black/40 p-6 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-purple-500/30 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                                <BuildingOffice2Icon className="w-6 h-6 text-gray-600 group-hover:text-purple-400 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-black text-white uppercase tracking-tight">{report.hotel}</div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{report.date} • {report.notes}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${report.status === 'Verified Safe' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                {report.status}
                                            </span>
                                            <ChevronRightIcon className="w-4 h-4 text-gray-700 group-hover:text-white transition-all" />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #8b3dff; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default HotelSafety;
