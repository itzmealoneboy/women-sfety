import React, { useState } from 'react';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'FIR Copy - CR-2024-001.pdf', type: 'PDF', size: '2.4 MB', date: '2024-01-15', category: 'Legal' },
    { id: 2, name: 'Medical Report - Victim.pdf', type: 'PDF', size: '1.8 MB', date: '2024-01-14', category: 'Medical' },
    { id: 3, name: 'Witness Statement - John Doe.docx', type: 'DOC', size: '856 KB', date: '2024-01-13', category: 'Statement' },
    { id: 4, name: 'Evidence Photo - Scene.jpg', type: 'JPG', size: '3.2 MB', date: '2024-01-12', category: 'Evidence' }
  ]);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSelect = (id) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(docId => docId !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="documents-list">
      <div className="list-header">
        <h3>Case Documents</h3>
        <div className="list-actions">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="upload-btn">+ Upload</button>
          {selectedDocs.length > 0 && (
            <button className="download-selected">Download ({selectedDocs.length})</button>
          )}
        </div>
      </div>

      <div className="documents-table">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => (
              <tr key={doc.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                  />
                </td>
                <td className="doc-name">{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.size}</td>
                <td>{doc.date}</td>
                <td><span className="category-badge">{doc.category}</span></td>
                <td>
                  <button className="view-btn">View</button>
                  <button className="download-btn">↓</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .documents-list {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .list-header h3 {
          margin: 0;
          color: #333;
        }

        .list-actions {
          display: flex;
          gap: 10px;
        }

        .search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .upload-btn, .download-selected {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .upload-btn {
          background: #28a745;
          color: white;
        }

        .download-selected {
          background: #007bff;
          color: white;
        }

        .documents-table {
          overflow-x: auto;
        }

        .documents-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .documents-table th,
        .documents-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .documents-table th {
          background: #f8f9fa;
          font-weight: 600;
        }

        .doc-name {
          font-weight: 500;
        }

        .category-badge {
          padding: 2px 8px;
          background: #e7f3ff;
          color: #007bff;
          border-radius: 4px;
          font-size: 11px;
        }

        .view-btn, .download-btn {
          padding: 4px 8px;
          margin-right: 5px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .view-btn {
          background: #007bff;
          color: white;
        }

        .download-btn {
          background: #28a745;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default DocumentsList;
