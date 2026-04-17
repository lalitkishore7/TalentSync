const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  saveJob, 
  unsaveJob, 
  getSavedJobs 
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.get('/jobs/saved', getSavedJobs);
router.post('/jobs/:jobId/save', saveJob);
router.delete('/jobs/:jobId/unsave', unsaveJob);

module.exports = router;
