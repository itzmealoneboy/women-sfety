import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AirQualityMonitors = () => {
  const [airData, setAirData] = useState({
    aqi: 85,
    pm25: 42,
    pm10: 68,
    no2: 24,
    so2: 12,
    o3: 35,
    co: 0.8
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('Downtown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAirQualityData();
    const interval = setInterval(fetchAirQualityData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchAirQualityData = async () => {
    setLoading(true);
    setTimeout(() => {
      const newAQI = Math.floor(Math.random() * 100) + 50;
      const mockHistorical = [
        { time: '00:00', aqi: 72, pm25: 35, pm10: 58 },
        { time: '04:00', aqi: 68, pm25: 32, pm10: 54 },
        { time: '08:00', aqi: 85, pm25: 42, pm10: 68 },
        { time: '12:00', aqi: 92, pm25: 48, pm10: 75 },
        { time: '16:00', aqi: 88, pm25: 45, pm10: 71 },
        { time: '20:00', aqi: 78, pm25: 38, pm10: 62 },
      ];
      
      const mockForecast = [
        { day: 'Today', aqi: 85, condition: 'Moderate' },
        { day: 'Tomorrow', aqi: 78, condition: 'Moderate' },
        { day: 'Day 3', aqi: 92, condition: 'Unhealthy' },
        { day: 'Day 4', aqi: 65, condition: 'Good' },
        { day: 'Day 5', aqi: 70, condition: 'Moderate' },
      ];

      setAirData({
        aqi: newAQI,
        pm25: Math.floor(Math.random() * 50) + 20,
        pm10: Math.floor(Math.random() * 80) + 40,
        no2: Math.floor(Math.random() * 30) + 10,
        so2: Math.floor(Math.random() * 15) + 5,
        o3: Math.floor(Math.random() * 40) + 20,
        co: (Math.random() * 1.5 + 0.3).toFixed(1)
      });
      setHistoricalData(mockHistorical);
      setForecast(mockForecast);
      setLoading(false);
    }, 1000);
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { color: '#28a745', label: 'Good', description: 'Air quality is satisfactory' };
    if (aqi <= 100) return { color: '#ffc107', label: 'Moderate', description: 'Acceptable air quality' };
    if (aqi <= 150) return { color: '#fd7e14', label: 'Unhealthy for Sensitive Groups', description: 'Sensitive groups may experience effects' };
    if (aqi <= 200) return { color: '#dc3545', label: 'Unhealthy', description: 'Everyone may begin to experience health effects' };
    return { color: '#721c24', label: 'Very Unhealthy', description: 'Health alert: everyone may experience serious effects' };
  };

  const aqiStatus = getAQIColor(airData.aqi);

  return (
    <div className="air-quality-monitor">
      <div className="monitor-header">
        <h2>Air Quality Monitor</h2>
        <p>Real-time air quality monitoring and forecasts</p>
        <div className="location-selector">
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="Downtown">Downtown</option>
            <option value="Residential">Residential Area</option>
            <option value="Industrial">Industrial Zone</option>
            <option value="Suburb">Suburb</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Fetching air quality data...</div>
      ) : (
        <>
          <div className="aqi-card" style={{ borderColor: aqiStatus.color }}>
            <div className="aqi-value" style={{ color: aqiStatus.color }}>
              {airData.aqi}
            </div>
            <div className="aqi-label">{aqiStatus.label}</div>
            <div className="aqi-description">{aqiStatus.description}</div>
          </div>

          <div className="pollutants-grid">
            <div className="pollutant-card">
              <div className="pollutant-name">PM2.5</div>
              <div className="pollutant-value">{airData.pm25} µg/m³</div>
              <div className="pollutant-status">Fine Particles</div>
            </div>
            <div className="pollutant-card">
              <div className="pollutant-name">PM10</div>
              <div className="pollutant-value">{airData.pm10} µg/m³</div>
              <div className="pollutant-status">Inhalable Particles</div>
            </div>
            <div className="pollutant-card">
              <div className="pollutant-name">NO₂</div>
              <div className="pollutant-value">{airData.no2} ppb</div>
              <div className="pollutant-status">Nitrogen Dioxide</div>
            </div>
            <div className="pollutant-card">
              <div className="pollutant-name">SO₂</div>
              <div className="pollutant-value">{airData.so2} ppb</div>
              <div className="pollutant-status">Sulfur Dioxide</div>
            </div>
            <div className="pollutant-card">
              <div className="pollutant-name">O₃</div>
              <div className="pollutant-value">{airData.o3} ppb</div>
              <div className="pollutant-status">Ozone</div>
            </div>
            <div className="pollutant-card">
              <div className="pollutant-name">CO</div>
              <div className="pollutant-value">{airData.co} ppm</div>
              <div className="pollutant-status">Carbon Monoxide</div>
            </div>
          </div>

          <div className="chart-container">
            <h3>24-Hour Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="aqi" stackId="1" stroke="#ffc107" fill="#ffc107" fillOpacity={0.3} name="AQI" />
                <Area type="monotone" dataKey="pm25" stackId="2" stroke="#dc3545" fill="#dc3545" fillOpacity={0.3} name="PM2.5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {forecast.map((day, i) => (
                <div key={i} className="forecast-card">
                  <div className="forecast-day">{day.day}</div>
                  <div className="forecast-aqi" style={{ color: getAQIColor(day.aqi).color }}>
                    {day.aqi}
                  </div>
                  <div className="forecast-condition">{day.condition}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations">
            <h3>Health Recommendations</h3>
            <div className="rec-list">
              {airData.aqi > 100 && (
                <div className="rec-item">⚠️ Limit outdoor activities, especially for sensitive groups</div>
              )}
              {airData.pm25 > 50 && (
                <div className="rec-item">😷 Wear N95 mask when going outdoors</div>
              )}
              {airData.aqi < 100 && (
                <div className="rec-item">✅ Good air quality - Enjoy outdoor activities</div>
              )}
              <div className="rec-item">💧 Keep indoor spaces well-ventilated</div>
              <div className="rec-item">🌿 Use air purifiers if available</div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .air-quality-monitor {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .monitor-header {
          margin-bottom: 30px;
        }

        .monitor-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .monitor-header p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .location-selector select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #666;
        }

        .aqi-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
          border-left: 4px solid;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .aqi-value {
          font-size: 72px;
          font-weight: bold;
        }

        .aqi-label {
          font-size: 24px;
          margin: 10px 0;
        }

        .aqi-description {
          color: #666;
        }

        .pollutants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .pollutant-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .pollutant-name {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .pollutant-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .pollutant-status {
          font-size: 10px;
          color: #999;
          margin-top: 5px;
        }

        .chart-container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chart-container h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .forecast-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .forecast-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
        }

        .forecast-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .forecast-day {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .forecast-aqi {
          font-size: 24px;
          font-weight: bold;
        }

        .forecast-condition {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .recommendations {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .recommendations h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .rec-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rec-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default AirQualityMonitors;
