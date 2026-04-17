const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Student = require('../models/Student');
const axios = require('axios');

// @desc    Create a new job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    
    if (!company || company.verifiedStatus !== 'verified') {
      return res.status(403).json({ message: 'Only verified companies can post jobs' });
    }

    // 1. Run AI Fraud Detection before saving
    let fraudRisk = 0;
    let flaggedReasons = [];
    
    try {
      if (req.body.description) {
        const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/fraud-detect`, {
          job_description: req.body.description
        });
        
        if (mlResponse.data.success) {
          const analysis = mlResponse.data.analysis;
          fraudRisk = analysis.risk_score || 0;
          flaggedReasons = analysis.reasons || [];
          
          // Reject immediately if highly fraudulent
          if (analysis.is_fraud || fraudRisk > 70) {
             return res.status(400).json({ 
                 message: 'Job posting blocked due to security concerns.', 
                 reasons: flaggedReasons 
             });
          }
        }
      }
    } catch (err) {
      console.error('Fraud Detection Error:', err.message);
      // We log but don't strictly block if ML service is temporarily down, or we could block.
      // Letting it pass with 0 risk for now to ensure system stability if AI is down.
    }

    // 2. Create the Job
    const job = await Job.create({
      ...req.body,
      company: company._id,
      fraudRisk: fraudRisk,
      flaggedReasons: flaggedReasons
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('company', 'companyName location industry');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
exports.applyJob = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const alreadyApplied = await Application.findOne({
      student: student._id,
      job: req.params.id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // AI Matching Logic
    let matchScore = 0;
    try {
      const job = await Job.findById(req.params.id);
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/match-jobs`, {
        candidate_skills: student.skills,
        jobs: [{
          id: job._id,
          skillsRequired: job.skillsRequired,
          description: job.description
        }]
      });

      if (mlResponse.data.success && mlResponse.data.matches.length > 0) {
        matchScore = mlResponse.data.matches[0].score;
      }
    } catch (err) {
      console.error('AI Matching Error:', err.message);
      matchScore = 50; // Decent fallback score
    }

    const application = await Application.create({
      student: student._id,
      job: req.params.id,
      matchScore: matchScore
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get skill gap analysis for a job
// @route   GET /api/jobs/:id/gap
exports.getJobSkillGap = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const job = await Job.findById(req.params.id);

    if (!student || !job) {
      return res.status(404).json({ message: 'Skill analysis data missing' });
    }

    try {
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/skill-gap`, {
        candidate_skills: student.skills,
        job_skills: job.skillsRequired
      });

      if (mlResponse.data.success) {
        return res.json(mlResponse.data.insights);
      }
    } catch (mlErr) {
      console.error('ML Skill Gap Error:', mlErr.message);
    }

    // Fallback if ML fails
    const missing = job.skillsRequired.filter(s => !student.skills.includes(s));
    res.json({
      missing_skills: missing,
      recommendation: "Review the job description to understand key requirements."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
