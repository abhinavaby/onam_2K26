const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const upload = require('../middleware/uploadMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

// Public Routes
router.get('/', photoController.getPhotos);

// User Upload Route (Multiple photos allowed, up to 10)
router.post('/upload', upload.array('photos', 10), photoController.uploadPhotos);

// Admin Route (Protected)
router.delete('/:fileId', adminAuth, photoController.deletePhoto);
router.post('/bulk-delete', adminAuth, photoController.deletePhotos);

module.exports = router;
