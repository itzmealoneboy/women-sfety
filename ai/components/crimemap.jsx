import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const CrimeMap = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [filteredCrimes, setFilteredCrimes] = useState([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [heatmap, setHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([28.6139, 77.2090]); // Delhi coordinates
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    fetchCrimeData();
  }, []);

  useEffect(() => {
    filterCrimes();
  }, [selectedCrimeType, dateRange, crimeData]);

  const fetchCrimeData = async () => {
    try {
      // Simulate API call for crime data
      const mockCrimeData = [
        {
          id: 1,
          type: 'Theft',
          location: [28.6129, 77.2290],
          address: 'Connaught Place',
          date: '2024-01-15',
          severity: 'Medium',
          description: 'Mobile phone theft reported',
          status: 'Under Investigation'
        },
        {
          id: 2,
          type: 'Assault',
          location: [28.6329, 77.2190],
          address: 'Karol Bagh',
          date: '2024-01-14',
          severity: 'High',
          description: 'Physical assault in parking area',
          status: 'Solved'
        },
        {
          id: 3,
          type: 'Fraud',
          location: [28.5929, 77.2490],
          address: 'Lajpat Nagar',
          date: '2024-01-13',
          severity: 'High',
          description: 'Online banking fraud',
          status: 'Investigating'
        },
        {
          id: 4,
          type: 'Vandalism',
          location: [28.6229, 77.2090],
          address: 'Rajiv Chowk',
          date: '2024-01-12',
          severity: 'Low',
          description: 'Graffiti on public property',
          status: 'Solved'
        },
        {
          id: 5,
          type: 'Cyber Crime',
          location: [28.6429, 77.2290],
          address: 'Rohini',
          date: '2024-01-11',
          severity: 'Critical',
          description: 'Phishing attack on local business',
          status: 'Under Investigation'
        },
        {
          id: 6,
          type: 'Burglary',
          location: [28.6029, 77.1990],
          address: 'Janakpuri',
          date: '2024-01-10',
          severity: 'High',
          description: 'Residential break-in',
          status: 'Investigating'
        }
      ];

      setCrimeData(mockCrimeData);
      setFilteredCrimes(mockCrimeData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crime data:', error);
      setLoading(false);
    }
  };

  const filterCrimes = () => {
    let filtered = [...crimeData];
    
    if (selectedCrimeType !== 'all') {
      filtered = filtered.filter(crime => crime.type === selectedCrimeType);
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(crime => crime.date >= dateRange.start);
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(crime => crime.date <= dateRange.end);
    }
    
    setFilteredCrimes(filtered);
  };

  const getCrimeColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getCrimeIcon = (type) => {
    switch (type) {
      case 'Theft': return '💰';
      case 'Assault': return '👊';
      case 'Fraud': return '💳';
      case 'Vandalism': return '🎨';
      case 'Cyber Crime': return '💻';
      case 'Burglary': return '🏠';
      default: return '📍';
    }
  };

  const crimeTypes = ['all', ...new Set(crimeData.map(crime => crime.type))];

  return (
    <div className="crime-map">
      <div className="map-header">
        <h2>Crime Heat Map</h2>
        <p>AI-powered crime visualization and analysis</p>
      </div>

      <div className="controls-panel">
        <div className="filter-group">
          <label>Crime Type:</label>
          <select value={selectedCrimeType} onChange={(e) => setSelectedCrimeType(e.target.value)}>
            {crimeTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Crimes' : type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={heatmap}
              onChange={(e) => setHeatmap(e.target.checked)}
            />
            Show Heatmap
          </label>
        </div>
      </div>

      <div className="map-stats">
        <div className="stat-card">
          <div className="stat-value">{filteredCrimes.length}</div>
          <div className="stat-label">Total Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {filteredCrimes.filter(c => c.severity === 'Critical').length}
          </div>
          <div className="stat-label">Critical Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {filteredCrimes.filter(c => c.status === 'Solved').length}
          </div>
          <div className="stat-label">Solved Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {filteredCrimes.filter(c => c.status === 'Investigating').length}
          </div>
          <div className="stat-label">Active Investigations</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading crime data...</div>
      ) : (
        <div className="map-container">
          <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {filteredCrimes.map(crime => (
              <CircleMarker
                key={crime.id}
                center={crime.location}
                radius={crime.severity === 'Critical' ? 12 : crime.severity === 'High' ? 10 : crime.severity === 'Medium' ? 8 : 6}
                fillColor={getCrimeColor(crime.severity)}
                color="#000"
                weight={1}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="popup-content">
                    <h4>{crime.type}</h4>
                    <p><strong>Address:</strong> {crime.address}</p>
                    <p><strong>Date:</strong> {crime.date}</p>
                    <p><strong>Severity:</strong> {crime.severity}</p>
                    <p><strong>Status:</strong> {crime.status}</p>
                    <p><strong>Description:</strong> {crime.description}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      <div className="crime-insights">
        <h3>AI Crime Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <h4>Hotspot Prediction</h4>
            <p>High crime probability in Connaught Place area based on historical data</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⏰</div>
            <h4>Time Pattern</h4>
            <p>Peak crime hours: 6 PM - 9 PM (Weekdays)</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🔄</div>
            <h4>Trend Analysis</h4>
            <p>15% decrease in theft compared to previous month</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🤖</div>
            <h4>AI Recommendation</h4>
            <p>Increase police patrol in high-risk zones during peak hours</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .crime-map {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .map-header {
          margin-bottom: 30px;
        }

        .map-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .map-header p {
          margin: 0;
          color: #666;
        }

        .controls-panel {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-group label {
          font-size: 12px;
          color: #666;
        }

        .filter-group select, .filter-group input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .map-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
        }

        .map-container {
          background: white;
          padding: 10px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .popup-content h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .popup-content p {
          margin: 5px 0;
          font-size: 12px;
        }

        .crime-insights {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .crime-insights h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 36px;
          margin-bottom: 10px;
        }

        .insight-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .insight-card p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CrimeMap;
