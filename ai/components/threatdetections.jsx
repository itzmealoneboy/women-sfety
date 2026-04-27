import React, { useState, useEffect } from 'react';

const ThreatDetections = () => {
  const [activeThreats, setActiveThreats] = useState([]);
  const [threatHistory, setThreatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = () => {
    const mockThreats = [
      { id: 1, type: 'Malware', severity: 'High', source: 'Email Attachment', timestamp: new Date(), status: 'Active', confidence: 92 },
      { id: 2, type: 'Phishing', severity: 'Critical', source: 'Suspicious Link', timestamp: new Date(), status: 'Active', confidence: 88 },
      { id: 3, type: 'Suspicious Login', severity: 'Medium', source: 'Unknown Device', timestamp: new Date(), status: 'Investigating', confidence: 76 }
    ];
    setActiveThreats(mockThreats);
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  return (
    <div className="threat-detections">
      <div className="detections-header">
        <h2>Real-Time Threat Detection</h2>
        <p>AI-powered threat monitoring and alerts</p>
      </div>

      {loading ? (
        <div className="loading">Scanning for threats...</div>
      ) : (
        <>
          <div className="threats-list">
            {activeThreats.map(threat => (
              <div key={threat.id} className="threat-card">
                <div className="threat-header">
                  <span className="threat-type">{threat.type}</span>
                  <span className="threat-severity" style={{ backgroundColor: getSeverityColor(threat.severity) }}>{threat.severity}</span>
                </div>
                <div className="threat-details">
                  <div>Source: {threat.source}</div>
                  <div>Confidence: {threat.confidence}%</div>
                  <div>Status: {threat.status}</div>
                </div>
                <div className="threat-actions">
                  <button className="btn-investigate">Investigate</button>
                  <button className="btn-mitigate">Mitigate</button>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-summary">
            <div className="stat">Active Threats: {activeThreats.length}</div>
            <div className="stat">Critical: {activeThreats.filter(t => t.severity === 'Critical').length}</div>
            <div className="stat">High: {activeThreats.filter(t => t.severity === 'High').length}</div>
          </div>
        </>
      )}

      <style jsx>{`
        .threat-detections { padding: 20px; background: #f8f9fa; min-height: 100vh; }
        .detections-header { margin-bottom: 30px; }
        .threats-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .threat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .threat-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .threat-type { font-size: 18px; font-weight: bold; }
        .threat-severity { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
        .threat-details { margin-bottom: 15px; color: #666; font-size: 14px; }
        .threat-actions { display: flex; gap: 10px; }
        .btn-investigate, .btn-mitigate { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-investigate { background: #007bff; color: white; }
        .btn-mitigate { background: #dc3545; color: white; }
        .stats-summary { display: flex; gap: 20px; justify-content: center; }
        .stat { background: white; padding: 15px; border-radius: 8px; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default ThreatDetections;
