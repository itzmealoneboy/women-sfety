import React, { useState, useEffect } from 'react';

const SchemesData = () => {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState({});

  useEffect(() => {
    fetchSchemesData();
  }, []);

  const fetchSchemesData = async () => {
    try {
      // Simulate API call
      const mockSchemes = [
        {
          id: 1,
          name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
          category: 'Financial Inclusion',
          department: 'Ministry of Finance',
          description: 'Financial inclusion program to ensure access to financial services.',
          benefits: [
            'Zero balance savings account',
            'Accidental insurance cover of ₹2 lakhs',
            'Life insurance cover of ₹30,000',
            'Overdraft facility up to ₹10,000',
            'RuPay debit card with in-built insurance'
          ],
          eligibility: [
            'Any Indian citizen',
            'No minimum balance requirement',
            'Valid KYC documents'
          ],
          documents: ['Aadhaar Card', 'Voter ID', 'Passport', 'Driving License'],
          applicationProcess: 'Visit any bank branch with KYC documents',
          deadline: 'Ongoing',
          icon: '🏦',
          status: 'Active',
          successRate: '85%'
        },
        {
          id: 2,
          name: 'Pradhan Mantri Awas Yojana (PMAY)',
          category: 'Housing',
          department: 'Ministry of Housing and Urban Affairs',
          description: 'Housing scheme for urban poor and rural areas.',
          benefits: [
            'Interest subsidy up to 6.5%',
            'Subsidy amount up to ₹2.67 lakhs',
            'Priority for women and economically weaker sections',
            'Affordable housing loans'
          ],
          eligibility: [
            'Women and economically weaker sections',
            'No existing pucca house in family',
            'Annual income criteria (EWS/LIG/MIG)'
          ],
          documents: ['Aadhaar Card', 'Income Certificate', 'Bank Statements', 'Property Documents'],
          applicationProcess: 'Apply online through PMAY portal or CSC centers',
          deadline: '2025-03-31',
          icon: '🏠',
          status: 'Active',
          successRate: '78%'
        },
        {
          id: 3,
          name: 'Ayushman Bharat - PMJAY',
          category: 'Healthcare',
          department: 'Ministry of Health',
          description: 'World\'s largest government-funded healthcare scheme.',
          benefits: [
            'Health cover of ₹5 lakh per family per year',
            'Cashless treatment in empaneled hospitals',
            'Coverage for secondary and tertiary care',
            'No cap on family size and age'
          ],
          eligibility: [
            'Families identified from SECC database',
            'Deprived rural families and urban workers',
            'RTI/PMJAY eligible categories'
          ],
          documents: ['Aadhaar Card', 'Ration Card', 'SECC ID', 'Mobile Number'],
          applicationProcess: 'Check eligibility at nearest CSC or hospital',
          deadline: 'Ongoing',
          icon: '🏥',
          status: 'Active',
          successRate: '92%'
        },
        {
          id: 4,
          name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
          category: 'Agriculture',
          department: 'Ministry of Agriculture',
          description: 'Income support for small and marginal farmers.',
          benefits: [
            '₹6,000 per year in three installments',
            'Direct Benefit Transfer to bank accounts',
            'Support for farming activities',
            'Coverage for all landholding farmers'
          ],
          eligibility: [
            'Small and marginal farmers',
            'Landholding farmers',
            'Families with cultivable land'
          ],
          documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
          applicationProcess: 'Register at local agriculture office or CSC',
          deadline: 'Ongoing',
          icon: '🌾',
          status: 'Active',
          successRate: '95%'
        },
        {
          id: 5,
          name: 'National Scholarship Portal',
          category: 'Education',
          department: 'Ministry of Education',
          description: 'Centralized platform for various scholarship schemes.',
          benefits: [
            'Merit-based scholarships',
            'Means-based financial assistance',
            'Scholarships for SC/ST/OBC',
            'Minority scholarship programs'
          ],
          eligibility: [
            'Students from class 1 to PhD',
            'Income criteria varies by scheme',
            'Minimum percentage requirements',
            'Category-specific benefits'
          ],
          documents: ['Aadhaar Card', 'Income Certificate', 'Marksheets', 'Bank Account Details'],
          applicationProcess: 'Apply online through National Scholarship Portal',
          deadline: '2024-12-31',
          icon: '🎓',
          status: 'Active',
          successRate: '88%'
        },
        {
          id: 6,
          name: 'Stand Up India Scheme',
          category: 'Entrepreneurship',
          department: 'Ministry of Finance',
          description: 'Promoting entrepreneurship among SC/ST and women.',
          benefits: [
            'Bank loans from ₹10 lakh to ₹1 crore',
            'Composite loan for greenfield enterprises',
            'Coverage for manufacturing and services',
            'Margin money up to 25%'
          ],
          eligibility: [
            'SC/ST and Women entrepreneurs',
            'Greenfield enterprise',
            'Age 18+ years',
            'No default history'
          ],
          documents: ['Business Plan', 'KYC Documents', 'Caste Certificate', 'Project Report'],
          applicationProcess: 'Apply through participating bank branches',
          deadline: 'Ongoing',
          icon: '💼',
          status: 'Active',
          successRate: '72%'
        },
        {
          id: 7,
          name: 'Ujjwala Yojana',
          category: 'Energy',
          department: 'Ministry of Petroleum',
          description: 'Free LPG connections for BPL families.',
          benefits: [
            'Free LPG connection',
            'First refill and stove provided',
            'EMI facility for subsequent refills',
            'Cash assistance for first refill'
          ],
          eligibility: [
            'BPL families',
            'Women above 18 years',
            'No existing LPG connection in family'
          ],
          documents: ['Aadhaar Card', 'BPL Ration Card', 'Bank Account'],
          applicationProcess: 'Apply at nearest LPG distributor',
          deadline: 'Ongoing',
          icon: '🔥',
          status: 'Active',
          successRate: '94%'
        },
        {
          id: 8,
          name: 'Digital India Initiative',
          category: 'Technology',
          department: 'Ministry of Electronics & IT',
          description: 'Digital empowerment and infrastructure development.',
          benefits: [
            'Digital literacy programs',
            'Common Service Centers access',
            'E-governance services',
            'Mobile connectivity in villages'
          ],
          eligibility: [
            'All Indian citizens',
            'Priority to rural areas',
            'Students and professionals'
          ],
          documents: ['Aadhaar Card', 'Residence Proof'],
          applicationProcess: 'Visit Common Service Center (CSC)',
          deadline: 'Ongoing',
          icon: '💻',
          status: 'Active',
          successRate: '90%'
        }
      ];

      const mockCategories = [
        { id: 'all', name: 'All Schemes' },
        { id: 'Financial Inclusion', name: 'Financial Inclusion' },
        { id: 'Housing', name: 'Housing' },
        { id: 'Healthcare', name: 'Healthcare' },
        { id: 'Agriculture', name: 'Agriculture' },
        { id: 'Education', name: 'Education' },
        { id: 'Entrepreneurship', name: 'Entrepreneurship' },
        { id: 'Energy', name: 'Energy' },
        { id: 'Technology', name: 'Technology' }
      ];

      setSchemes(mockSchemes);
      setCategories(mockCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schemes data:', error);
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEligibility = eligibilityFilter === 'all' || 
                              (eligibilityFilter === 'women' && scheme.eligibility.some(e => e.toLowerCase().includes('women'))) ||
                              (eligibilityFilter === 'students' && scheme.category === 'Education') ||
                              (eligibilityFilter === 'farmers' && scheme.category === 'Agriculture');
    return matchesCategory && matchesSearch && matchesEligibility;
  });

  const applyForScheme = (schemeId) => {
    setApplications({
      ...applications,
      [schemeId]: 'applied'
    });
    alert('Application submitted successfully! You will receive updates via email.');
  };

  return (
    <div className="schemes-data">
      <div className="schemes-header">
        <h2>Government Schemes & Initiatives</h2>
        <p>Explore welfare schemes, subsidies, and government programs</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search schemes by name, department or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-group">
          <select value={eligibilityFilter} onChange={(e) => setEligibilityFilter(e.target.value)}>
            <option value="all">All Beneficiaries</option>
            <option value="women">Women</option>
            <option value="students">Students</option>
            <option value="farmers">Farmers</option>
          </select>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">Loading schemes...</div>
      ) : (
        <>
          <div className="schemes-grid">
            {filteredSchemes.map(scheme => (
              <div key={scheme.id} className="scheme-card">
                <div className="scheme-icon">{scheme.icon}</div>
                <div className="scheme-content">
                  <div className="scheme-header">
                    <h3>{scheme.name}</h3>
                    <span className={`scheme-status ${scheme.status.toLowerCase()}`}>
                      {scheme.status}
                    </span>
                  </div>
                  <p className="scheme-category">{scheme.category}</p>
                  <p className="scheme-description">{scheme.description}</p>
                  
                  <div className="scheme-stats">
                    <div className="stat">
                      <span className="stat-label">Success Rate</span>
                      <span className="stat-value">{scheme.successRate}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Department</span>
                      <span className="stat-value">{scheme.department}</span>
                    </div>
                  </div>

                  <div className="scheme-actions">
                    <button 
                      className="btn-details"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      View Details
                    </button>
                    {applications[scheme.id] !== 'applied' ? (
                      <button 
                        className="btn-apply"
                        onClick={() => applyForScheme(scheme.id)}
                      >
                        Apply Now
                      </button>
                    ) : (
                      <span className="applied-badge">✓ Applied</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scheme Details Modal */}
          {selectedScheme && (
            <div className="modal-overlay" onClick={() => setSelectedScheme(null)}>
              <div className="scheme-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedScheme(null)}>×</button>
                <div className="modal-header">
                  <div className="scheme-icon-large">{selectedScheme.icon}</div>
                  <div>
                    <h2>{selectedScheme.name}</h2>
                    <p className="modal-category">{selectedScheme.category}</p>
                  </div>
                </div>

                <div className="modal-content">
                  <div className="info-section">
                    <h4>Description</h4>
                    <p>{selectedScheme.description}</p>
                  </div>

                  <div className="info-section">
                    <h4>Benefits</h4>
                    <ul>
                      {selectedScheme.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="info-section">
                    <h4>Eligibility Criteria</h4>
                    <ul>
                      {selectedScheme.eligibility.map((criteria, idx) => (
                        <li key={idx}>{criteria}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="info-section">
                    <h4>Required Documents</h4>
                    <ul>
                      {selectedScheme.documents.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="info-section">
                    <h4>Application Process</h4>
                    <p>{selectedScheme.applicationProcess}</p>
                  </div>

                  <div className="info-section">
                    <h4>Deadline</h4>
                    <p className="deadline">{selectedScheme.deadline === 'Ongoing' ? '🟢 Ongoing' : `📅 ${selectedScheme.deadline}`}</p>
                  </div>

                  <div className="modal-actions">
                    {applications[selectedScheme.id] !== 'applied' ? (
                      <button 
                        className="btn-apply-large"
                        onClick={() => {
                          applyForScheme(selectedScheme.id);
                          setSelectedScheme(null);
                        }}
                      >
                        Apply Now
                      </button>
                    ) : (
                      <span className="applied-badge-large">✓ Application Submitted</span>
                    )}
                    <button 
                      className="btn-close"
                      onClick={() => setSelectedScheme(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .schemes-data {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .schemes-header {
          margin-bottom: 30px;
        }

        .schemes-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .schemes-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .filters-section {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .filter-group select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .category-tab {
          padding: 8px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
          border-radius: 20px;
        }

        .category-tab:hover {
          background: #f0f0f0;
        }

        .category-tab.active {
          background: #007bff;
          color: white;
        }

        .schemes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .scheme-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .scheme-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .scheme-icon {
          font-size: 48px;
        }

        .scheme-content {
          flex: 1;
        }

        .scheme-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }

        .scheme-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .scheme-status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .scheme-status.active {
          background: #d4edda;
          color: #155724;
        }

        .scheme-category {
          color: #007bff;
          font-size: 12px;
          margin: 0 0 10px 0;
        }

        .scheme-description {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 15px 0;
        }

        .scheme-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          padding: 10px 0;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 11px;
          color: #999;
        }

        .stat-value {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .scheme-actions {
          display: flex;
          gap: 10px;
        }

        .btn-details, .btn-apply {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .btn-details {
          background: #f0f0f0;
          color: #666;
        }

        .btn-details:hover {
          background: #e0e0e0;
        }

        .btn-apply {
          background: #28a745;
          color: white;
        }

        .btn-apply:hover {
          background: #218838;
        }

        .applied-badge {
          padding: 8px 16px;
          background: #d4edda;
          color: #155724;
          border-radius: 6px;
          font-size: 13px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .scheme-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 700px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #999;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .scheme-icon-large {
          font-size: 60px;
        }

        .modal-header h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .modal-category {
          color: #007bff;
          margin: 0;
        }

        .info-section {
          margin-bottom: 25px;
        }

        .info-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .info-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-section li {
          margin-bottom: 8px;
          color: #666;
        }

        .deadline {
          color: #dc3545;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-apply-large {
          flex: 1;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-close {
          padding: 12px 24px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .applied-badge-large {
          flex: 1;
          padding: 12px;
          background: #d4edda;
          color: #155724;
          text-align: center;
          border-radius: 6px;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
          }
          
          .schemes-grid {
            grid-template-columns: 1fr;
          }
          
          .scheme-card {
            flex-direction: column;
            text-align: center;
          }
          
          .modal-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SchemesData;
