import React, { useState, useEffect } from 'react';

const CrimeDatabases = () => {
  const [crimes, setCrimes] = useState([]);
  const [filteredCrimes, setFilteredCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    pending: 0,
    categories: {}
  });

  useEffect(() => {
    fetchCrimeData();
  }, []);

  useEffect(() => {
    filterCrimes();
  }, [searchTerm, filterType, crimes]);

  const fetchCrimeData = async () => {
    try {
      // Simulate API call
      const mockCrimes = [
        {
          id: 1,
          caseNumber: 'CR2024001',
          type: 'Theft',
          description: 'Mobile phone theft at shopping mall',
          location: 'Downtown Mall',
          date: '2024-01-15',
          status: 'Solved',
          severity: 'Medium',
          reportedBy: 'John Doe',
          officerInCharge: 'Officer Smith',
          evidence: ['CCTV footage', 'Witness statement'],
          suspects: ['Unknown male'],
          resolution: 'Suspect arrested and charged'
        },
        {
          id: 2,
          caseNumber: 'CR2024002',
          type: 'Assault',
          description: 'Physical assault in parking lot',
          location: 'Central Parking',
          date: '2024-01-14',
          status: 'Pending',
          severity: 'High',
          reportedBy: 'Jane Smith',
          officerInCharge: 'Officer Johnson',
          evidence: ['Medical report', 'Vehicle description'],
          suspects: ['White sedan driver'],
          resolution: 'Under investigation'
        },
        {
          id: 3,
          caseNumber: 'CR2024003',
          type: 'Fraud',
          description: 'Online banking fraud',
          location: 'Virtual',
          date: '2024-01-13',
          status: 'Investigating',
          severity: 'High',
          reportedBy: 'Robert Brown',
          officerInCharge: 'Detective Williams',
          evidence: ['Transaction records', 'IP addresses'],
          suspects: ['Unknown'],
          resolution: 'Tracking digital footprint'
        },
        {
          id: 4,
          caseNumber: 'CR2024004',
          type: 'Vandalism',
          description: 'Graffiti on public property',
          location: 'City Park',
          date: '2024-01-12',
          status: 'Solved',
          severity: 'Low',
          reportedBy: 'Park Authority',
          officerInCharge: 'Officer Davis',
          evidence: ['Security footage', 'Paint samples'],
          suspects: ['Teenage group'],
          resolution: 'Community service assigned'
        },
        {
          id: 5,
          caseNumber: 'CR2024005',
          type: 'Cyber Crime',
          description: 'Phishing attack on company',
          location: 'Business District',
          date: '2024-01-11',
          status: 'Investigating',
          severity: 'Critical',
          reportedBy: 'Tech Corp',
          officerInCharge: 'Cyber Crime Unit',
          evidence: ['Email logs', 'Server records'],
          suspects: ['International group'],
          resolution: 'International cooperation initiated'
        }
      ];

      setCrimes(mockCrimes);
      setFilteredCrimes(mockCrimes);
      calculateStats(mockCrimes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crime data:', error);
      setLoading(false);
    }
  };

  const calculateStats = (crimesData) => {
    const total = crimesData.length;
    const solved = crimesData.filter(c => c.status === 'Solved').length;
    const pending = crimesData.filter(c => c.status === 'Pending').length;
    
    const categories = {};
    crimesData.forEach(crime => {
      categories[crime.type] = (categories[crime.type] || 0) + 1;
    });

    setStats({ total, solved, pending, categories });
  };

  const filterCrimes = () => {
    let filtered = [...crimes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(crime =>
        crime.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crime.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crime.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crime.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(crime => crime.type === filterType);
    }

    setFilteredCrimes(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return '#28a745';
      case 'Pending': return '#dc3545';
      case 'Investigating': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="crime-databases">
      <div className="database-header">
        <h2>Crime Database</h2>
        <p>Comprehensive crime records and case management system</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.solved}</div>
          <div className="stat-label">Solved Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(stats.categories).length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by case number, type, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {Object.keys(stats.categories).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading crime data...</div>
      ) : (
        <>
          {/* Crime List */}
          <div className="crime-list">
            {filteredCrimes.map(crime => (
              <div key={crime.id} className="crime-card" onClick={() => setSelectedCrime(crime)}>
                <div className="crime-header">
                  <div className="crime-case-number">{crime.caseNumber}</div>
                  <div className="crime-status" style={{ backgroundColor: getStatusColor(crime.status) }}>
                    {crime.status}
                  </div>
                </div>
                <div className="crime-type">
                  <span className="type-badge" style={{ backgroundColor: getSeverityColor(crime.severity) }}>
                    {crime.type}
                  </span>
                  <span className="severity-badge">{crime.severity}</span>
                </div>
                <div className="crime-description">{crime.description}</div>
                <div className="crime-details">
                  <span>📍 {crime.location}</span>
                  <span>📅 {crime.date}</span>
                  <span>👤 {crime.reportedBy}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Crime Details */}
          {selectedCrime && (
            <div className="modal-overlay" onClick={() => setSelectedCrime(null)}>
              <div className="crime-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedCrime(null)}>×</button>
                <h3>{selectedCrime.caseNumber} - {selectedCrime.type}</h3>
                <div className="modal-content">
                  <div className="info-section">
                    <h4>Case Details</h4>
                    <p><strong>Description:</strong> {selectedCrime.description}</p>
                    <p><strong>Location:</strong> {selectedCrime.location}</p>
                    <p><strong>Date:</strong> {selectedCrime.date}</p>
                    <p><strong>Status:</strong> {selectedCrime.status}</p>
                    <p><strong>Severity:</strong> {selectedCrime.severity}</p>
                  </div>
                  <div className="info-section">
                    <h4>Investigation</h4>
                    <p><strong>Officer in Charge:</strong> {selectedCrime.officerInCharge}</p>
                    <p><strong>Reported By:</strong> {selectedCrime.reportedBy}</p>
                    <p><strong>Resolution:</strong> {selectedCrime.resolution}</p>
                  </div>
                  <div className="info-section">
                    <h4>Evidence</h4>
                    <ul>
                      {selectedCrime.evidence.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="info-section">
                    <h4>Suspects</h4>
                    <ul>
                      {selectedCrime.suspects.map((suspect, idx) => (
                        <li key={idx}>{suspect}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .crime-databases {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .database-header {
          margin-bottom: 30px;
        }

        .database-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .database-header p {
          margin: 0;
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
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

        .filters-section {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 10px 35px 10px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .filters-section select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .crime-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .crime-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .crime-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .crime-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .crime-case-number {
          font-weight: bold;
          color: #007bff;
          font-size: 14px;
        }

        .crime-status {
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .crime-type {
          margin-bottom: 10px;
        }

        .type-badge, .severity-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-right: 8px;
          color: white;
        }

        .crime-description {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .crime-details {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #999;
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

        .crime-modal {
          background: white;
          border-radius: 8px;
          padding: 30px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .modal-content {
          margin-top: 20px;
        }

        .info-section {
          margin-bottom: 20px;
        }

        .info-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .info-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CrimeDatabases;
