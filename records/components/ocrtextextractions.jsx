import React, { useState } from 'react';

const OCRTextExtraction = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractText = () => {
    setProcessing(true);
    setTimeout(() => {
      setExtractedText('This is extracted text from the document. In a real implementation, OCR technology would read text from images, scanned documents, and handwritten notes. The extracted text can then be searched, indexed, and analyzed for evidence purposes.');
      setProcessing(false);
    }, 3000);
  };

  return (
    <div className="ocr-extraction">
      <div className="ocr-header">
        <h3>OCR Text Extraction</h3>
        <p>Extract text from images and scanned documents</p>
      </div>

      <div className="upload-section">
        <div className="upload-area" onClick={() => document.getElementById('ocr-upload').click()}>
          {image ? (
            <img src={image} alt="Uploaded" className="uploaded-image" />
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <div className="upload-text">Click to upload image/document</div>
              <div className="upload-hint">Supported: JPG, PNG, PDF</div>
            </>
          )}
          <input
            id="ocr-upload"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
        
        {image && (
          <button onClick={extractText} disabled={processing} className="extract-btn">
            {processing ? 'Extracting...' : 'Extract Text'}
          </button>
        )}
      </div>

      {extractedText && (
        <div className="extracted-text">
          <h4>Extracted Content</h4>
          <div className="text-content">
            {extractedText}
          </div>
          <button className="copy-btn">Copy Text</button>
        </div>
      )}

      <style jsx>{`
        .ocr-extraction {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .ocr-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .ocr-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 13px;
        }

        .upload-section {
          text-align: center;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 40px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .upload-area:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .uploaded-image {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
        }

        .extract-btn {
          padding: 10px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .extracted-text {
          margin-top: 20px;
        }

        .extracted-text h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .text-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          line-height: 1.6;
          max-height: 200px;
          overflow-y: auto;
        }

        .copy-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default OCRTextExtraction;
