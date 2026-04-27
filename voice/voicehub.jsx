import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  SpeakerWaveIcon,
  CommandLineIcon,
  LanguageIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ClockIcon,
  HeartIcon,
  ShieldCheckIcon,
  PhoneIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { MicrophoneIcon as MicrophoneIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const VoiceHub = () => {
  const navigate = useNavigate();
  const {
    isListening,
    lastCommand,
    confidence,
    transcript,
    supported,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    getVoices,
    setVoice
  } = useVoiceCommands({ language: 'en-US', autoStart: false });

  const [activeTab, setActiveTab] = useState('commands');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [favoriteCommands, setFavoriteCommands] = useState([]);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: 'commands', name: 'Voice Commands', icon: CommandLineIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
    { id: 'favorites', name: 'Favorites', icon: HeartIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
  ];

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'gu-IN', name: 'Gujarati' }
  ];

  const commandCategories = [
    {
      name: 'Main Dashboard Commands',
      icon: '🎯',
      commands: [
        { phrase: 'Sakhi Home / Sakhi Dashboard', action: 'Open Main Dashboard' },
        { phrase: 'Sakhi Open SOS / Sakhi Emergency', action: 'Open SOS Emergency page' },
        { phrase: 'Sakhi Open Silent / Sakhi Sakhi Mode', action: 'Open Silent Emergency Mode page' },
        { phrase: 'Sakhi Open Legal / Sakhi Lawyer', action: 'Open Legal Hub page' },
        { phrase: 'Sakhi Open Family / Sakhi Track Family', action: 'Open Family Tracking page' },
        { phrase: 'Sakhi Open UPI / Sakhi Fraud Check', action: 'Open UPI Fraud Protection page' },
        { phrase: 'Sakhi Open Voice Clone / Sakhi Fake Call', action: 'Open AI Voice Clone page' },
        { phrase: 'Sakhi Open Transport / Sakhi Cab Safety', action: 'Open Transport Safety page' },
        { phrase: 'Sakhi Open Wearable / Sakhi My Watch', action: 'Open Wearable Integration page' },
        { phrase: 'Sakhi Open Media / Sakhi Camera', action: 'Open Media Hub page' },
        { phrase: 'Sakhi Open Benefits / Sakhi Schemes', action: 'Open Benefits Hub page' },
        { phrase: 'Sakhi Open Literacy / Sakhi Learn', action: 'Open Digital Literacy page' },
        { phrase: 'Sakhi Open Navigation / Sakhi Map', action: 'Open Safety Navigation page' },
        { phrase: 'Sakhi Open Records / Sakhi My Documents', action: 'Open My Records Hub page' },
        { phrase: 'Sakhi Open Settings', action: 'Open Settings page' },
        { phrase: 'Sakhi Help / Sakhi What Can I Say', action: 'Open Voice Command Guide' }
      ]
    },
    {
      name: 'SOS Emergency Commands',
      icon: '🚨',
      commands: [
        { phrase: 'Sakhi Trigger SOS / Sakhi Send SOS', action: 'Start 10-second SOS countdown' },
        { phrase: 'Sakhi Cancel SOS / Sakhi I\'m Safe', action: 'Cancel SOS countdown' },
        { phrase: 'Sakhi Immediate SOS / Sakhi Police Now', action: 'Trigger SOS without countdown' },
        { phrase: 'Sakhi Share Location / Sakhi Send Location', action: 'Share live location to emergency contacts' },
        { phrase: 'Sakhi Call Police / Sakhi Dial 112', action: 'Directly call police' },
        { phrase: 'Sakhi Call Ambulance / Sakhi Dial 108', action: 'Directly call ambulance' },
        { phrase: 'Sakhi Call Women Helpline / Sakhi Dial 1091', action: 'Call women helpline' },
        { phrase: 'Sakhi Within SOS, Show Timer', action: 'Display remaining countdown time' },
        { phrase: 'Sakhi Within SOS, Cancel All', action: 'Cancel all pending SOS alerts' }
      ]
    },
    {
      name: 'Silent Emergency Mode Commands',
      icon: '🔇',
      commands: [
        { phrase: 'Sakhi Activate Silent / Sakhi Silent Mode', action: 'Activate silent emergency mode' },
        { phrase: 'Sakhi Shake Mode / Sakhi Pocket SOS', action: 'Trigger silent mode (as if phone shaken)' },
        { phrase: 'Sakhi Start Hidden Recording / Sakhi Record Now', action: 'Start hidden audio/video recording' },
        { phrase: 'Sakhi Stop Recording / Sakhi Stop Silent', action: 'Stop hidden recording' },
        { phrase: 'Sakhi Live Police Stream / Sakhi Police Live', action: 'Start live video stream to police' },
        { phrase: 'Sakhi Within Silent, Check Status', action: 'Check if silent mode is active' },
        { phrase: 'Sakhi Within Silent, Send Evidence', action: 'Send recorded evidence to police' }
      ]
    },
    {
      name: 'Legal Hub Commands',
      icon: '⚖️',
      commands: [
        { phrase: 'Sakhi Voice FIR / Sakhi Generate FIR', action: 'Start voice-to-FIR recording' },
        { phrase: 'Sakhi Download FIR / Sakhi Get FIR', action: 'Download generated FIR document' },
        { phrase: 'Sakhi Apply Legal Aid / Sakhi Free Lawyer', action: 'Open free legal aid application' },
        { phrase: 'Sakhi Lok Adalat / Sakhi Virtual Court', action: 'Open e-Lok Adalat virtual court' },
        { phrase: 'Sakhi Women Rights / Sakhi My Rights', action: 'Open women rights database' },
        { phrase: 'Sakhi AI Chatbot / Sakhi Ask Lawyer', action: 'Open AI legal chatbot' },
        { phrase: 'Sakhi DV Complaint / Sakhi Domestic Violence', action: 'Generate Domestic Violence complaint' },
        { phrase: 'Sakhi Within Legal, Name [your name]', action: 'Fill name in legal form' },
        { phrase: 'Sakhi Within Legal, Address [your address]', action: 'Fill address in legal form' },
        { phrase: 'Sakhi Within Legal, Complaint [say complaint]', action: 'Fill complaint description via voice' },
        { phrase: 'Sakhi Within Legal, Submit Application', action: 'Submit legal aid application' },
        { phrase: 'Sakhi Within Legal, Ask about [question]', action: 'Ask AI chatbot specific legal question' },
        { phrase: 'Sakhi Within Legal, Show FIR Preview', action: 'Display generated FIR for review' },
        { phrase: 'Sakhi Within Legal, Send to DLSA', action: 'Send application to District Legal Services Authority' }
      ]
    },
    {
      name: 'Family Tracking Commands',
      icon: '👨‍👩‍👧',
      commands: [
        { phrase: 'Sakhi Where is Mother / Sakhi Amma Location', action: 'Request location from mother' },
        { phrase: 'Sakhi Where is Father / Sakhi Appa Location', action: 'Request location from father' },
        { phrase: 'Sakhi Where is Sister / Sakhi Akka Location', action: 'Request location from sister' },
        { phrase: 'Sakhi Where is Brother / Sakhi Anna Location', action: 'Request location from brother' },
        { phrase: 'Sakhi Where is Husband', action: 'Request location from husband' },
        { phrase: 'Sakhi Share My Location / Sakhi Send My Location', action: 'Send your location to all family members' },
        { phrase: 'Sakhi Add Family Member', action: 'Open add family member form' },
        { phrase: 'Sakhi Remove Family Member', action: 'Open remove family member option' },
        { phrase: 'Sakhi Request All Locations', action: 'Send location request to all family members' },
        { phrase: 'Sakhi Within Family, Message Mother [message]', action: 'Send voice message to mother' },
        { phrase: 'Sakhi Within Family, Call Sister', action: 'Directly call sister' },
        { phrase: 'Sakhi Within Family, Show Mother Location', action: 'Display mother\'s location on map' },
        { phrase: 'Sakhi Within Family, Track All Members', action: 'Show all family members on map' },
        { phrase: 'Sakhi Within Family, Set Safe Zone [place]', action: 'Set safe zone for family alerts' }
      ]
    },
    {
      name: 'UPI Fraud Protection Commands',
      icon: '💳',
      commands: [
        { phrase: 'Sakhi Scan Message / Sakhi Check SMS', action: 'Scan clipboard/pasted SMS for fraud' },
        { phrase: 'Sakhi Report to 1930 / Sakhi Cyber Crime', action: 'Open dialer to call 1930' },
        { phrase: 'Sakhi Freeze Account / Sakhi Block Account', action: 'Open emergency account freeze guide' },
        { phrase: 'Sakhi Check UPI ID [upi id]', action: 'Check specific UPI ID for fraud reports' },
        { phrase: 'Sakhi Show Scam Alerts / Sakhi Recent Scams', action: 'Display latest scam alerts' },
        { phrase: 'Sakhi Report Fraud / Sakhi File Complaint', action: 'Open cyber crime complaint form' },
        { phrase: 'Sakhi Within UPI, Scan This Message [message]', action: 'Read out message and scan for fraud' },
        { phrase: 'Sakhi Within UPI, Check Transaction [amount]', action: 'Check transaction safety for given amount' },
        { phrase: 'Sakhi Within UPI, Call Bank Helpline', action: 'Dial bank customer care number' },
        { phrase: 'Sakhi Within UPI, Show Safety Tips', action: 'Display UPI safety tips' }
      ]
    },
    {
      name: 'AI Voice Clone Commands',
      icon: '🎙️',
      commands: [
        { phrase: 'Sakhi Record My Voice / Sakhi Start Recording', action: 'Start 5-minute voice recording' },
        { phrase: 'Sakhi Stop Recording / Sakhi Finish Recording', action: 'Stop voice recording' },
        { phrase: 'Sakhi Clone My Voice / Sakhi Create Clone', action: 'Start AI voice cloning process' },
        { phrase: 'Sakhi Schedule Call / Sakhi Set Reminder', action: 'Open schedule call form' },
        { phrase: 'Sakhi Test Call Now', action: 'Trigger immediate test call' },
        { phrase: 'Sakhi My Scheduled Calls / Sakhi Show Reminders', action: 'Show list of scheduled calls' },
        { phrase: 'Sakhi Delete My Voice / Sakhi Remove Clone', action: 'Delete cloned voice data' },
        { phrase: 'Sakhi Within Voice, Call Mother at [time]', action: 'Schedule call to mother at specific time' },
        { phrase: 'Sakhi Within Voice, Message [your message]', action: 'Set custom message for fake call' },
        { phrase: 'Sakhi Within Voice, Call in Tamil', action: 'Set call language to Tamil' },
        { phrase: 'Sakhi Within Voice, Cancel Call [id]', action: 'Cancel specific scheduled call' }
      ]
    },
    {
      name: 'Transport Safety Commands',
      icon: '🚖',
      commands: [
        { phrase: 'Sakhi Start Trip / Sakhi Track Cab', action: 'Start cab tracking with current location' },
        { phrase: 'Sakhi Share Cab Details', action: 'Share driver name and cab number to family' },
        { phrase: 'Sakhi Enable Route Alert / Sakhi Deviation Alert', action: 'Enable route deviation monitoring' },
        { phrase: 'Sakhi Destination [place] / Sakhi Go to [place]', action: 'Set destination for trip' },
        { phrase: 'Sakhi Share ETA / Sakhi Tell Arrival Time', action: 'Share estimated arrival time to family' },
        { phrase: 'Sakhi End Trip / Sakhi Stop Tracking', action: 'Stop cab tracking' },
        { phrase: 'Sakhi Find Bus / Sakhi Public Transport', action: 'Open public transport tracker' },
        { phrase: 'Sakhi Last Vehicle Time / Sakhi Last Bus', action: 'Check last bus/train time' },
        { phrase: 'Sakhi Within Transport, Driver Name [name]', action: 'Enter driver name via voice' },
        { phrase: 'Sakhi Within Transport, Cab Number [number]', action: 'Enter cab number via voice' },
        { phrase: 'Sakhi Within Transport, Alert Family Now', action: 'Send current location to family immediately' }
      ]
    },
    {
      name: 'Wearable Integration Commands',
      icon: '⌚',
      commands: [
        { phrase: 'Sakhi Scan Devices / Sakhi Find Watch', action: 'Start Bluetooth device scanning' },
        { phrase: 'Sakhi Connect Watch / Sakhi Pair Device', action: 'Connect to nearest Bluetooth watch' },
        { phrase: 'Sakhi Disconnect Watch', action: 'Disconnect current wearable device' },
        { phrase: 'Sakhi My Heart Rate / Sakhi Check Pulse', action: 'Read current heart rate aloud' },
        { phrase: 'Sakhi My Steps Today / Sakhi Step Count', action: 'Read step count aloud' },
        { phrase: 'Sakhi Battery Level / Sakhi Watch Battery', action: 'Read watch battery percentage' },
        { phrase: 'Sakhi Enable Fall Detection', action: 'Turn on fall detection mode' },
        { phrase: 'Sakhi Disable Fall Detection', action: 'Turn off fall detection' },
        { phrase: 'Sakhi Within Wearable, Show Health Graph', action: 'Display heart rate trend graph' },
        { phrase: 'Sakhi Within Wearable, Set Alert at [bpm]', action: 'Set heart rate alert threshold' },
        { phrase: 'Sakhi Within Wearable, Test Fall Detection', action: 'Simulate fall to test detection' }
      ]
    },
    {
      name: 'Media Hub Commands',
      icon: '📷',
      commands: [
        { phrase: 'Sakhi Open Camera / Sakhi Take Photo', action: 'Open camera and prepare to capture' },
        { phrase: 'Sakhi Capture Evidence / Sakhi Click Photo', action: 'Capture photo with evidence tag' },
        { phrase: 'Sakhi Open Gallery / Sakhi My Photos', action: 'Open secure gallery' },
        { phrase: 'Sakhi Delete Last Photo', action: 'Delete most recent photo' },
        { phrase: 'Sakhi Check Deepfake / Sakhi Verify Image', action: 'Open AI deepfake detection' },
        { phrase: 'Sakhi Record Video / Sakhi Start Video', action: 'Start video recording for evidence' },
        { phrase: 'Sakhi Stop Video / Sakhi End Video', action: 'Stop video recording' },
        { phrase: 'Sakhi Within Media, Tag as Evidence', action: 'Tag current photo as evidence' },
        { phrase: 'Sakhi Within Media, Share Photo', action: 'Share current photo via WhatsApp' },
        { phrase: 'Sakhi Within Media, Upload to Case', action: 'Upload photo to active legal case' }
      ]
    },
    {
      name: 'Benefits Hub Commands',
      icon: '🎁',
      commands: [
        { phrase: 'Sakhi Show PMMVY / Sakhi Maternity Scheme', action: 'Display PMMVY scheme details' },
        { phrase: 'Sakhi Show Sukanya / Sakhi Girl Child Scheme', action: 'Display Sukanya Samriddhi details' },
        { phrase: 'Sakhi Show Ujjwala / Sakhi Gas Scheme', action: 'Display Ujjwala Yojana details' },
        { phrase: 'Sakhi Show Widow Pension', action: 'Display Widow Pension scheme details' },
        { phrase: 'Sakhi Check Scholarship / Sakhi NSP', action: 'Open National Scholarship Portal' },
        { phrase: 'Sakhi Check Eligibility', action: 'Open eligibility checker' },
        { phrase: 'Sakhi Apply Now / Sakhi Submit Application', action: 'Start application for displayed scheme' },
        { phrase: 'Sakhi Within Benefits, Filter by [category]', action: 'Filter schemes by category (SC/ST/OBC/Widow)' },
        { phrase: 'Sakhi Within Benefits, Download Form', action: 'Download scheme application form' },
        { phrase: 'Sakhi Within Benefits, Save for Later', action: 'Save scheme for later reference' }
      ]
    },
    {
      name: 'Digital Literacy Commands',
      icon: '📚',
      commands: [
        { phrase: 'Sakhi Start Learning / Sakhi Begin Course', action: 'Start first training module' },
        { phrase: 'Sakhi Module 1 / Sakhi Smartphone Basics', action: 'Start smartphone basics module' },
        { phrase: 'Sakhi Module 2 / Sakhi UPI Safety', action: 'Start UPI safety training' },
        { phrase: 'Sakhi Module 3 / Sakhi Social Media', action: 'Start social media security module' },
        { phrase: 'Sakhi Module 4 / Sakhi Cyber Crime', action: 'Start cybercrime reporting module' },
        { phrase: 'Sakhi Take Quiz / Sakhi Test Me', action: 'Start knowledge quiz' },
        { phrase: 'Sakhi My Progress / Sakhi Certificate', action: 'Show learning progress and certificates' },
        { phrase: 'Sakhi Within Literacy, Answer [option]', action: 'Select answer for quiz question' },
        { phrase: 'Sakhi Within Literacy, Next Module', action: 'Move to next training module' },
        { phrase: 'Sakhi Within Literacy, Repeat Last', action: 'Repeat last training section' }
      ]
    },
    {
      name: 'Safety Navigation Commands',
      icon: '🗺️',
      commands: [
        { phrase: 'Sakhi Find Police / Sakhi Nearest Police', action: 'Show nearest police station on map' },
        { phrase: 'Sakhi Find Hospital / Sakhi Nearest Hospital', action: 'Show nearest hospital on map' },
        { phrase: 'Sakhi Find ATM / Sakhi Nearest ATM', action: 'Show nearest ATM on map' },
        { phrase: 'Sakhi Find Pharmacy / Sakhi Medical Store', action: 'Show nearest pharmacy on map' },
        { phrase: 'Sakhi Find Shelter / Sakhi Women Shelter', action: 'Show nearest women shelter on map' },
        { phrase: 'Sakhi Escape Route / Sakhi Safe Path', action: 'Show safest escape route from current location' },
        { phrase: 'Sakhi Show CCTV / Sakhi Cameras Near Me', action: 'Show nearby CCTV camera locations' },
        { phrase: 'Sakhi Within Navigation, Directions to Police', action: 'Get turn-by-turn directions to police station' },
        { phrase: 'Sakhi Within Navigation, Share Route', action: 'Share planned route with family' },
        { phrase: 'Sakhi Within Navigation, Zoom In / Zoom Out', action: 'Control map zoom level' }
      ]
    },
    {
      name: 'My Records Hub Commands',
      icon: '📁',
      commands: [
        { phrase: 'Sakhi Show Documents / Sakhi My Files', action: 'Display all uploaded documents' },
        { phrase: 'Sakhi Upload Document', action: 'Open document upload form' },
        { phrase: 'Sakhi Track Complaint / Sakhi Complaint Status', action: 'Open complaint tracker' },
        { phrase: 'Sakhi My FIRs / Sakhi My Cases', action: 'Show all filed FIRs and legal cases' },
        { phrase: 'Sakhi Search by ID [id] / Sakhi Find Case [id]', action: 'Search for specific case by ID' },
        { phrase: 'Sakhi Within Records, Download [filename]', action: 'Download specific document' },
        { phrase: 'Sakhi Within Records, Delete [filename]', action: 'Delete specific document' },
        { phrase: 'Sakhi Within Records, Share [filename]', action: 'Share document with family/lawyer' }
      ]
    },
    {
      name: 'Settings Commands',
      icon: '⚙️',
      commands: [
        { phrase: 'Sakhi Change Language to Tamil', action: 'Switch app language to Tamil' },
        { phrase: 'Sakhi Change Language to English', action: 'Switch to English' },
        { phrase: 'Sakhi Change Language to Hindi', action: 'Switch to Hindi' },
        { phrase: 'Sakhi Enable Auto SOS / Sakhi Turn On Auto SOS', action: 'Turn on automatic SOS feature' },
        { phrase: 'Sakhi Disable Auto SOS / Sakhi Turn Off Auto SOS', action: 'Turn off automatic SOS' },
        { phrase: 'Sakhi Enable Silent Mode', action: 'Turn on silent mode' },
        { phrase: 'Sakhi Disable Silent Mode', action: 'Turn off silent mode' },
        { phrase: 'Sakhi Battery Saver On', action: 'Enable battery saver mode' },
        { phrase: 'Sakhi Battery Saver Off', action: 'Disable battery saver mode' },
        { phrase: 'Sakhi Add Contact [name] [phone]', action: 'Add emergency contact via voice' },
        { phrase: 'Sakhi Remove Contact [name]', action: 'Remove emergency contact' },
        { phrase: 'Sakhi Edit Profile / Sakhi My Profile', action: 'Open profile editor' },
        { phrase: 'Sakhi Within Settings, Save Changes', action: 'Save all settings changes' },
        { phrase: 'Sakhi Within Settings, Cancel Changes', action: 'Discard unsaved changes' },
        { phrase: 'Sakhi Within Settings, Delete My Data', action: 'Open data deletion confirmation' },
        { phrase: 'Sakhi Within Settings, Reset to Default', action: 'Reset all settings to default' }
      ]
    },
    {
      name: 'General & Utility Commands',
      icon: '🏠',
      commands: [
        { phrase: 'Sakhi Go Back / Sakhi Previous Page', action: 'Navigate to previous page' },
        { phrase: 'Sakhi Read Location / Sakhi Where Am I', action: 'Read current GPS coordinates aloud' },
        { phrase: 'Sakhi What Time Is It', action: 'Speak current time' },
        { phrase: 'Sakhi Battery Status / Sakhi Phone Battery', action: 'Speak phone battery percentage' },
        { phrase: 'Sakhi List Contacts / Sakhi Emergency Numbers', action: 'List all saved emergency contacts' },
        { phrase: 'Sakhi Read Notifications', action: 'Read recent app notifications' },
        { phrase: 'Sakhi Mute Voice / Sakhi Stop Speaking', action: 'Mute voice feedback temporarily' },
        { phrase: 'Sakhi Unmute Voice', action: 'Unmute voice feedback' },
        { phrase: 'Sakhi Help / Sakhi Commands', action: 'Open full voice command guide' }
      ]
    },
    {
      name: 'Command Chaining Examples',
      icon: '🔄',
      commands: [
        { phrase: 'Sakhi Open SOS and Share Location and Call Mother', action: 'Opens SOS page + Shares location + Calls mother' },
        { phrase: 'Sakhi Activate Silent and Start Recording', action: 'Activates silent mode + Starts hidden recording' },
        { phrase: 'Sakhi Within Legal, Name Priya and Generate FIR', action: 'Fills name + Generates FIR document' },
        { phrase: 'Sakhi Find Police and Show Directions', action: 'Finds nearest police + Shows directions' },
        { phrase: 'Sakhi Open Camera and Capture Evidence and Save', action: 'Opens camera + Captures photo + Saves as evidence' },
        { phrase: 'Sakhi Track Cab and Share Details and Alert Family', action: 'Starts cab tracking + Shares details + Alerts family' }
      ]
    },
    {
      name: 'Scheduled Commands',
      icon: '📋',
      commands: [
        { phrase: 'Sakhi After 5 minutes, share my location', action: 'Shares location after 5 minutes' },
        { phrase: 'Sakhi After 10 minutes, check if I\'m safe', action: 'Sends safety check-in after 10 minutes' },
        { phrase: 'Sakhi At 8 PM, remind me to call mother', action: 'Sets reminder for 8 PM' },
        { phrase: 'Sakhi Tomorrow at 9 AM, start silent mode', action: 'Schedules silent mode for tomorrow' },
        { phrase: 'Sakhi Every day at 10 PM, share location', action: 'Sets daily location sharing' }
      ]
    },
    {
      name: 'Voice FIR Commands',
      icon: '📝',
      commands: [
        { phrase: 'Start listening / Start recording', action: 'Begins voice recording' },
        { phrase: 'Stop recording / Stop listening', action: 'Ends voice recording' },
        { phrase: 'Cancel', action: 'Stops current recording' },
        { phrase: 'My husband beats me daily', action: 'Captures domestic violence complaint' },
        { phrase: 'I need police help', action: 'Captures emergency assistance request' },
        { phrase: 'Someone is harassing me', action: 'Captures harassment complaint' },
        { phrase: 'My money was stolen', action: 'Captures theft complaint' },
        { phrase: 'I was assaulted', action: 'Captures assault complaint' },
        { phrase: 'Help me please', action: 'Captures general distress call' },
        { phrase: 'There is a fight at my home', action: 'Captures domestic dispute' },
        { phrase: 'Someone followed me', action: 'Captures stalking complaint' },
        { phrase: 'I lost my important documents', action: 'Captures lost item report' },
        { phrase: 'There is an emergency', action: 'General emergency alert' },
        { phrase: 'Translate to English / Convert to English', action: 'Converts text to English' },
        { phrase: 'Show in English', action: 'Displays FIR in English' },
        { phrase: 'Save to complaint / Save this', action: 'Saves text into FIR form' },
        { phrase: 'Fill my name', action: 'Auto-fills complainant name field' },
        { phrase: 'Clear form / Reset everything', action: 'Erases all form data' },
        { phrase: 'Submit FIR / Register my case', action: 'Submits the complaint to registry' },
        { phrase: 'File complaint / Send to police', action: 'Files the FIR officially' },
        { phrase: 'Show all cases / View registry', action: 'Displays all submitted FIRs' },
        { phrase: 'List my complaints', action: 'Displays all registered cases' },
        { phrase: 'Delete all cases', action: 'Clears entire registry' }
      ]
    }
  ];

  useEffect(() => {
    // Load available voices
    const availableVoices = getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
    }
  }, [getVoices]);

  useEffect(() => {
    // Add to command history when command received
    if (lastCommand) {
      setCommandHistory(prev => [
        {
          command: lastCommand,
          timestamp: new Date().toLocaleTimeString(),
          confidence
        },
        ...prev
      ].slice(0, 20));
    }
  }, [lastCommand, confidence]);

  // Execute actual capabilities automatically based on recognized speech
  useEffect(() => {
    if (!lastCommand || confidence < 0.3) return;
    
    const cmdStr = lastCommand.toLowerCase();

    if (cmdStr.includes('sos') || cmdStr.includes('emergency') || cmdStr.includes('help')) {
        toast.error('🚨 EMERGENCY VOICE COMMAND DETECTED! Deploying SOS protocol...', { duration: 5000 });
        navigate('/sos');
    } 
    else if (cmdStr.includes('police')) {
        toast.success('📞 Voice routing: Dialing Police (100)...');
        setTimeout(() => { window.location.href = 'tel:100'; }, 1000);
    } 
    else if (cmdStr.includes('15100') || cmdStr.includes('legal aid')) {
        toast.success('📞 Voice routing: Dialing Legal Aid (15100)...');
        setTimeout(() => { window.location.href = 'tel:15100'; }, 1000);
    } 
    else if (cmdStr.includes('rights') || cmdStr.includes('show right')) {
        toast.success('⚖️ Voice routing: Opening Legal Rights Toolkit...');
        navigate('/women-rights');
    }
    else if (cmdStr.includes('open safety navigation') || cmdStr.includes('show safety navigation') || cmdStr.includes('open safety')) {
        toast.success('🗺️ Opening Safety Navigation...');
        navigate('/safety-navigation');
    }
    else if (cmdStr.includes('open live tracking') || cmdStr.includes('live tracking')) {
        toast.success('📍 Opening Live Tracking...');
        navigate('/live-tracking');
    }
    else if (cmdStr.includes('open share location') || cmdStr.includes('share location')) {
        toast.success('📤 Opening Share Location...');
        navigate('/share-location');
    }
    else if (cmdStr.includes('open family tracking') || cmdStr.includes('family tracking')) {
        toast.success('👨‍👩‍👧 Opening Family Tracking...');
        navigate('/safety-navigation');
    }
    else if (cmdStr.includes('open dashboard') || cmdStr.includes('dashboard')) {
        toast.success('🏠 Opening Dashboard...');
        navigate('/dashboard');
    }
    else if (cmdStr.includes('open voice hub') || cmdStr.includes('voice hub')) {
        toast.success('🎤 Opening Voice Command Center...');
        navigate('/voice-hub');
    }
    else if (cmdStr.includes('open schedules') || cmdStr.includes('schedules') || cmdStr.includes('my schedule')) {
        toast.success('📅 Opening Schedules Hub...');
        navigate('/schedules');
    }
  }, [lastCommand, confidence, navigate]);

  const handleStartListening = () => {
    const started = startListening();
    if (started) {
      toast.success('Listening for voice commands...');
    }
  };

  const handleStopListening = () => {
    stopListening();
    toast.info('Voice recognition stopped');
  };

  const handleSpeak = (text) => {
    speak(text, {
      rate: speechRate,
      pitch: speechPitch,
      voice: voices.find(v => v.name === selectedVoice)
    });
  };

  const handleTestCommand = (command) => {
    speak(`Testing command: ${command}`);
    toast.success(`Command recognized: ${command}`);
  };

  const toggleFavorite = (command) => {
    if (favoriteCommands.includes(command)) {
      setFavoriteCommands(favoriteCommands.filter(c => c !== command));
      toast.info('Removed from favorites');
    } else {
      setFavoriteCommands([...favoriteCommands, command]);
      toast.success('Added to favorites');
    }
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    // In real app, reinitialize voice recognition with new language
    toast.success(`Language changed to ${languages.find(l => l.code === langCode)?.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🎤 Voice Command Center
          </h1>
          <p className="text-gray-600 mt-1">
            Control the app with your voice - Multilingual support
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/schedules')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <ClockIcon className="w-5 h-5" />
            📅 Schedules
          </button>

          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          {!supported ? (
            <div className="bg-danger/10 text-danger px-4 py-2 rounded-lg">
              Voice recognition not supported
            </div>
          ) : (
            <div className="flex gap-2">
              {!isListening ? (
                <Button
                  variant="primary"
                  onClick={handleStartListening}
                >
                  <MicrophoneIcon className="w-5 h-5 mr-2" />
                  Start Listening
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={handleStopListening}
                >
                  <StopIcon className="w-5 h-5 mr-2" />
                  Stop Listening
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card className={`bg-gradient-to-r ${
        isListening ? 'from-success to-green-600' : 'from-gray-500 to-gray-600'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isListening ? (
              <div className="flex gap-1">
                <div className="w-2 h-8 bg-white rounded-full animate-wave"></div>
                <div className="w-2 h-12 bg-white rounded-full animate-wave animation-delay-200"></div>
                <div className="w-2 h-6 bg-white rounded-full animate-wave animation-delay-400"></div>
                <div className="w-2 h-10 bg-white rounded-full animate-wave animation-delay-600"></div>
                <div className="w-2 h-8 bg-white rounded-full animate-wave animation-delay-800"></div>
              </div>
            ) : (
              <MicrophoneIconSolid className="w-8 h-8 opacity-75" />
            )}
            <div>
              <p className="text-lg font-bold">
                {isListening ? 'Listening...' : 'Voice Recognition Inactive'}
              </p>
              {isListening && transcript && (
                <p className="text-sm opacity-90 mt-1">Heard: "{transcript}"</p>
              )}
            </div>
          </div>

          {lastCommand && (
            <div className="text-right">
              <p className="text-sm opacity-75">Last Command</p>
              <p className="text-lg font-bold">{lastCommand}</p>
              <p className="text-xs opacity-75">Confidence: {Math.round(confidence * 100)}%</p>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Commands Tab */}
        {activeTab === 'commands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commandCategories.map((category, idx) => (
              <Card key={idx}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>

                <div className="space-y-2">
                  {category.commands.map((cmd, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group"
                    >
                      <div>
                        <p className="font-medium text-sm">"{cmd.phrase}"</p>
                        <p className="text-xs text-gray-500">{cmd.action}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTestCommand(cmd.phrase)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                          title="Test command"
                        >
                          <PlayIcon className="w-4 h-4 text-primary-500" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(cmd.phrase)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                          title="Add to favorites"
                        >
                          <HeartIcon className={`w-4 h-4 ${
                            favoriteCommands.includes(cmd.phrase) ? 'text-danger fill-current' : 'text-gray-400'
                          }`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Command History</h3>

            {commandHistory.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No command history yet</p>
                <p className="text-sm text-gray-400 mt-1">Start speaking to see commands here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commandHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">"{entry.command}"</p>
                      <p className="text-xs text-gray-500">{entry.timestamp}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.confidence > 0.8 ? 'bg-success/10 text-success' :
                      entry.confidence > 0.5 ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {Math.round(entry.confidence * 100)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Favorite Commands</h3>

            {favoriteCommands.length === 0 ? (
              <div className="text-center py-8">
                <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No favorite commands yet</p>
                <p className="text-sm text-gray-400 mt-1">Click the heart icon on commands to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {favoriteCommands.map((command, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <p className="font-medium">"{command}"</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTestCommand(command)}
                    >
                      <PlayIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Voice Selection */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SpeakerWaveIcon className="w-4 h-4 inline mr-1" />
                    Voice
                  </label>
                  <select
                    value={selectedVoice || ''}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {voices.map((voice, index) => (
                      <option key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Pitch: {speechPitch}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleSpeak('This is a test of your voice settings')}
                >
                  <SpeakerWaveIcon className="w-5 h-5 mr-2" />
                  Test Voice
                </Button>
              </div>
            </Card>

            {/* Language Settings */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Language Settings</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LanguageIcon className="w-4 h-4 inline mr-1" />
                    Recognition Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-primary-50 border border-primary-200">
              <h4 className="font-medium text-primary-800 mb-2">Voice Command Tips</h4>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Reduce background noise for better recognition</li>
                <li>• Use specific commands for best results</li>
                <li>• Emergency commands work even in low confidence</li>
                <li>• Test your voice settings regularly</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceHub;
