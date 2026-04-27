import React, { useState } from 'react';

const PhishingLinkDetectors = () => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const analyzeUrl = async () => {
    if (!url) return;
    
    setAnalyzing(true);
    
    // Simulate AI URL analysis
    setTimeout(() => {
      const suspiciousPatterns = [
        'url-length', 'https-missing', 'subdomain-count', 'url-shortener',
        'suspicious-words', 'domain-age', 'ssl-certificate', 'url-redirection'
      ];
      
      const score = Math.random() * 100;
      const isPhishing = score < 70;
      
      const mockResults = {
        url: url,
        isPhishing: isPhishing,
        confidence: isPhishing ? 85 + Math.random() * 10 : 75 + Math.random() * 15,
        riskLevel: score < 30 ? 'Critical' : score < 60 ? 'High' : score < 80 ? 'Medium' : 'Low',
        analysis: {
          domainAge: Math.random() > 0.7 ? 'Recently registered' : 'Established domain',
          sslValid: Math.random() > 0.3,
          urlLength: url.length,
          suspiciousKeywords: [],
          redirects: Math.floor(Math.random() * 3),
          similarDomains: []
        },
        recommendations: [],
        threatIndicators: []
      };
      
      // Add suspicious patterns
      if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('short')) {
        mockResults.threatIndicators.push('URL shortener detected - hides destination');
        mockResults.analysis.suspiciousKeywords.push('URL shortener');
      }
      
      if (!url.startsWith('https://')) {
        mockResults.threatIndicators.push('No HTTPS - insecure connection');
      }
      
      if (url.split('.').length > 4) {
        mockResults.threatIndicators.push('Multiple subdomains - suspicious structure');
      }
      
      const suspiciousWords = ['login', 'verify', 'account', 'secure', 'update', 'confirm'];
      suspiciousWords.forEach(word => {
        if (url.toLowerCase().includes(word)) {
          mockResults.threatIndicators.push(`Suspicious keyword detected: "${word}"`);
          mockResults.analysis.suspiciousKeywords.push(word);
        }
      });
      
      if (mockResults.isPhishing) {
        mockResults.recommendations = [
          '⚠️ Do NOT click on this link',
          'Report this URL to security authorities',
          'Check the official website directly instead of using links',
          'Enable browser phishing protection'
        ];
      } else {
        mockResults.recommendations = [
          'Link appears safe, but always verify before clicking',
          'Check for any unexpected redirects',
          'Ensure you\'re on the correct website'
        ];
      }
      
      setResults(mockResults);
      
      setScanHistory(prev => [{
        id: Date.now(),
        url: url,
        isPhishing: isPhishing,
        riskLevel: mockResults.riskLevel,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
      
      setAnalyzing(false);
    }, 2500);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRiskIcon = (level) => {
    switch(level) {
      case 'Critical': return '🔴';
      case 'High': return '🟠';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="phishing-link-detector">
      <div className="detector-header">
        <h2>Phishing Link Detector</h2>
        <p>AI-powered URL security analysis and threat detection</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label>Enter URL to analyze</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button 
          onClick={analyzeUrl} 
          disabled={!url || analyzing}
          className="btn-analyze"
        >
          {analyzing ? 'Analyzing...' : 'Analyze URL'}
        </button>
      </div>

      {analyzing && (
        <div className="analyzing-state">
          <div className="spinner"></div>
          <p>AI is analyzing URL...</p>
          <div className="progress-steps">
            <div className="step">🔍 Checking domain reputation</div>
            <div className="step">🔐 Verifying SSL certificate</div>
            <div className="step">📝 Scanning for suspicious patterns</div>
            <div className="step">🌐 Cross-referencing threat databases</div>
          </div>
        </div>
      )}

      {results && !analyzing && (
        <div className="results-section">
          <div className={`risk-banner risk-${results.riskLevel.toLowerCase()}`}>
            <div className="risk-icon">{getRiskIcon(results.riskLevel)}</div>
            <div className="risk-content">
              <div className="risk-title">
                {results.isPhishing ? '⚠️ PHISHING URL DETECTED' : '✓ URL APPEARS SAFE'}
              </div>
              <div className="risk-description">
                {results.isPhishing 
                  ? 'This URL shows characteristics of phishing attempts' 
                  : 'No immediate threats detected in this URL'}
              </div>
            </div>
          </div>

          <div className="analysis-details">
            <h3>Detailed Analysis</h3>
            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-icon">🔐</div>
                <div className="detail-info">
                  <div className="detail-label">SSL Certificate</div>
                  <div className={`detail-value ${results.analysis.sslValid ? 'safe' : 'unsafe'}`}>
                    {results.analysis.sslValid ? 'Valid' : 'Invalid/Missing'}
                  </div>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">📅</div>
                <div className="detail-info">
                  <div className="detail-label">Domain Age</div>
                  <div className={`detail-value ${results.analysis.domainAge === 'Recently registered' ? 'unsafe' : 'safe'}`}>
                    {results.analysis.domainAge}
                  </div>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">📏</div>
                <div className="detail-info">
                  <div className="detail-label">URL Length</div>
                  <div className={`detail-value ${results.analysis.urlLength > 100 ? 'unsafe' : 'safe'}`}>
                    {results.analysis.urlLength} characters
                  </div>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">🔄</div>
                <div className="detail-info">
                  <div className="detail-label">Redirects</div>
                  <div className={`detail-value ${results.analysis.redirects > 1 ? 'unsafe' : 'safe'}`}>
                    {results.analysis.redirects} redirects
                  </div>
                </div>
              </div>
            </div>
          </div>

          {results.threatIndicators.length > 0 && (
            <div className="threat-indicators">
              <h3>⚠️ Threat Indicators Found</h3>
              <ul>
                {results.threatIndicators.map((indicator, i) => (
                  <li key={i}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="recommendations">
            <h3>📋 Security Recommendations</h3>
            <ul>
              {results.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="action-buttons">
            {results.isPhishing && (
              <button className="btn-report" onClick={() => alert('URL reported to security authorities')}>
                Report as Phishing
              </button>
            )}
            <button className="btn-new" onClick={() => {
              setUrl('');
              setResults(null);
            }}>
              Analyze Another URL
            </button>
          </div>
        </div>
      )}

      {scanHistory.length > 0 && (
        <div className="scan-history">
          <h3>Recent URL Scans</h3>
          <div className="history-list">
            {scanHistory.map(scan => (
              <div key={scan.id} className={`history-item risk-${scan.riskLevel.toLowerCase()}`}>
                <div className="history-url">{scan.url}</div>
                <div className={`history-badge risk-${scan.riskLevel.toLowerCase()}`}>
                  {getRiskIcon(scan.riskLevel)} {scan.riskLevel}
                </div>
                <div className="history-time">
                  {scan.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="security-tips">
        <h3>🔒 URL Safety Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">✓</div>
            <h4>Check HTTPS</h4>
            <p>Always ensure the website uses HTTPS encryption</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <h4>Hover Before Clicking</h4>
            <p>Hover over links to see the actual destination URL</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⚠️</div>
            <h4>Watch for Misspellings</h4>
            <p>Phishers often use URLs similar to legitimate sites</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <h4>Verify on Mobile</h4>
            <p>Be extra cautious with links received via SMS or messaging apps</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .phishing-link-detector {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .detector-header {
          margin-bottom: 30px;
        }

        .detector-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .detector-header p {
          margin: 0;
          color: #666;
        }

        .input-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .input-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .btn-analyze {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-analyze:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-analyze:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analyzing-state {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e0e0e0;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .progress-steps {
          margin-top: 20px;
        }

        .step {
          padding: 5px 0;
          color: #666;
          font-size: 14px;
        }

        .results-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .risk-banner {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .risk-banner.risk-critical, .risk-banner.risk-high {
          background: #f8d7da;
          border-left: 4px solid #dc3545;
        }

        .risk-banner.risk-medium {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
        }

        .risk-banner.risk-low {
          background: #d4edda;
          border-left: 4px solid #28a745;
        }

        .risk-icon {
          font-size: 40px;
        }

        .risk-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .analysis-details h3, .threat-indicators h3, .recommendations h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .detail-icon {
          font-size: 28px;
        }

        .detail-info {
          flex: 1;
        }

        .detail-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 500;
        }

        .detail-value.safe {
          color: #28a745;
        }

        .detail-value.unsafe {
          color: #dc3545;
        }

        .threat-indicators ul, .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }

        .threat-indicators li, .recommendations li {
          margin-bottom: 8px;
          color: #666;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-report, .btn-new {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-report {
          background: #dc3545;
          color: white;
        }

        .btn-new {
          background: #28a745;
          color: white;
        }

        .scan-history {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .scan-history h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid;
        }

        .history-item.risk-critical {
          border-left-color: #dc3545;
        }

        .history-item.risk-high {
          border-left-color: #fd7e14;
        }

        .history-item.risk-medium {
          border-left-color: #ffc107;
        }

        .history-item.risk-low {
          border-left-color: #28a745;
        }

        .history-url {
          flex: 1;
          color: #333;
          word-break: break-all;
          font-size: 14px;
        }

        .history-badge {
          margin: 0 15px;
          font-size: 13px;
          font-weight: 500;
        }

        .history-time {
          color: #999;
          font-size: 12px;
        }

        .security-tips {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .security-tips h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .tip-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .tip-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .tip-card h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .tip-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default PhishingLinkDetectors;
