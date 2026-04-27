import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/locationsstore';
import { useAuthStore } from '../../store/authstores';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Map from '../../components/common/Map';
import {
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock L for Leaflet (will be provided by Map component)
// Note: The actual L object will be available when Map component loads

const LocationHistory = () => {
  const { user } = useAuthStore();
  const { locationHistory, currentLocation } = useLocationStore();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null); // ✅ Fixed syntax
  const [playing, setPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [stats, setStats] = useState({
    totalDistance: 0,
    avgSpeed: 0,
    totalTime: 0,
    mostVisited: []
  });

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Filter and recalculate when history or selected date changes
  useEffect(() => {
    if (history.length > 0) {
      filterHistory();
    }
  }, [selectedDate, history]);

  // Recalculate stats when filtered history changes
  useEffect(() => {
    if (filteredHistory.length > 0) {
      calculateStats();
    }
  }, [filteredHistory]);

  // Playback animation
  useEffect(() => {
    let interval;
    if (playing && filteredHistory.length > 0) {
      interval = setInterval(() => {
        setPlaybackIndex(prev => {
          if (prev >= filteredHistory.length - 1) {
            setPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [playing, filteredHistory.length]);

  const loadHistory = () => {
    // Use actual location history if available, otherwise generate mock
    if (locationHistory && locationHistory.length > 0) {
      setHistory(locationHistory);
      setFilteredHistory(locationHistory);
    } else {
      const mockHistory = generateMockHistory();
      setHistory(mockHistory);
      setFilteredHistory(mockHistory);
    }
  };

  const generateMockHistory = () => {
    const locations = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    for (let i = 0; i < 50; i++) {
      const date = new Date(startDate);
      date.setMinutes(date.getMinutes() + i * 30);

      locations.push({
        id: i,
        lat: 13.0827 + (Math.random() - 0.5) * 0.02,
        lng: 80.2707 + (Math.random() - 0.5) * 0.02,
        timestamp: date.toISOString(),
        accuracy: Math.floor(Math.random() * 20) + 5,
        speed: Math.random() * 10,
        address: `Location ${i + 1}, Chennai`
      });
    }

    return locations.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const filterHistory = () => {
    let filtered = [...history];

    if (selectedDate !== 'all') {
      const today = new Date();
      
      switch (selectedDate) {
        case 'today':
          filtered = filtered.filter(l =>
            new Date(l.timestamp).toDateString() === today.toDateString()
          );
          break;
        case 'yesterday': {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          filtered = filtered.filter(l =>
            new Date(l.timestamp).toDateString() === yesterday.toDateString()
          );
          break;
        }
        case 'week': {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(l => new Date(l.timestamp) >= weekAgo);
          break;
        }
        case 'month': {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter(l => new Date(l.timestamp) >= monthAgo);
          break;
        }
      }
    }

    setFilteredHistory(filtered);
  };

  const calculateStats = () => {
    if (filteredHistory.length < 2) {
      setStats({
        totalDistance: 0,
        avgSpeed: 0,
        totalTime: 0,
        mostVisited: []
      });
      return;
    }

    let totalDistance = 0;
    let totalSpeed = 0;
    let speedCount = 0;

    for (let i = 1; i < filteredHistory.length; i++) {
      const prev = filteredHistory[i - 1];
      const curr = filteredHistory[i];

      // Calculate distance
      const distance = calculateDistance(
        prev.lat, prev.lng,
        curr.lat, curr.lng
      );
      totalDistance += distance;

      // Calculate speed
      const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;
      if (timeDiff > 0) {
        const speed = (distance / 1000) / (timeDiff / 3600);
        totalSpeed += speed;
        speedCount++;
      }
    }

    // Calculate most visited areas
    const areaCount = {};
    filteredHistory.forEach(loc => {
      const area = `${loc.lat.toFixed(3)},${loc.lng.toFixed(3)}`;
      areaCount[area] = (areaCount[area] || 0) + 1;
    });

    const mostVisited = Object.entries(areaCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area]) => area);

    setStats({
      totalDistance: (totalDistance / 1000).toFixed(2),
      avgSpeed: speedCount > 0 ? (totalSpeed / speedCount).toFixed(1) : '0',
      totalTime: formatDuration(filteredHistory.length * 30 * 60),
      mostVisited
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const startPlayback = () => {
    setPlaying(true);
    setPlaybackIndex(0);
  };

  const stopPlayback = () => {
    setPlaying(false);
    setPlaybackIndex(0);
  };

  const exportHistory = () => {
    if (filteredHistory.length === 0) {
      toast.error('No data to export');
      return;
    }

    const data = JSON.stringify(filteredHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `location-history-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Location history exported');
  };

  const clearHistory = () => {
    if (window.confirm('Clear all location history? This action cannot be undone.')) {
      setHistory([]);
      setFilteredHistory([]);
      setStats({
        totalDistance: 0,
        avgSpeed: 0,
        totalTime: 0,
        mostVisited: []
      });
      toast.success('History cleared');
    }
  };

  // Prepare map markers
  const getMapMarkers = () => {
    if (selectedLocation) {
      return [{
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        popup: `📍 ${formatTime(selectedLocation.timestamp)}`,
      }];
    }
    
    return filteredHistory.slice(0, 100).map((loc, index) => ({
      lat: loc.lat,
      lng: loc.lng,
      popup: `${formatTime(loc.timestamp)}${index === playbackIndex && playing ? ' (Current)' : ''}`,
    }));
  };

  // Prepare polyline
  const getPolyline = () => {
    if (filteredHistory.length > 1) {
      return {
        points: filteredHistory.map(loc => [loc.lat, loc.lng]),
        color: '#667eea',
        weight: 3,
        opacity: 0.6
      };
    }
    return null;
  };

  const currentCenter = selectedLocation 
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : (filteredHistory[0] || currentLocation || { lat: 13.0827, lng: 80.2707 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🗺️ Location History
          </h1>
          <p className="text-gray-600 mt-1">
            Track and replay your location history
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <Button
            variant="outline"
            onClick={exportHistory}
            disabled={filteredHistory.length === 0}
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Export
          </Button>

          <Button
            variant="danger"
            onClick={clearHistory}
            disabled={filteredHistory.length === 0}
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <MapPinIcon className="w-6 h-6 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{filteredHistory.length}</p>
          <p className="text-xs text-gray-600">Locations</p>
        </Card>
        <Card className="text-center">
          <ArrowPathIcon className="w-6 h-6 mx-auto text-success mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalDistance} km</p>
          <p className="text-xs text-gray-600">Total Distance</p>
        </Card>
        <Card className="text-center">
          <ClockIcon className="w-6 h-6 mx-auto text-warning mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.avgSpeed} km/h</p>
          <p className="text-xs text-gray-600">Avg Speed</p>
        </Card>
        <Card className="text-center">
          <CalendarIcon className="w-6 h-6 mx-auto text-danger mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalTime}</p>
          <p className="text-xs text-gray-600">Total Time</p>
        </Card>
      </div>

      {/* Map */}
      <Card className="p-2">
        <Map
          center={currentCenter}
          zoom={14}
          height="400px"
          markers={getMapMarkers()}
          polyline={getPolyline()}
        />
      </Card>

      {/* Playback Controls */}
      {filteredHistory.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!playing ? (
                <Button
                  variant="primary"
                  onClick={startPlayback}
                  disabled={filteredHistory.length === 0}
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Play Timeline
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={stopPlayback}
                >
                  <StopIcon className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              )}

              <div className="text-sm text-gray-600">
                {playing ? (
                  <span>
                    Playing: {formatTime(filteredHistory[playbackIndex]?.timestamp)}
                  </span>
                ) : (
                  <span>{filteredHistory.length} locations in timeline</span>
                )}
              </div>
            </div>

            {playing && (
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{ width: `${(playbackIndex / filteredHistory.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Location Timeline</h3>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No location history available</p>
            <p className="text-sm text-gray-400 mt-1">
              Start tracking your location to see history
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHistory.map((location, index) => (
              <div
                key={location.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedLocation?.id === location.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-success' : 'bg-primary-500'
                    }`} />
                    {index < filteredHistory.length - 1 && (
                      <div className="absolute top-2 left-1 w-0.5 h-8 bg-gray-200"></div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {formatTime(location.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                    </p>
                    {location.speed > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Speed: {location.speed.toFixed(1)} km/h • Accuracy: ±{location.accuracy}m
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {formatDate(location.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Most Visited Places */}
      {stats.mostVisited.length > 0 && (
        <Card className="bg-primary-50 border border-primary-200">
          <h4 className="font-medium text-primary-800 mb-3">Most Visited Areas</h4>
          <div className="space-y-2">
            {stats.mostVisited.map((area, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-primary-700">
                <span className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">
                  {index + 1}
                </span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LocationHistory;

