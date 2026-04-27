import React, { useState } from 'react';

const CreamDetections = () => {
    const [image, setImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [history, setHistory] = useState([]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeCream = () => {
        if (!image) return;

        setAnalyzing(true);

        setTimeout(() => {
            const mockResults = {
                productName: 'Moisturizing Cream',
                authenticity: Math.random() * 100,
                ingredients: [
                    { name: 'Hyaluronic Acid', safe: true, percentage: 2.5 },
                    { name: 'Retinol', safe: true, percentage: 0.5 },
                    { name: 'Fragrance', safe: false, percentage: 0.1 },
                    { name: 'Parabens', safe: false, percentage: 0.3 }
                ],
                safetyScore: Math.random() * 100,
                skinTypes: ['Normal', 'Dry', 'Combination'],
                warnings: [],
                recommendations: []
            };

            if (mockResults.authenticity < 70) {
                mockResults.warnings.push('⚠️ Possible counterfeit product detected');
                mockResults.warnings.push('Packaging inconsistencies found');
            }

            if (mockResults.safetyScore < 60) {
                mockResults.warnings.push('Contains potentially harmful ingredients');
                mockResults.recommendations.push('Consider patch test before use');
            }

            const unsafeIngredients = mockResults.ingredients.filter(i => !i.safe);
            if (unsafeIngredients.length > 0) {
                mockResults.warnings.push(`Contains ${unsafeIngredients.length} potentially harmful ingredients`);
            }

            setAnalysis(mockResults);
            setHistory([{ id: Date.now(), timestamp: new Date(), score: mockResults.safetyScore }, ...history.slice(0, 9)]);
            setAnalyzing(false);
        }, 3000);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        if (score >= 40) return '#fd7e14';
        return '#dc3545';
    };

    return (
        <div className="cream-detection">
            <div className="detection-header">
                <h2>AI Cream & Skincare Analyzer</h2>
                <p>Analyze skincare products for authenticity and safety</p>
            </div>

            <div className="upload-section">
                <div className="upload-area" onClick={() => document.getElementById('cream-image').click()}>
                    {image ? (
                        <img src={image} alt="Cream product" className="uploaded-image" />
                    ) : (
                        <>
                            <div className="upload-icon">📸</div>
                            <p>Click to upload product image</p>
                            <span className="upload-hint">Supports: JPG, PNG (Max 5MB)</span>
                        </>
                    )}
                    <input
                        id="cream-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>

                {image && (
                    <button onClick={analyzeCream} disabled={analyzing} className="btn-analyze">
                        {analyzing ? 'Analyzing...' : 'Analyze Product'}
                    </button>
                )}
            </div>

            {analyzing && (
                <div className="analyzing-state">
                    <div className="spinner"></div>
                    <p>AI is analyzing product...</p>
                    <div className="progress-steps">
                        <div className="step">🔍 Scanning packaging</div>
                        <div className="step">📝 Reading ingredients</div>
                        <div className="step">🔬 Analyzing chemical composition</div>
                        <div className="step">✓ Generating safety report</div>
                    </div>
                </div>
            )}

            {analysis && !analyzing && (
                <div className="results-section">
                    <div className="score-container">
                        <div className="score-circle">
                            <svg width="150" height="150" viewBox="0 0 150 150">
                                <circle cx="75" cy="75" r="65" fill="none" stroke="#e0e0e0" strokeWidth="12" />
                                <circle cx="75" cy="75" r="65" fill="none" stroke={getScoreColor(analysis.safetyScore)} strokeWidth="12"
                                    strokeDasharray={`${2 * Math.PI * 65 * analysis.safetyScore / 100} ${2 * Math.PI * 65 * (100 - analysis.safetyScore) / 100}`}
                                    strokeDashoffset={2 * Math.PI * 65 * 0.25} transform="rotate(-90 75 75)" />
                                <text x="75" y="88" textAnchor="middle" fontSize="28" fontWeight="bold" fill={getScoreColor(analysis.safetyScore)}>
                                    {Math.round(analysis.safetyScore)}%
                                </text>
                            </svg>
                        </div>
                        <div className="score-label">Safety Score</div>
                    </div>

                    <div className="authenticity">
                        <h4>Authenticity Check</h4>
                        <div className="authenticity-bar">
                            <div className="authenticity-fill" style={{ width: `${analysis.authenticity}%`, backgroundColor: analysis.authenticity > 70 ? '#28a745' : '#dc3545' }} />
                        </div>
                        <div className="authenticity-text">
                            {analysis.authenticity > 80 ? '✓ Genuine Product' : analysis.authenticity > 60 ? '⚠️ Suspicious' : '❌ Likely Counterfeit'}
                        </div>
                    </div>

                    <div className="ingredients-list">
                        <h4>Ingredient Analysis</h4>
                        {analysis.ingredients.map((ing, i) => (
                            <div key={i} className="ingredient-item">
                                <span className="ingredient-name">{ing.name}</span>
                                <span className={`ingredient-status ${ing.safe ? 'safe' : 'unsafe'}`}>
                                    {ing.safe ? '✓ Safe' : '⚠️ Unsafe'}
                                </span>
                                <span className="ingredient-percentage">{ing.percentage}%</span>
                            </div>
                        ))}
                    </div>

                    {analysis.warnings.length > 0 && (
                        <div className="warnings">
                            <h4>⚠️ Warnings</h4>
                            {analysis.warnings.map((warning, i) => (
                                <div key={i} className="warning-item">{warning}</div>
                            ))}
                        </div>
                    )}

                    {analysis.recommendations.length > 0 && (
                        <div className="recommendations">
                            <h4>📋 Recommendations</h4>
                            {analysis.recommendations.map((rec, i) => (
                                <div key={i} className="recommendation-item">{rec}</div>
                            ))}
                        </div>
                    )}

                    <div className="skin-types">
                        <h4>Suitable for Skin Types:</h4>
                        <div className="skin-tags">
                            {analysis.skinTypes.map((type, i) => (
                                <span key={i} className="skin-tag">{type}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="scan-history">
                    <h3>Recent Scans</h3>
                    {history.map(item => (
                        <div key={item.id} className="history-item">
                            <span className="history-time">{item.timestamp.toLocaleString()}</span>
                            <span className="history-score" style={{ color: getScoreColor(item.score) }}>Score: {Math.round(item.score)}%</span>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .cream-detection { padding: 20px; background: #f8f9fa; min-height: 100vh; }
        .detection-header { margin-bottom: 30px; }
        .detection-header h2 { margin: 0 0 10px 0; color: #333; }
        .detection-header p { margin: 0; color: #666; }
        .upload-section { background: white; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
        .upload-area { border: 2px dashed #ddd; border-radius: 8px; padding: 40px; cursor: pointer; margin-bottom: 20px; transition: all 0.2s; }
        .upload-area:hover { border-color: #007bff; background: #f8f9fa; }
        .uploaded-image { max-width: 100%; max-height: 300px; object-fit: contain; }
        .upload-icon { font-size: 48px; margin-bottom: 10px; }
        .upload-hint { font-size: 12px; color: #999; display: block; margin-top: 10px; }
        .btn-analyze { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
        .analyzing-state { text-align: center; padding: 40px; background: white; border-radius: 12px; margin-bottom: 30px; }
        .spinner { width: 50px; height: 50px; border: 4px solid #e0e0e0; border-top-color: #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-steps { margin-top: 20px; }
        .step { padding: 5px 0; color: #666; }
        .results-section { background: white; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
        .score-container { text-align: center; margin-bottom: 30px; }
        .score-label { font-size: 18px; font-weight: bold; margin-top: 10px; }
        .authenticity { margin-bottom: 20px; }
        .authenticity-bar { height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .authenticity-fill { height: 100%; transition: width 0.3s ease; }
        .ingredients-list { margin-bottom: 20px; }
        .ingredient-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #e0e0e0; }
        .ingredient-status.safe { color: #28a745; } .ingredient-status.unsafe { color: #dc3545; }
        .warnings { background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .warning-item { color: #856404; margin: 5px 0; }
        .recommendations { background: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .recommendation-item { color: #155724; margin: 5px 0; }
        .skin-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .skin-tag { background: #e7f3ff; color: #007bff; padding: 5px 12px; border-radius: 20px; font-size: 13px; }
        .scan-history { background: white; padding: 20px; border-radius: 12px; }
        .history-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #e0e0e0; }
      `}</style>
        </div>
    );
};

export default CreamDetections;
