import React, { useState, useEffect } from 'react';

const RightsData = () => {
  const [rights, setRights] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRight, setSelectedRight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRightsData();
  }, []);

  const fetchRightsData = async () => {
    try {
      // Simulate API call
      const mockRights = [
        {
          id: 1,
          title: 'Right to Equality',
          category: 'Fundamental Rights',
          description: 'All citizens are equal before the law and have equal protection of laws.',
          articles: ['Article 14', 'Article 15', 'Article 16', 'Article 17', 'Article 18'],
          details: `The Right to Equality ensures that all citizens are treated equally without any discrimination. It includes:
            • Equality before law
            • Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth
            • Equality of opportunity in matters of public employment
            • Abolition of untouchability
            • Abolition of titles`,
          resources: ['Constitution of India - Part III', 'Human Rights Commission', 'Legal Aid Services'],
          icon: '⚖️'
        },
        {
          id: 2,
          title: 'Right to Freedom',
          category: 'Fundamental Rights',
          description: 'Guarantees various freedoms including speech, assembly, movement, and profession.',
          articles: ['Article 19', 'Article 20', 'Article 21', 'Article 22'],
          details: `The Right to Freedom includes:
            • Freedom of speech and expression
            • Freedom to assemble peacefully
            • Freedom to form associations
            • Freedom to move freely throughout India
            • Freedom to reside and settle in any part of India
            • Freedom to practice any profession
            • Protection in respect of conviction for offenses
            • Protection of life and personal liberty`,
          resources: ['Constitution of India - Part III', 'Supreme Court Judgments', 'Legal Aid Services'],
          icon: '🕊️'
        },
        {
          id: 3,
          title: 'Right against Exploitation',
          category: 'Fundamental Rights',
          description: 'Prohibits human trafficking, forced labor, and child labor.',
          articles: ['Article 23', 'Article 24'],
          details: `The Right against Exploitation prohibits:
            • Traffic in human beings and forced labor
            • Employment of children below 14 years in hazardous occupations
            • Begar (forced labor without payment)`,
          resources: ['Child Labour Act', 'Bonded Labour System Act', 'NHRC Guidelines'],
          icon: '🚫'
        },
        {
          id: 4,
          title: 'Right to Freedom of Religion',
          category: 'Fundamental Rights',
          description: 'Ensures freedom of conscience and free profession, practice, and propagation of religion.',
          articles: ['Article 25', 'Article 26', 'Article 27', 'Article 28'],
          details: `The Right to Freedom of Religion guarantees:
            • Freedom of conscience and free profession of religion
            • Freedom to manage religious affairs
            • Freedom from taxation for promotion of any religion
            • Freedom from religious instruction in state-funded institutions`,
          resources: ['Constitution of India', 'Religious Institutions Act', 'Minority Rights'],
          icon: '🕌'
        },
        {
          id: 5,
          title: 'Right to Education',
          category: 'Legal Rights',
          description: 'Right to free and compulsory education for children aged 6-14 years.',
          articles: ['Article 21A', 'RTE Act 2009'],
          details: `The Right to Education ensures:
            • Free and compulsory education for children between 6-14 years
            • Quality education in neighborhood schools
            • No detention until completion of elementary education
            • 25% reservation for disadvantaged children in private schools`,
          resources: ['Right to Education Act', 'Sarva Shiksha Abhiyan', 'Mid-Day Meal Scheme'],
          icon: '📚'
        },
        {
          id: 6,
          title: 'Right to Information',
          category: 'Legal Rights',
          description: 'Citizens have the right to access information from public authorities.',
          articles: ['RTI Act 2005'],
          details: `The Right to Information provides:
            • Access to information held by public authorities
            • Proactive disclosure of information
            • Appointment of Public Information Officers
            • Time-bound response to requests
            • Penalty for non-compliance`,
          resources: ['RTI Act 2005', 'Central Information Commission', 'State Information Commissions'],
          icon: 'ℹ️'
        },
        {
          id: 7,
          title: 'Right to Constitutional Remedies',
          category: 'Fundamental Rights',
          description: 'Right to move to courts for enforcement of fundamental rights.',
          articles: ['Article 32'],
          details: `The Right to Constitutional Remedies allows:
            • Filing writ petitions (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto)
            • Supreme Court as the guarantor of fundamental rights
            • Enforcement of rights through courts
            • Power to issue directions and orders`,
          resources: ['Supreme Court', 'High Courts', 'Legal Aid'],
          icon: '🏛️'
        },
        {
          id: 8,
          title: 'Consumer Rights',
          category: 'Consumer Rights',
          description: 'Protection against unfair trade practices and defective goods/services.',
          articles: ['Consumer Protection Act 2019'],
          details: `Consumer Rights include:
            • Right to safety
            • Right to be informed
            • Right to choose
            • Right to be heard
            • Right to seek redressal
            • Right to consumer education`,
          resources: ['Consumer Courts', 'Consumer Helpline', 'Consumer Protection Councils'],
          icon: '🛒'
        },
        {
          id: 9,
          title: 'Women Rights',
          category: 'Special Rights',
          description: 'Special provisions and protections for women under the law.',
          articles: ['Article 15(3)', 'Various Acts'],
          details: `Women's Rights include:
            • Equal pay for equal work
            • Protection against harassment at workplace
            • Maternity benefits
            • Right to dignity and safety
            • Special provisions in criminal law
            • Property rights`,
          resources: ['Women Helpline', 'National Commission for Women', 'Domestic Violence Act'],
          icon: '👩'
        },
        {
          id: 10,
          title: 'Child Rights',
          category: 'Special Rights',
          description: 'Special protections and rights for children.',
          articles: ['Article 15(3)', 'Juvenile Justice Act'],
          details: `Children's Rights include:
            • Right to survival and development
            • Right to protection from exploitation
            • Right to participation
            • Right to education
            • Protection from child labor
            • Juvenile justice system`,
          resources: ['Child Helpline', 'National Commission for Protection of Child Rights', 'Juvenile Justice Board'],
          icon: '👶'
        }
      ];

      const mockCategories = [
        { id: 'all', name: 'All Rights', count: mockRights.length },
        { id: 'Fundamental Rights', name: 'Fundamental Rights', count: mockRights.filter(r => r.category === 'Fundamental Rights').length },
        { id: 'Legal Rights', name: 'Legal Rights', count: mockRights.filter(r => r.category === 'Legal Rights').length },
        { id: 'Consumer Rights', name: 'Consumer Rights', count: mockRights.filter(r => r.category === 'Consumer Rights').length },
        { id: 'Special Rights', name: 'Special Rights', count: mockRights.filter(r => r.category === 'Special Rights').length }
      ];

      setRights(mockRights);
      setCategories(mockCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rights data:', error);
      setLoading(false);
    }
  };

  const filteredRights = rights.filter(right => {
    const matchesCategory = selectedCategory === 'all' || right.category === selectedCategory;
    const matchesSearch = right.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         right.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="rights-data">
      <div className="rights-header">
        <h2>Know Your Rights</h2>
        <p>Comprehensive information about your legal and constitutional rights</p>
      </div>

      {/* Search and Filter */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search rights by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              <span className="count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading rights information...</div>
      ) : (
        <>
          {/* Rights Grid */}
          <div className="rights-grid">
            {filteredRights.map(right => (
              <div key={right.id} className="right-card" onClick={() => setSelectedRight(right)}>
                <div className="right-icon">{right.icon}</div>
                <h3>{right.title}</h3>
                <p className="right-category">{right.category}</p>
                <p className="right-description">{right.description}</p>
                <div className="right-articles">
                  {right.articles.map(article => (
                    <span key={article} className="article-tag">{article}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Detailed View */}
          {selectedRight && (
            <div className="modal-overlay" onClick={() => setSelectedRight(null)}>
              <div className="right-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedRight(null)}>×</button>
                <div className="modal-header">
                  <div className="right-icon-large">{selectedRight.icon}</div>
                  <div>
                    <h2>{selectedRight.title}</h2>
                    <p className="modal-category">{selectedRight.category}</p>
                  </div>
                </div>
                
                <div className="modal-content">
                  <div className="info-section">
                    <h4>Description</h4>
                    <p>{selectedRight.description}</p>
                  </div>
                  
                  <div className="info-section">
                    <h4>Details</h4>
                    <div className="details-text">{selectedRight.details}</div>
                  </div>
                  
                  <div className="info-section">
                    <h4>Related Articles</h4>
                    <div className="articles-list">
                      {selectedRight.articles.map(article => (
                        <span key={article} className="article-badge">{article}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h4>Resources & Support</h4>
                    <ul className="resources-list">
                      {selectedRight.resources.map((resource, idx) => (
                        <li key={idx}>{resource}</li>
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
        .rights-data {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .rights-header {
          margin-bottom: 30px;
        }

        .rights-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .rights-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .controls-section {
          margin-bottom: 30px;
        }

        .search-box {
          position: relative;
          margin-bottom: 20px;
        }

        .search-box input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #007bff;
        }

        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .category-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-btn:hover {
          background: #f0f0f0;
        }

        .category-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .count {
          background: rgba(0,0,0,0.1);
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
        }

        .category-btn.active .count {
          background: rgba(255,255,255,0.2);
        }

        .rights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .right-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .right-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .right-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .right-card h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 20px;
        }

        .right-category {
          color: #007bff;
          font-size: 12px;
          font-weight: 500;
          margin: 0 0 10px 0;
          text-transform: uppercase;
        }

        .right-description {
          color: #666;
          line-height: 1.5;
          margin: 0 0 15px 0;
        }

        .right-articles {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .article-tag {
          background: #e7f3ff;
          color: #007bff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
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

        .right-modal {
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
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .right-icon-large {
          font-size: 60px;
        }

        .modal-header h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .modal-category {
          color: #007bff;
          font-size: 14px;
          margin: 0;
        }

        .info-section {
          margin-bottom: 25px;
        }

        .info-section h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 18px;
        }

        .details-text {
          white-space: pre-line;
          color: #666;
          line-height: 1.6;
        }

        .articles-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .article-badge {
          background: #e7f3ff;
          color: #007bff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .resources-list {
          margin: 0;
          padding-left: 20px;
          color: #666;
        }

        .resources-list li {
          margin-bottom: 8px;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .rights-grid {
            grid-template-columns: 1fr;
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

export default RightsData;
