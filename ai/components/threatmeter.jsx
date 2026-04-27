import React, { useState, useEffect } from 'react';

const ThreatMeter = () => {
  const [threatLevel, setThreatLevel] = useState(0);
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(Math.random() * 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (threatLevel < 30) return '#28a745';
    if (threatLevel < 60) return '#ffc107';
    if (threatLevel < 80) return '#fd7e14';
    return '#dc3545';
  };

  const getLevel = () => {
    if (threatLevel < 30) return 'Low';
    if (threatLevel < 60) return 'Moderate';
    if (threatLevel < 80) return 'High';
    return 'Critical';
  };

  return (
    <div className="threat-meter">
      <h3>Threat Level Meter</h3>
      <div className="meter-container">
        <div className="meter-scale">
          <div className="meter-fill" style={{ width: `${threatLevel}%`, backgroundColor: getColor() }} />
        </div>
        <div className="meter-value" style={{ color: getColor() }}>{Math.round(threatLevel)}%</div>
        <div className="meter-label">{getLevel()} Threat Level</div>
      </div>

      <style jsx>{`
        .threat-meter { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .meter-container { text-align: center; }
        .meter-scale { height: 30px; background: #e0e0e0; border-radius: 15px; overflow: hidden; margin: 20px 0; }
        .meter-fill { height: 100%; transition: width 0.3s ease; }
        .meter-value { font-size: 36px; font-weight: bold; margin: 10px 0; }
        .meter-label { font-size: 18px; color: #666; }
      `}</style>
    </div>
  );
};

export default ThreatMeter;
