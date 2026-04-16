const express = require('express');
const router = express.Router();
const { getAnalytics, getPendingVerifications, verifyCompany } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/verifications/pending', getPendingVerifications);
router.put('/verifications/:id', verifyCompany);

module.exports = router;
