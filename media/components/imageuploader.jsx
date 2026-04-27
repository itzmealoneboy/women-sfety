import React, { useState, useRef } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'general'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [compression, setCompression] = useState('medium');
  const [watermark, setWatermark] = useState(false);
  
  const fileInputRef = useRef(null);

  const compressImage = (file, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large
          const maxSize = 1920;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Apply watermark if enabled
          if (watermark) {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText('© Evidence Safe', width - 150, height - 20);
          }
          
          const qualityMap = { low: 0.5, medium: 0.75, high: 0.95 };
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', qualityMap[quality]);
        };
      };
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setUploadProgress(0);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const compressedBlob = await compressImage(file, compression);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + i,
          file: compressedBlob,
          data: e.target.result,
          name: file.name,
          size: (compressedBlob.size / (1024 * 1024)).toFixed(2),
          type: file.type,
          metadata: {
            ...metadata,
            uploadedAt: new Date()
          }
        };
        setImages(prev => [...prev, newImage]);
        setUploadProgress(((i + 1) / files.length) * 100);
      };
      reader.readAsDataURL(compressedBlob);
    }
    
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 1000);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const updateMetadata = (field, value) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
    if (selectedImage) {
      setSelectedImage({ ...selectedImage, metadata: { ...selectedImage.metadata, [field]: value } });
    }
  };

  const extractExifData = (file) => {
    // Simulate EXIF data extraction
    return {
      camera: 'Smartphone Camera',
      resolution: '1920x1080',
      dateTaken: new Date().toISOString(),
      gps: 'Not Available',
      make: 'Unknown'
    };
  };

  const uploadAll = () => {
    alert(`Uploading ${images.length} images with metadata...`);
    // Simulate upload to server
    setTimeout(() => {
      alert('All images uploaded successfully!');
      setImages([]);
      setMetadata({ title: '', description: '', tags: '', category: 'general' });
    }, 2000);
  };

  return (
    <div className="image-uploader">
      <div className="uploader-header">
        <h2>Image Uploader</h2>
        <p>Upload, compress, and manage images with metadata</p>
      </div>

      <div className="upload-controls">
        <div className="control-group">
          <label>Image Quality</label>
          <select value={compression} onChange={(e) => setCompression(e.target.value)}>
            <option value="low">Low (50% quality)</option>
            <option value="medium">Medium (75% quality)</option>
            <option value="high">High (95% quality)</option>
          </select>
        </div>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={watermark}
              onChange={(e) => setWatermark(e.target.checked)}
            />
            Add Watermark
          </label>
        </div>
      </div>

      <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
        <div className="upload-icon">📸</div>
        <div className="upload-text">Click or drag images here to upload</div>
        <div className="upload-hint">Supported: JPG, PNG, GIF (Max 50MB per image)</div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
          <div className="progress-text">Uploading... {Math.round(uploadProgress)}%</div>
        </div>
      )}

      {images.length > 0 && (
        <div className="metadata-section">
          <h3>Metadata (Apply to all images)</h3>
          <div className="metadata-grid">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => updateMetadata('title', e.target.value)}
                placeholder="Image title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={metadata.description}
                onChange={(e) => updateMetadata('description', e.target.value)}
                placeholder="Image description"
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={metadata.tags}
                onChange={(e) => updateMetadata('tags', e.target.value)}
                placeholder="evidence, crime scene, etc."
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={metadata.category} onChange={(e) => updateMetadata('category', e.target.value)}>
                <option value="general">General</option>
                <option value="crime-scene">Crime Scene</option>
                <option value="evidence">Evidence</option>
                <option value="surveillance">Surveillance</option>
                <option value="documentation">Documentation</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="images-grid">
        {images.map(img => (
          <div key={img.id} className="image-card" onClick={() => setSelectedImage(img)}>
            <img src={img.data} alt={img.name} />
            <div className="image-info">
              <div className="image-name">{img.name}</div>
              <div className="image-size">{img.size} MB</div>
            </div>
            <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}>×</button>
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <div className="upload-actions">
          <button onClick={uploadAll} className="upload-all-btn">
            Upload All ({images.length} images)
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage.data} alt={selectedImage.name} />
            <div className="modal-info">
              <h4>{selectedImage.metadata?.title || selectedImage.name}</h4>
              <p>{selectedImage.metadata?.description}</p>
              <div className="modal-details">
                <span>Size: {selectedImage.size} MB</span>
                <span>Type: {selectedImage.type}</span>
                <span>Tags: {selectedImage.metadata?.tags || 'None'}</span>
                <span>Category: {selectedImage.metadata?.category}</span>
              </div>
              <div className="modal-actions">
                <button className="edit-btn">Edit Metadata</button>
                <button className="download-btn">Download</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .image-uploader {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .uploader-header {
          margin-bottom: 30px;
        }

        .uploader-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .uploader-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .upload-controls {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .control-group label {
          color: #666;
        }

        .control-group select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .upload-area {
          background: white;
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 60px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 30px;
        }

        .upload-area:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }

        .upload-icon {
          font-size: 64px;
          margin-bottom: 15px;
        }

        .upload-text {
          font-size: 18px;
          color: #666;
          margin-bottom: 5px;
        }

        .upload-hint {
          font-size: 12px;
          color: #999;
        }

        .upload-progress {
          margin-bottom: 20px;
        }

        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .metadata-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .metadata-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .form-group input, .form-group select, .form-group textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .image-card {
          position: relative;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .image-card:hover {
          transform: translateY(-2px);
        }

        .image-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .image-info {
          padding: 8px;
        }

        .image-name {
          font-size: 12px;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .image-size {
          font-size: 10px;
          color: #999;
        }

        .remove-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-actions {
          text-align: center;
        }

        .upload-all-btn {
          padding: 12px 32px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
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

        .image-modal {
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

        .image-modal img {
          max-width: 100%;
          max-height: 60vh;
          object-fit: contain;
        }

        .modal-info {
          padding: 20px;
        }

        .modal-info h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .modal-info p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .modal-details {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 12px;
          color: #999;
          margin-bottom: 15px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .edit-btn, .download-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .edit-btn {
          background: #007bff;
          color: white;
        }

        .download-btn {
          background: #28a745;
          color: white;
        }

        @media (max-width: 768px) {
          .metadata-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
