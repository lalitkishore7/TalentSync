const express = require('express');
const router = express.Router();
const { createJob, getJobs, applyJob, getJobSkillGap } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('company'), createJob);

router.post('/:id/apply', protect, authorize('student'), applyJob);
router.get('/:id/gap', protect, authorize('student'), getJobSkillGap);

module.exports = router;
