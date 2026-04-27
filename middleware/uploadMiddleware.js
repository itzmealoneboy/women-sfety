const multer = require('multer');
const path = require('path');
const { ApiError } = require('../utils/apiResponse');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mp3|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new ApiError('Only images, videos, audio, PDFs, and documents are allowed', 400));
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'FILE_TOO_LARGE') {
                    return next(new ApiError('File too large. Max size 10MB', 400));
                }
                return next(new ApiError(err.message, 400));
            } else if (err) {
                return next(err);
            }
            next();
        });
    };
};

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 5) => {
    return (req, res, next) => {
        upload.array(fieldName, maxCount)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'FILE_TOO_LARGE') {
                    return next(new ApiError('File too large. Max size 10MB', 400));
                }
                return next(new ApiError(err.message, 400));
            } else if (err) {
                return next(err);
            }
            next();
        });
    };
};

module.exports = {
    uploadSingle,
    uploadMultiple
};