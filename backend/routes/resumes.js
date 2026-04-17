const express = require('express');
const router = express.Router();
const { uploadResume, matchJob } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, authorize('student'), upload.single('file'), uploadResume);
router.post('/match-job', protect, authorize('student'), matchJob);

module.exports = router;
