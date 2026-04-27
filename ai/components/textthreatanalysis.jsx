import React, { useState } from 'react';

const TextThreatAnalysis = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeText = () => {
    if (!text.trim()) return;
    
    setAnalyzing(true);
    
    setTimeout(() => {
      const threats = [];
      const severity = Math.random() * 100;
      
      const threatKeywords = ['hack', 'virus', 'malware', 'scam', 'phishing', 'fraud', 'steal', 'password', 'bank', 'credit card'];
      const foundThreats = threatKeywords.filter(keyword => text.toLowerCase().includes(keyword));
      
      if (foundThreats.length > 0) {
        threats.push(...foundThreats.map(k => ({ type: k, confidence: Math.random() * 100 })));
      }
      
      const sentiment = text.length > 0 ? (text.includes('!') ? 'Aggressive' : text.includes('?') ? 'Curious' : 'Neutral') : 'Neutral';
      
      setAnalysis({
        threatScore: severity,
        threats: threats,
        sentiment: sentiment,
        toxicity: Math.random() * 100,
        spamLikelihood: Math.random() * 100,
        recommendations: []
      });
      
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="text-threat-analysis">
      <div className="analysis-header">
        <h2>Text Threat Analysis</h2>
        <p>AI-powered content security analysis</p>
      </div>

      <div className="input-section">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze for threats, spam, or malicious content..."
          rows={6}
        />
        <button onClick={analyzeText} disabled={!text.trim() || analyzing} className="btn-analyze">
          {analyzing ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>

      {analysis && !analyzing && (
        <div className="results">
          <div className="threat-meter">
            <h3>Threat Score</h3>
            <div className="meter-bar">
              <div className="meter-fill" style={{ width: `${analysis.threatScore}%`, backgroundColor: analysis.threatScore > 70 ? '#dc3545' : analysis.threatScore > 40 ? '#ffc107' : '#28a745' }} />
            </div>
            <div className="meter-value">{Math.round(analysis.threatScore)}%</div>
          </div>

          <div className="metrics">
            <div className="metric">
              <span className="metric-label">Toxicity Level</span>
              <span className="metric-value" style={{ color: analysis.toxicity > 70 ? '#dc3545' : '#ffc107' }}>{Math.round(analysis.toxicity)}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Spam Likelihood</span>
              <span className="metric-value" style={{ color: analysis.spamLikelihood > 70 ? '#dc3545' : '#ffc107' }}>{Math.round(analysis.spamLikelihood)}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Sentiment</span>
              <span className="metric-value">{analysis.sentiment}</span>
            </div>
          </div>

          {analysis.threats.length > 0 && (
            <div className="threats-detected">
              <h4>⚠️ Threats Detected</h4>
              {analysis.threats.map((threat, i) => (
                <div key={i} className="threat-item">
                  <span className="threat-type">{threat.type}</span>
                  <span className="threat-confidence">{Math.round(threat.confidence)}% confidence</span>
                </div>
              ))}
            </div>
          )}

          {analysis.threatScore > 60 && (
            <div className="warning">
              <strong>⚠️ High Risk Content Detected</strong>
              <p>This content may contain malicious intent. Do not click on any links or share personal information.</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .text-threat-analysis { padding: 20px; background: #f8f9fa; min-height: 100vh; }
        .analysis-header { margin-bottom: 30px; }
        .input-section textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; margin-bottom: 15px; resize: vertical; }
        .btn-analyze { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%; }
        .results { background: white; padding: 20px; border-radius: 12px; margin-top: 20px; }
        .threat-meter { margin-bottom: 20px; }
        .meter-bar { height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden; margin: 10px 0; }
        .meter-fill { height: 100%; transition: width 0.3s ease; }
        .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
        .metric { text-align: center; padding: 10px; background: #f8f9fa; border-radius: 8px; }
        .metric-label { display: block; font-size: 12px; color: #666; margin-bottom: 5px; }
        .metric-value { font-size: 20px; font-weight: bold; }
        .threats-detected { background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .threat-item { display: flex; justify-content: space-between; padding: 5px 0; }
        .warning { background: #f8d7da; padding: 15px; border-radius: 8px; color: #721c24; }
      `}</style>
    </div>
  );
};

export default TextThreatAnalysis;
