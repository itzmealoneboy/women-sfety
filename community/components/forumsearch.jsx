import React, { useState } from 'react';

const ForumSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [searching, setSearching] = useState(false);

  const mockPosts = [
    {
      id: 1,
      title: 'How to report cyber bullying?',
      content: 'I need help understanding the process to report cyber bullying. What steps should I take?',
      author: 'SafeUser123',
      category: 'safety',
      replies: 12,
      views: 245,
      timestamp: new Date(2024, 0, 15),
      tags: ['cyberbullying', 'reporting', 'help']
    },
    {
      id: 2,
      title: 'Tips for staying safe on social media',
      content: 'Share your best practices for maintaining privacy and security on social platforms.',
      author: 'PrivacyPro',
      category: 'tips',
      replies: 34,
      views: 567,
      timestamp: new Date(2024, 0, 14),
      tags: ['socialmedia', 'privacy', 'tips']
    },
    {
      id: 3,
      title: 'Emergency contact numbers for women safety',
      content: 'Compiled list of emergency contacts for women in different cities.',
      author: 'SafetyFirst',
      category: 'resources',
      replies: 45,
      views: 890,
      timestamp: new Date(2024, 0, 13),
      tags: ['emergency', 'womensafety', 'contacts']
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setTimeout(() => {
      let results = mockPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      if (filterType !== 'all') {
        results = results.filter(post => post.category === filterType);
      }
      
      if (sortBy === 'recent') {
        results.sort((a, b) => b.timestamp - a.timestamp);
      } else if (sortBy === 'popular') {
        results.sort((a, b) => b.replies - a.replies);
      }
      
      setSearchResults(results);
      setSearching(false);
    }, 500);
  };

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'safety', name: 'Safety Tips' },
    { id: 'resources', name: 'Resources' },
    { id: 'support', name: 'Support' },
    { id: 'discussion', name: 'General Discussion' }
  ];

  return (
    <div className="forum-search">
      <div className="search-header">
        <h2>Forum Search</h2>
        <p>Find discussions, resources, and safety tips from the community</p>
      </div>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for topics, keywords, or questions..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="search-btn">
            🔍 Search
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Category:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {searching && (
          <div className="searching-state">
            <div className="spinner"></div>
            <p>Searching the forum...</p>
          </div>
        )}

        {!searching && searchQuery && searchResults.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try different keywords or browse our popular topics</p>
            <div className="suggestions">
              <span>Popular searches:</span>
              <button onClick={() => setSearchQuery('safety')}>safety</button>
              <button onClick={() => setSearchQuery('cyberbullying')}>cyberbullying</button>
              <button onClick={() => setSearchQuery('emergency')}>emergency</button>
            </div>
          </div>
        )}

        {!searching && searchResults.length > 0 && (
          <div className="results-stats">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </div>
        )}

        <div className="results-list">
          {searchResults.map(post => (
            <div key={post.id} className="result-card">
              <div className="result-header">
                <h3>{post.title}</h3>
                <span className="result-category">{post.category}</span>
              </div>
              <p className="result-excerpt">{post.content.substring(0, 150)}...</p>
              <div className="result-meta">
                <span className="meta-author">👤 {post.author}</span>
                <span className="meta-replies">💬 {post.replies} replies</span>
                <span className="meta-views">👁️ {post.views} views</span>
                <span className="meta-date">📅 {post.timestamp.toLocaleDateString()}</span>
              </div>
              <div className="result-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .forum-search {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .search-header {
          margin-bottom: 30px;
        }

        .search-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .search-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .search-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .search-box {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .search-box input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }

        .search-btn {
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .filters {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-group label {
          color: #666;
        }

        .filter-group select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .searching-state {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e0e0e0;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-results {
          text-align: center;
          padding: 60px;
        }

        .no-results-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .suggestions {
          margin-top: 20px;
        }

        .suggestions span {
          color: #666;
          margin-right: 10px;
        }

        .suggestions button {
          padding: 5px 10px;
          margin: 0 5px;
          background: #e0e0e0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .results-stats {
          margin-bottom: 20px;
          color: #666;
          font-size: 14px;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }

        .result-header h3 {
          margin: 0;
          color: #007bff;
          font-size: 18px;
        }

        .result-category {
          padding: 2px 8px;
          background: #e7f3ff;
          color: #007bff;
          border-radius: 4px;
          font-size: 11px;
        }

        .result-excerpt {
          color: #666;
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        .result-meta {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }

        .result-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 2px 8px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 11px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ForumSearch;
