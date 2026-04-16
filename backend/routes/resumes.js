const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, authorize('student'), upload.single('file'), uploadResume);

module.exports = router;
