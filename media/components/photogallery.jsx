import React, { useState } from 'react';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Mock data - in production, this would come from an API
  React.useEffect(() => {
    const mockPhotos = [
      {
        id: 1,
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/400/300',
        title: 'Crime Scene Evidence',
        description: 'Evidence from downtown incident',
        date: '2024-01-15',
        category: 'evidence',
        tags: ['crime-scene', 'evidence'],
        size: '2.3 MB',
        dimensions: '1920x1080',
        location: 'Downtown',
        uploadedBy: 'Officer Smith',
        caseNumber: 'CR-2024-001'
      },
      {
        id: 2,
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/400/300',
        title: 'Surveillance Footage',
        description: 'CCTV capture from main entrance',
        date: '2024-01-14',
        category: 'surveillance',
        tags: ['cctv', 'surveillance'],
        size: '5.1 MB',
        dimensions: '1280x720',
        location: 'Main Street',
        uploadedBy: 'Officer Davis',
        caseNumber: 'CR-2024-001'
      },
      {
        id: 3,
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/400/300',
        title: 'Weapon Evidence',
        description: 'Recovered weapon from scene',
        date: '2024-01-13',
        category: 'evidence',
        tags: ['weapon', 'evidence'],
        size: '1.8 MB',
        dimensions: '1024x768',
        location: 'Alley Way',
        uploadedBy: 'Detective Williams',
        caseNumber: 'CR-2024-002'
      },
      {
        id: 4,
        url: '/api/placeholder/400/300',
        thumbnail: '/api/placeholder/400/300',
        title: 'Vehicle Details',
        description: 'Suspect vehicle identification',
        date: '2024-01-12',
        category: 'evidence',
        tags: ['vehicle', 'suspect'],
        size: '3.2 MB',
        dimensions: '1920x1080',
        location: 'Parking Lot',
        uploadedBy: 'Officer Johnson',
        caseNumber: 'CR-2024-002'
      }
    ];
    setPhotos(mockPhotos);
  }, []);

  const getFilteredPhotos = () => {
    let filtered = [...photos];
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  };

  const togglePhotoSelection = (id) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(pid => pid !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedPhotos.length} photos?`)) {
      setPhotos(photos.filter(p => !selectedPhotos.includes(p.id)));
      setSelectedPhotos([]);
      setEditMode(false);
    }
  };

  const downloadSelected = () => {
    alert(`Downloading ${selectedPhotos.length} photos...`);
  };

  const categories = ['all', 'evidence', 'surveillance', 'documentation', 'scene'];

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>Photo Gallery</h2>
        <p>Manage and organize case-related photographs</p>
      </div>

      <div className="gallery-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="control-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
          
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          
          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞ Grid</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>≡ List</button>
          </div>
          
          <button className="edit-mode-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>

      {editMode && selectedPhotos.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedPhotos.length} photos selected</span>
          <button onClick={downloadSelected} className="bulk-download">Download</button>
          <button onClick={deleteSelected} className="bulk-delete">Delete</button>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="gallery-grid">
          {getFilteredPhotos().map(photo => (
            <div key={photo.id} className={`gallery-item ${selectedPhotos.includes(photo.id) ? 'selected' : ''}`}>
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedPhotos.includes(photo.id)}
                  onChange={() => togglePhotoSelection(photo.id)}
                  className="select-checkbox"
                />
              )}
              <img src={photo.thumbnail} alt={photo.title} onClick={() => !editMode && setSelectedPhoto(photo)} />
              <div className="item-info">
                <div className="item-title">{photo.title}</div>
                <div className="item-date">{photo.date}</div>
                <div className="item-category">{photo.category}</div>
              </div>
              <div className="item-tags">
                {photo.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          <table className="photos-table">
            <thead>
              <tr>
                {editMode && <th><input type="checkbox" /></th>}
                <th>Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Size</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredPhotos().map(photo => (
                <tr key={photo.id} className={selectedPhotos.includes(photo.id) ? 'selected' : ''}>
                  {editMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.id)}
                        onChange={() => togglePhotoSelection(photo.id)}
                      />
                    </td>
                  )}
                  <td>
                    <img src={photo.thumbnail} alt={photo.title} className="list-thumbnail" onClick={() => !editMode && setSelectedPhoto(photo)} />
                  </td>
                  <td className="title-cell">{photo.title}</td>
                  <td>{photo.category}</td>
                  <td>{photo.date}</td>
                  <td>{photo.size}</td>
                  <td className="tags-cell">
                    {photo.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>×</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <div className="photo-details">
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.description}</p>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{selectedPhoto.date}</span>
                </div>
                <div className="detail-item">
                  <label>Size:</label>
                  <span>{selectedPhoto.size}</span>
                </div>
                <div className="detail-item">
                  <label>Dimensions:</label>
                  <span>{selectedPhoto.dimensions}</span>
                </div>
                <div className="detail-item">
                  <label>Location:</label>
                  <span>{selectedPhoto.location}</span>
                </div>
                <div className="detail-item">
                  <label>Uploaded By:</label>
                  <span>{selectedPhoto.uploadedBy}</span>
                </div>
                <div className="detail-item">
                  <label>Case Number:</label>
                  <span>{selectedPhoto.caseNumber}</span>
                </div>
              </div>
              <div className="photo-tags">
                {selectedPhoto.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="modal-actions">
                <button className="download-btn">Download</button>
                <button className="edit-btn">Edit Metadata</button>
                <button className="share-btn">Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .photo-gallery {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .gallery-header {
          margin-bottom: 30px;
        }

        .gallery-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .gallery-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .gallery-controls {
          margin-bottom: 20px;
        }

        .search-box {
          position: relative;
          margin-bottom: 15px;
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

        .control-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .control-group select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .view-toggle {
          display: flex;
          gap: 5px;
        }

        .view-toggle button {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          cursor: pointer;
        }

        .view-toggle button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .edit-mode-btn {
          padding: 8px 16px;
          background: #ffc107;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .bulk-actions {
          background: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .bulk-download, .bulk-delete {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .bulk-download {
          background: #28a745;
          color: white;
        }

        .bulk-delete {
          background: #dc3545;
          color: white;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .gallery-item {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .gallery-item:hover {
          transform: translateY(-2px);
        }

        .gallery-item.selected {
          border: 2px solid #007bff;
        }

        .select-checkbox {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1;
          width: 20px;
          height: 20px;
        }

        .gallery-item img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          cursor: pointer;
        }

        .item-info {
          padding: 12px;
        }

        .item-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .item-date {
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .item-category {
          font-size: 11px;
          color: #007bff;
          text-transform: capitalize;
        }

        .item-tags {
          padding: 0 12px 12px 12px;
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 2px 6px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 9px;
          color: #666;
        }

        .list-view {
          background: white;
          border-radius: 8px;
          overflow-x: auto;
        }

        .photos-table {
          width: 100%;
          border-collapse: collapse;
        }

        .photos-table th, .photos-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .photos-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #666;
        }

        .list-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
        }

        .title-cell {
          font-weight: 500;
          color: #333;
        }

        .tags-cell {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .photo-modal {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
        }

        .photo-modal img {
          max-width: 100%;
          max-height: 50vh;
          object-fit: contain;
        }

        .photo-details {
          padding: 20px;
        }

        .photo-details h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .photo-details p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .detail-item label {
          color: #666;
        }

        .photo-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .download-btn, .edit-btn, .share-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .download-btn {
          background: #28a745;
          color: white;
        }

        .edit-btn {
          background: #007bff;
          color: white;
        }

        .share-btn {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoGallery;
