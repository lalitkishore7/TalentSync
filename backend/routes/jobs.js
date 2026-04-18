const express = require('express');
const router = express.Router();
const { createJob, getJobs, applyJob, getJobSkillGap, getMyApplications } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-applications', protect, authorize('student'), getMyApplications);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('company'), createJob);

router.post('/:id/apply', protect, authorize('student'), applyJob);
router.get('/:id/gap', protect, authorize('student'), getJobSkillGap);

module.exports = router;
