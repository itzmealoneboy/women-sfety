import React, { useState, useEffect } from 'react';

const WeatherAlerts = () => {
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    alerts: []
  });
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 1800000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockWeather = {
        temperature: Math.floor(Math.random() * 15) + 22,
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        alerts: [
          { type: 'warning', message: 'High UV index expected between 11 AM - 3 PM' },
          { type: 'info', message: 'Air quality moderate today' }
        ]
      };

      const mockForecast = [
        { day: 'Today', temp: 28, condition: 'Partly Cloudy', rain: 10 },
        { day: 'Tomorrow', temp: 26, condition: 'Cloudy', rain: 30 },
        { day: 'Day 3', temp: 24, condition: 'Rainy', rain: 70 },
        { day: 'Day 4', temp: 27, condition: 'Sunny', rain: 0 },
        { day: 'Day 5', temp: 29, condition: 'Sunny', rain: 0 }
      ];

      setWeather(mockWeather);
      setForecast(mockForecast);
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'Sunny': return '☀️';
      case 'Partly Cloudy': return '⛅';
      case 'Cloudy': return '☁️';
      case 'Rainy': return '🌧️';
      default: return '🌤️';
    }
  };

  return (
    <div className="weather-alerts">
      <div className="monitor-header">
        <h2>Weather Alerts</h2>
        <p>Real-time weather updates and safety alerts</p>
      </div>

      {loading ? (
        <div className="loading">Fetching weather data...</div>
      ) : (
        <>
          <div className="current-weather">
            <div className="weather-icon">{getWeatherIcon(weather.condition)}</div>
            <div className="weather-info">
              <div className="temperature">{weather.temperature}°C</div>
              <div className="condition">{weather.condition}</div>
              <div className="details">
                <span>💧 Humidity: {weather.humidity}%</span>
                <span>💨 Wind: {weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {weather.alerts.length > 0 && (
            <div className="alerts-section">
              <h3>Weather Alerts</h3>
              {weather.alerts.map((alert, i) => (
                <div key={i} className={`alert-card alert-${alert.type}`}>
                  <div className="alert-icon">{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              ))}
            </div>
          )}

          <div className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {forecast.map((day, i) => (
                <div key={i} className="forecast-card">
                  <div className="forecast-day">{day.day}</div>
                  <div className="forecast-icon">{getWeatherIcon(day.condition)}</div>
                  <div className="forecast-temp">{day.temp}°C</div>
                  <div className="forecast-rain">Rain: {day.rain}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="safety-tips">
            <h3>Weather Safety Tips</h3>
            <div className="tips-grid">
              {weather.condition === 'Rainy' && (
                <>
                  <div className="tip">☔ Carry umbrella and raincoat</div>
                  <div className="tip">🚗 Drive carefully, roads may be slippery</div>
                  <div className="tip">⚡ Avoid open fields during thunderstorms</div>
                </>
              )}
              {weather.condition === 'Sunny' && (
                <>
                  <div className="tip">🧴 Apply sunscreen before going out</div>
                  <div className="tip">💧 Stay hydrated throughout the day</div>
                  <div className="tip">🕶️ Wear sunglasses to protect eyes</div>
                </>
              )}
              {weather.windSpeed > 30 && (
                <div className="tip">🌬️ Secure outdoor objects, strong winds expected</div>
              )}
              <div className="tip">📱 Keep phone charged for emergency updates</div>
              <div className="tip">🏠 Stay indoors during severe weather warnings</div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .weather-alerts {
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
          margin: 0;
          color: #666;
        }

        .current-weather {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
        }

        .weather-icon {
          font-size: 80px;
        }

        .temperature {
          font-size: 48px;
          font-weight: bold;
        }

        .condition {
          font-size: 20px;
          margin: 5px 0;
        }

        .details {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 14px;
        }

        .alerts-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .alerts-section h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .alert-card {
          display: flex;
          gap: 12px;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .alert-warning {
          background: #f8d7da;
          border-left: 4px solid #dc3545;
        }

        .alert-info {
          background: #d4edda;
          border-left: 4px solid #28a745;
        }

        .alert-icon {
          font-size: 24px;
        }

        .alert-message {
          flex: 1;
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

        .forecast-icon {
          font-size: 32px;
          margin: 10px 0;
        }

        .forecast-temp {
          font-size: 18px;
          font-weight: bold;
        }

        .forecast-rain {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .safety-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .safety-tips h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .tip {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default WeatherAlerts;
