const Student = require('../models/Student');
const Job = require('../models/Job');
const axios = require('axios');

// @desc    Get current student profile
// @route   GET /api/student/profile
exports.getProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id }).populate('user', 'firstName lastName email');
    
    if (!student) {
      // Create profile if it doesn't exist (e.g. first login)
      student = await Student.create({ user: req.user._id });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
exports.updateProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const fieldsToUpdate = [
      'university', 'degree', 'year', 'skills', 
      'bio', 'github', 'linkedin'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a job to bookmarks
// @route   POST /api/student/jobs/:jobId/save
exports.saveJob = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const jobId = req.params.jobId;

    if (student.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    student.savedJobs.push(jobId);
    await student.save();
    res.json({ message: 'Job saved successfully', savedJobs: student.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave a job from bookmarks
// @route   DELETE /api/student/jobs/:jobId/unsave
exports.unsaveJob = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const jobId = req.params.jobId;

    student.savedJobs = student.savedJobs.filter(id => id.toString() !== jobId);
    await student.save();
    res.json({ message: 'Job removed successfully', savedJobs: student.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all saved jobs
// @route   GET /api/student/jobs/saved
exports.getSavedJobs = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate({
      path: 'savedJobs',
      populate: { path: 'company', select: 'companyName location' }
    });
    
    if (!student) return res.json([]);
    res.json(student.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get AI-powered job recommendations
// @route   GET /api/student/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const jobs = await Job.find({ status: 'open' }).populate('company', 'companyName location industry');
    
    if (!student.skills || student.skills.length === 0) {
      // If no skills extracted yet, just return jobs as is
      return res.json(jobs.map(j => ({ ...j.toObject(), match: 0 })));
    }

    // Call ML Service for scores
    try {
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/match-jobs`, {
        candidate_skills: student.skills,
        jobs: jobs.map(j => ({
          id: j._id,
          skillsRequired: j.skillsRequired,
          description: j.description
        }))
      });

      if (mlResponse.data.success) {
        const scores = mlResponse.data.matches; // [{ jobId: '...', score: 85 }, ...]
        
        // Map scores back to job objects
        const scoredJobs = jobs.map(job => {
          const matchData = scores.find(s => s.jobId === job._id.toString());
          return {
            ...job.toObject(),
            match: matchData ? matchData.score : 0
          };
        });

        // Sort by match score descending
        return res.json(scoredJobs.sort((a, b) => b.match - a.match));
      }
    } catch (mlErr) {
      console.error('ML Recommendations Error:', mlErr.message);
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
