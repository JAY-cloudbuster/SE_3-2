/**
 * @fileoverview File Upload Middleware for AgriSahayak Platform
 * 
 * Configures multer for handling multipart/form-data file uploads.
 * Files are stored locally in the /uploads directory with unique
 * filenames generated from timestamps.
 * 
 * @module middlewares/uploadMiddleware
 * @requires multer
 * @requires path
 * @see Epic 2, Story 2.5 - Upload Crop Media
 */

const multer = require('multer');
const path = require('path');

// Configure storage: save to /uploads with unique filenames
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter: only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload;
