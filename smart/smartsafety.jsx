import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationsstore';
import { useAuthStore } from '../../store/authstores';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Map from '../../components/common/Map';
import {
  SunIcon,
  MoonIcon,
  CameraIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  WifiIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { SunIcon as SunIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const SmartSafety = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocationStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('night');
  const [nightMode, setNightMode] = useState(false);
  const [safetyScore, setSafetyScore] = useState(85);
  const [cctvCount, setCctvCount] = useState(12);
  const [policeCount, setPoliceCount] = useState(3);
  const [hospitalCount, setHospitalCount] = useState(2);
  const [wellLitPaths, setWellLitPaths] = useState(5);
  const [darkSpots, setDarkSpots] = useState(2);
  const [checkinTimer, setCheckinTimer] = useState(900); // 15 minutes in seconds
  const [checkinActive, setCheckinActive] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [nearbyCCTVs, setNearbyCCTVs] = useState([]);
  const [smartLights, setSmartLights] = useState([]);

  const tabs = [
    { id: 'night', name: 'Night Patrol', icon: MoonIcon },
    { id: 'smart', name: 'Smart City', icon: LightBulbIcon },
    { id: 'cctv', name: 'CCTV Network', icon: CameraIcon },
    { id: 'alerts', name: 'Live Alerts', icon: BellAlertIcon }
  ];

  useEffect(() => {
    // Simulate fetching smart city data
    loadSmartCityData();
    
    // Start check-in timer if active
    let timer;
    if (checkinActive) {
      timer = setInterval(() => {
        setCheckinTimer(prev => {
          if (prev <= 1) {
            handleMissedCheckin();
            return 900;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [checkinActive]);

  const loadSmartCityData = () => {
    // Mock CCTV locations
    const mockCCTVs = [
      { id: 1, lat: (currentLocation?.lat || 13.0827) + 0.002, lng: (currentLocation?.lng || 80.2707) + 0.003, name: 'Junction CCTV', status: 'active' },
      { id: 2, lat: (currentLocation?.lat || 13.0827) - 0.003, lng: (currentLocation?.lng || 80.2707) - 0.002, name: 'Market CCTV', status: 'active' },
      { id: 3, lat: (currentLocation?.lat || 13.0827) + 0.004, lng: (currentLocation?.lng || 80.2707) - 0.004, name: 'Bus Stop CCTV', status: 'active' },
      { id: 4, lat: (currentLocation?.lat || 13.0827) - 0.002, lng: (currentLocation?.lng || 80.2707) + 0.005, name: 'School CCTV', status: 'maintenance' },
      { id: 5, lat: (currentLocation?.lat || 13.0827) + 0.005, lng: (currentLocation?.lng || 80.2707) + 0.002, name: 'Hospital CCTV', status: 'active' }
    ];
    setNearbyCCTVs(mockCCTVs);

    // Mock smart lights
    const mockLights = [
      { id: 1, lat: (currentLocation?.lat || 13.0827) + 0.001, lng: (currentLocation?.lng || 80.2707) + 0.001, status: 'on', brightness: 80 },
      { id: 2, lat: (currentLocation?.lat || 13.0827) - 0.002, lng: (currentLocation?.lng || 80.2707) - 0.002, status: 'on', brightness: 60 },
      { id: 3, lat: (currentLocation?.lat || 13.0827) + 0.003, lng: (currentLocation?.lng || 80.2707) - 0.003, status: 'off', brightness: 0 },
      { id: 4, lat: (currentLocation?.lat || 13.0827) - 0.001, lng: (currentLocation?.lng || 80.2707) + 0.004, status: 'on', brightness: 100 }
    ];
    setSmartLights(mockLights);

    // Mock recent alerts
    const mockAlerts = [
      { id: 1, type: 'warning', message: 'Dark spot detected on Main Street', time: '5 min ago', severity: 'medium' },
      { id: 2, type: 'info', message: 'CCTV camera 3 is under maintenance', time: '15 min ago', severity: 'low' },
      { id: 3, type: 'success', message: 'New smart lights installed on Park Avenue', time: '1 hour ago', severity: 'low' },
      { id: 4, type: 'warning', message: 'Suspicious activity reported near junction', time: '2 hours ago', severity: 'high' }
    ];
    setRecentAlerts(mockAlerts);
  };

  const handleNightModeToggle = () => {
    setNightMode(!nightMode);
    if (!nightMode) {
      toast.info('Night mode activated - Enhanced safety monitoring');
    } else {
      toast.success('Night mode deactivated');
    }
  };

  const handleCheckinToggle = () => {
    setCheckinActive(!checkinActive);
    if (!checkinActive) {
      setCheckinTimer(900);
      toast.success('Auto check-in activated');
    } else {
      toast.info('Auto check-in deactivated');
    }
  };

  const handleCheckin = () => {
    setCheckinTimer(900);
    toast.success('Check-in confirmed! You are safe');
  };

  const handleMissedCheckin = () => {
    toast.error('⚠️ Missed check-in! Alert sent to emergency contacts', {
      duration: 5000,
      icon: '🚨'
    });
    setCheckinActive(false);
  };

  const reportDarkSpot = (lat, lng) => {
    toast.success('Dark spot reported to municipal corporation');
  };

  const requestPatrol = () => {
    toast.info('Police patrol requested to your location');
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'success': return CheckCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      default: return BellAlertIcon;
    }
  };

  const getAlertColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-danger bg-danger/10';
      case 'medium': return 'text-warning bg-warning/10';
      default: return 'text-primary-600 bg-primary-100';
    }
  };

  // Map markers
  const getMapMarkers = () => {
    const markers = [
      {
        lat: currentLocation?.lat || 13.0827,
        lng: currentLocation?.lng || 80.2707,
        popup: 'Your Location',
        icon: L.divIcon({
          html: '<i class="fas fa-user-circle text-success" style="font-size: 30px;"></i>',
          iconSize: [30, 30]
        })
      }
    ];

    if (activeTab === 'cctv') {
      nearbyCCTVs.forEach(cctv => {
        markers.push({
          lat: cctv.lat,
          lng: cctv.lng,
          popup: `${cctv.name} - ${cctv.status}`,
          icon: L.divIcon({
            html: `<i class="fas fa-video" style="color: ${
              cctv.status === 'active' ? '#4CAF50' : '#ff4757'
            }; font-size: 24px;"></i>`,
            iconSize: [24, 24]
          })
        });
      });
    }

    if (activeTab === 'smart') {
      smartLights.forEach(light => {
        markers.push({
          lat: light.lat,
          lng: light.lng,
          popup: `Smart Light - ${light.status}`,
          icon: L.divIcon({
            html: `<i class="fas fa-lightbulb" style="color: ${
              light.status === 'on' ? '#ffa502' : '#95a5a6'
            }; font-size: 24px;"></i>`,
            iconSize: [24, 24]
          })
        });
      });
    }

    return markers;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🌙 Smart Safety
          </h1>
          <p className="text-gray-600 mt-1">
            Night patrol • Smart city integration • Real-time monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={nightMode ? 'success' : 'outline'}
            onClick={handleNightModeToggle}
          >
            {nightMode ? (
              <>
                <MoonIcon className="w-5 h-5 mr-2" />
                Night Mode Active
              </>
            ) : (
              <>
                <SunIcon className="w-5 h-5 mr-2" />
                Activate Night Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <ShieldCheckIcon className="w-6 h-6 mx-auto text-primary-500 mb-1" />
          <p className="text-xl font-bold text-gray-800">{safetyScore}%</p>
          <p className="text-xs text-gray-600">Safety Score</p>
        </Card>
        <Card className="text-center">
          <CameraIcon className="w-6 h-6 mx-auto text-success mb-1" />
          <p className="text-xl font-bold text-gray-800">{cctvCount}</p>
          <p className="text-xs text-gray-600">CCTV Cameras</p>
        </Card>
        <Card className="text-center">
          <BuildingLibraryIcon className="w-6 h-6 mx-auto text-warning mb-1" />
          <p className="text-xl font-bold text-gray-800">{policeCount}</p>
          <p className="text-xs text-gray-600">Police Stations</p>
        </Card>
        <Card className="text-center">
          <LightBulbIcon className="w-6 h-6 mx-auto text-primary-500 mb-1" />
          <p className="text-xl font-bold text-gray-800">{wellLitPaths}</p>
          <p className="text-xs text-gray-600">Well-lit Paths</p>
        </Card>
        <Card className="text-center">
          <ExclamationTriangleIcon className="w-6 h-6 mx-auto text-danger mb-1" />
          <p className="text-xl font-bold text-gray-800">{darkSpots}</p>
          <p className="text-xs text-gray-600">Dark Spots</p>
        </Card>
      </div>

      {/* Main Map */}
      <Card className="p-2">
        <Map
          center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
          zoom={15}
          height="350px"
          markers={getMapMarkers()}
        />
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
        {/* Night Patrol Tab */}
        {activeTab === 'night' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Check-in Timer */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Safety Check-in</h3>

              <div className="text-center">
                <div className={`text-5xl font-bold mb-4 font-mono ${
                  checkinTimer < 300 ? 'text-danger animate-pulse' : 'text-primary-600'
                }`}>
                  {Math.floor(checkinTimer / 60)}:{(checkinTimer % 60).toString().padStart(2, '0')}
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      checkinTimer < 300 ? 'bg-danger' : 'bg-primary-500'
                    }`}
                    style={{ width: `${(checkinTimer / 900) * 100}%` }}
                  />
                </div>

                <div className="flex gap-3">
                  {!checkinActive ? (
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleCheckinToggle}
                    >
                      <ClockIcon className="w-5 h-5 mr-2" />
                      Start Auto Check-in
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="success"
                        className="flex-1"
                        onClick={handleCheckin}
                      >
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        I'm Safe
                      </Button>
                      <Button
                        variant="danger"
                        className="flex-1"
                        onClick={handleCheckinToggle}
                      >
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Night Safety Tips */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Night Safety Tips</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <LightBulbIcon className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium">Stay in well-lit areas</p>
                    <p className="text-sm text-gray-600">Avoid dark alleys and poorly lit streets</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserGroupIcon className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Travel in groups</p>
                    <p className="text-sm text-gray-600">There's safety in numbers, especially at night</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Keep phone accessible</p>
                    <p className="text-sm text-gray-600">Have emergency contacts on speed dial</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <BellAlertIcon className="w-5 h-5 text-danger mt-0.5" />
                  <div>
                    <p className="font-medium">Share live location</p>
                    <p className="text-sm text-gray-600">Let family track your movement</p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={requestPatrol}
              >
                Request Police Patrol
              </Button>
            </Card>
          </div>
        )}

        {/* Smart City Tab */}
        {activeTab === 'smart' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Smart Lights */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Smart Lighting Network</h3>

              <div className="space-y-3">
                {smartLights.map((light) => (
                  <div key={light.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <LightBulbIcon className={`w-5 h-5 ${
                        light.status === 'on' ? 'text-warning' : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium">Street Light #{light.id}</p>
                        <p className="text-xs text-gray-500">Brightness: {light.brightness}%</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      light.status === 'on' ? 'bg-success/10 text-success' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {light.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  <LightBulbIcon className="w-4 h-4 inline mr-1" />
                  {wellLitPaths} well-lit paths available. Avoid {darkSpots} dark spots.
                </p>
              </div>
            </Card>

            {/* Smart Services */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Smart City Services</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <WifiIcon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium">Public WiFi</p>
                      <p className="text-xs text-gray-500">Available in 15 locations</p>
                    </div>
                  </div>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CameraIcon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium">Traffic Monitoring</p>
                      <p className="text-xs text-gray-500">8 active cameras</p>
                    </div>
                  </div>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Live
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BellAlertIcon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium">Emergency Alerts</p>
                      <p className="text-xs text-gray-500">Instant notifications</p>
                    </div>
                  </div>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => reportDarkSpot(currentLocation?.lat, currentLocation?.lng)}
              >
                Report Dark Spot
              </Button>
            </Card>
          </div>
        )}

        {/* CCTV Network Tab */}
        {activeTab === 'cctv' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CCTV List */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Nearby CCTV Cameras</h3>

              <div className="space-y-3">
                {nearbyCCTVs.map((cctv) => (
                  <div key={cctv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CameraIcon className={`w-5 h-5 ${
                        cctv.status === 'active' ? 'text-success' : 'text-danger'
                      }`} />
                      <div>
                        <p className="font-medium">{cctv.name}</p>
                        <p className="text-xs text-gray-500">ID: CAM-{cctv.id}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      cctv.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {cctv.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CCTV Coverage */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">CCTV Coverage Map</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total cameras in area</span>
                  <span className="text-2xl font-bold text-primary-600">{cctvCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active cameras</span>
                  <span className="text-2xl font-bold text-success">
                    {nearbyCCTVs.filter(c => c.status === 'active').length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Under maintenance</span>
                  <span className="text-2xl font-bold text-warning">
                    {nearbyCCTVs.filter(c => c.status === 'maintenance').length}
                  </span>
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500"
                    style={{ width: `${(nearbyCCTVs.filter(c => c.status === 'active').length / nearbyCCTVs.length) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  * CCTV cameras are monitored by city surveillance
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Live Alerts Tab */}
        {activeTab === 'alerts' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Live Safety Alerts</h3>

            {recentAlerts.length === 0 ? (
              <div className="text-center py-8">
                <BellAlertIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No recent alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  const colorClass = getAlertColor(alert.severity);

                  return (
                    <div key={alert.id} className={`p-4 rounded-lg ${colorClass}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{alert.message}</p>
                            <span className="text-xs opacity-75">{alert.time}</span>
                          </div>
                          <p className="text-xs mt-1 opacity-75">
                            Severity: {alert.severity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setRecentAlerts([])}
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Clear Alerts
            </Button>
          </Card>
        )}
      </div>

      {/* Safety Score Meter */}
      <Card className="bg-primary-50 border border-primary-200">
        <h4 className="font-medium text-primary-800 mb-3">Area Safety Analysis</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-700">Overall Safety Score</span>
            <span className="font-bold text-primary-800">{safetyScore}%</span>
          </div>
          
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500"
              style={{ width: `${safetyScore}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-center mt-4">
            <div className="p-2 bg-white rounded-lg">
              <p className="font-bold text-success">Safe Zones</p>
              <p className="text-gray-600">8 areas</p>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <p className="font-bold text-warning">Moderate</p>
              <p className="text-gray-600">3 areas</p>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <p className="font-bold text-danger">High Risk</p>
              <p className="text-gray-600">2 areas</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SmartSafety;

