import React, { useState, useEffect } from 'react';

const SchemeComparisons = () => {
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const mockSchemes = [
        {
          id: 1,
          name: 'Pradhan Mantri Awas Yojana',
          category: 'Housing',
          ministry: 'Ministry of Housing',
          benefits: 'Housing loan subsidy up to ₹2.67 lakhs',
          eligibility: 'EWS/LIG/MIG categories, no existing pucca house',
          documents: ['Aadhaar', 'Income Certificate', 'Property Documents'],
          amount: 'Up to ₹2.67 lakhs subsidy',
          interestRate: '6.5% subsidized',
          duration: '20 years',
          rating: 4.5,
          applications: '1.2 Cr+',
          successRate: '78%'
        },
        {
          id: 2,
          name: 'PM Kisan Samman Nidhi',
          category: 'Agriculture',
          ministry: 'Ministry of Agriculture',
          benefits: '₹6,000 per year income support',
          eligibility: 'Small and marginal farmers with landholding',
          documents: ['Land Records', 'Aadhaar', 'Bank Account'],
          amount: '₹6,000/year',
          interestRate: 'N/A',
          duration: 'Ongoing',
          rating: 4.8,
          applications: '11 Cr+',
          successRate: '95%'
        },
        {
          id: 3,
          name: 'Ayushman Bharat',
          category: 'Healthcare',
          ministry: 'Ministry of Health',
          benefits: 'Health insurance cover of ₹5 lakh per family',
          eligibility: 'SECC database identified families',
          documents: ['Aadhaar', 'Ration Card', 'Income Certificate'],
          amount: '₹5 lakhs per family/year',
          interestRate: 'N/A',
          duration: 'Annual',
          rating: 4.7,
          applications: '12 Cr+',
          successRate: '92%'
        },
        {
          id: 4,
          name: 'National Scholarship Portal',
          category: 'Education',
          ministry: 'Ministry of Education',
          benefits: 'Merit and means-based scholarships',
          eligibility: 'Students from Class 1 to PhD',
          documents: ['Marksheets', 'Income Certificate', 'Caste Certificate'],
          amount: '₹5,000 - ₹50,000/year',
          interestRate: 'N/A',
          duration: 'Academic year',
          rating: 4.3,
          applications: '2 Cr+',
          successRate: '88%'
        },
        {
          id: 5,
          name: 'Stand Up India',
          category: 'Entrepreneurship',
          ministry: 'Ministry of Finance',
          benefits: 'Loans for SC/ST and women entrepreneurs',
          eligibility: 'SC/ST and women entrepreneurs, greenfield enterprise',
          documents: ['Business Plan', 'KYC', 'Project Report'],
          amount: '₹10 lakhs - ₹1 crore',
          interestRate: 'Base rate + 2-3%',
          duration: '5-7 years',
          rating: 4.2,
          applications: '1.5 Lakh+',
          successRate: '72%'
        }
      ];

      const mockCategories = [
        { id: 'all', name: 'All Schemes' },
        { id: 'Housing', name: 'Housing' },
        { id: 'Agriculture', name: 'Agriculture' },
        { id: 'Healthcare', name: 'Healthcare' },
        { id: 'Education', name: 'Education' },
        { id: 'Entrepreneurship', name: 'Entrepreneurship' }
      ];

      setSchemes(mockSchemes);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const handleSchemeSelect = (schemeId) => {
    if (selectedSchemes.includes(schemeId)) {
      setSelectedSchemes(selectedSchemes.filter(id => id !== schemeId));
    } else if (selectedSchemes.length < 3) {
      setSelectedSchemes([...selectedSchemes, schemeId]);
    }
  };

  const generateComparison = () => {
    const selected = schemes.filter(scheme => selectedSchemes.includes(scheme.id));
    setComparisonData(selected);
  };

  const clearComparison = () => {
    setSelectedSchemes([]);
    setComparisonData(null);
  };

  const filteredSchemes = selectedCategory === 'all' 
    ? schemes 
    : schemes.filter(scheme => scheme.category === selectedCategory);

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <span className="stars">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="scheme-comparisons">
      <div className="comparison-header">
        <h2>Scheme Comparisons</h2>
        <p>Compare government schemes side by side to make informed decisions</p>
      </div>

      {/* Selection Panel */}
      <div className="selection-panel">
        <div className="selection-info">
          <div className="selected-count">
            Selected Schemes: {selectedSchemes.length}/3
          </div>
          {selectedSchemes.length > 0 && (
            <div className="selection-actions">
              <button onClick={generateComparison} className="btn-compare">
                Compare Selected
              </button>
              <button onClick={clearComparison} className="btn-clear">
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="category-filter">
          <label>Filter by Category:</label>
          <div className="category-buttons">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="schemes-grid">
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} className={`scheme-select-card ${selectedSchemes.includes(scheme.id) ? 'selected' : ''}`}>
            <div className="select-checkbox">
              <input
                type="checkbox"
                checked={selectedSchemes.includes(scheme.id)}
                onChange={() => handleSchemeSelect(scheme.id)}
                disabled={!selectedSchemes.includes(scheme.id) && selectedSchemes.length >= 3}
              />
            </div>
            <div className="scheme-basic-info">
              <h3>{scheme.name}</h3>
              <span className="category-tag">{scheme.category}</span>
              <div className="rating">{getRatingStars(scheme.rating)} ({scheme.rating})</div>
              <p className="benefits-preview">{scheme.benefits}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {comparisonData && comparisonData.length > 0 && (
        <div className="comparison-table">
          <div className="comparison-header">
            <h3>Scheme Comparison</h3>
            <button onClick={clearComparison} className="close-comparison">×</button>
          </div>
          
          <div className="table-container">
            <table className="comparison-grid">
              <thead>
                <tr>
                  <th>Parameter</th>
                  {comparisonData.map(scheme => (
                    <th key={scheme.id}>{scheme.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="parameter">Ministry</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>{scheme.ministry}</td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Benefits</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>{scheme.benefits}</td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Eligibility</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>{scheme.eligibility}</td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Amount/Benefit</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id} className="highlight">{scheme.amount}</td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Documents Required</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>
                      <ul className="doc-list">
                        {scheme.documents.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Duration</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>{scheme.duration}</td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Success Rate</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>
                      <div className="success-rate">
                        <div className="rate-bar">
                          <div className="rate-fill" style={{ width: scheme.successRate, backgroundColor: '#28a745' }} />
                        </div>
                        {scheme.successRate}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Total Applications</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>{scheme.applications}</td>
                  ))}
                </tr>
                <tr>
                  <td className="parameter">Rating</td>
                  {comparisonData.map(scheme => (
                    <td key={scheme.id}>{getRatingStars(scheme.rating)} ({scheme.rating})</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="comparison-actions">
            <button className="btn-apply">Apply for Selected Scheme</button>
            <button className="btn-download">Download Comparison</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scheme-comparisons {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .comparison-header {
          margin-bottom: 30px;
        }

        .comparison-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .comparison-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .selection-panel {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .selection-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .selected-count {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .selection-actions {
          display: flex;
          gap: 10px;
        }

        .btn-compare, .btn-clear {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-compare {
          background: #007bff;
          color: white;
        }

        .btn-compare:hover {
          background: #0056b3;
        }

        .btn-clear {
          background: #6c757d;
          color: white;
        }

        .category-filter {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .category-filter label {
          font-size: 14px;
          color: #666;
        }

        .category-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cat-btn {
          padding: 6px 12px;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-btn:hover {
          background: #e0e0e0;
        }

        .cat-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .schemes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .scheme-select-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          position: relative;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .scheme-select-card.selected {
          border: 2px solid #007bff;
          background: #f0f8ff;
        }

        .select-checkbox {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .select-checkbox input {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .scheme-basic-info h3 {
          margin: 0 0 10px 0;
          color: #333;
          padding-right: 30px;
        }

        .category-tag {
          display: inline-block;
          padding: 4px 8px;
          background: #e7f3ff;
          color: #007bff;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .rating {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .stars {
          color: #ffc107;
        }

        .benefits-preview {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .comparison-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-top: 30px;
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          margin: 0;
        }

        .comparison-header h3 {
          margin: 0;
          color: #333;
        }

        .close-comparison {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .table-container {
          overflow-x: auto;
        }

        .comparison-grid {
          width: 100%;
          border-collapse: collapse;
        }

        .comparison-grid th,
        .comparison-grid td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
          vertical-align: top;
        }

        .comparison-grid th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .parameter {
          font-weight: 500;
          color: #666;
          background: #fafafa;
          width: 200px;
        }

        .highlight {
          font-weight: bold;
          color: #28a745;
        }

        .doc-list {
          margin: 0;
          padding-left: 20px;
        }

        .doc-list li {
          margin-bottom: 4px;
          font-size: 13px;
        }

        .success-rate {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rate-bar {
          flex: 1;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .rate-fill {
          height: 100%;
        }

        .comparison-actions {
          padding: 20px;
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          border-top: 1px solid #e0e0e0;
        }

        .btn-apply, .btn-download {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-apply {
          background: #28a745;
          color: white;
        }

        .btn-download {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .schemes-grid {
            grid-template-columns: 1fr;
          }
          
          .selection-info {
            flex-direction: column;
            align-items: stretch;
          }
          
          .comparison-grid th,
          .comparison-grid td {
            padding: 10px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default SchemeComparisons;
