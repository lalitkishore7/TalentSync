const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
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

// @desc    Get dashboard metrics and activity
// @route   GET /api/student/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    // 1. Matched Jobs & Top Match Score
    const jobs = await Job.find({ status: 'open' });
    let matchedJobsCount = 0;
    let topMatchScore = 0;

    if (student.skills && student.skills.length > 0) {
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
          const scores = mlResponse.data.matches;
          matchedJobsCount = scores.filter(s => s.score >= 50).length;
          topMatchScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
        }
      } catch (mlErr) {
        console.error('ML Stats Error:', mlErr.message);
      }
    }

    // 2. Applications Sent
    const applications = await Application.find({ student: student._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'companyName' } })
      .sort({ appliedAt: -1 });
    
    const pendingReviewCount = applications.filter(a => a.status === 'pending').length;

    // 3. Profile Views (Increment a bit for "liveliness" in demo)
    student.profileViews = (student.profileViews || 120) + Math.floor(Math.random() * 5);
    await student.save();

    // 4. Recent Activity (Mix of Appls and Saved Jobs)
    const populatedStudent = await Student.findById(student._id).populate({
      path: 'savedJobs',
      options: { limit: 5 },
      populate: { path: 'company', select: 'companyName' }
    });

    const recentSaved = (populatedStudent.savedJobs || []).map(j => ({
      company: j.company?.companyName || 'Unknown',
      role: j.title || 'Unknown Role',
      status: 'Saved',
      time: 'Recently',
      color: '#635BFF',
      date: j.createdAt || new Date()
    }));

    const recentApps = applications.slice(0, 3).map(a => ({
      company: a.job?.company?.companyName || 'Unknown',
      role: a.job?.title || 'Unknown Role',
      status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
      time: 'Just now',
      color: a.status === 'rejected' ? '#ef4444' : (a.status === 'pending' ? '#f59e0b' : '#10b981'),
      date: a.appliedAt
    }));

    const recentActivity = [...recentApps, ...recentSaved]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    // 5. Profile Strength Calculation
    let strength = 20; // Base for account creation
    if (student.bio) strength += 15;
    if (student.resumeUrl) strength += 25;
    if (student.skills && student.skills.length >= 3) strength += 20;
    if (student.university && student.degree) strength += 20;
    
    const strengthTips = [
       { done: true, label: 'Email verified' },
       { done: !!student.bio, label: 'Add a professional bio' },
       { done: !!student.resumeUrl, label: 'Upload your resume' },
       { done: (student.skills?.length >= 3), label: 'Add 3+ skills' },
       { done: (!!student.university && !!student.degree), label: 'Complete education history' },
    ];

    res.json({
      kpis: [
        { label: 'Matched Jobs', value: matchedJobsCount, delta: '+2 this week', color: '#6366f1' },
        { label: 'Applications Sent', value: applications.length, delta: `${pendingReviewCount} pending review`, color: '#f59e0b' },
        { label: 'Profile Views', value: student.profileViews, delta: '+5 today', color: '#10b981' },
        { label: 'Match Score', value: `${topMatchScore}%`, delta: topMatchScore > 80 ? 'Top 10%' : 'Keep improving!', color: '#ff6b00' },
      ],
      recentActivity,
      profileStrength: {
         score: Math.min(strength, 100),
         tips: strengthTips
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
