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
      matchScore: matchScore,
      coverLetter: req.body.coverLetter || '',
      phone: req.body.phone,
      linkedinUrl: req.body.linkedinUrl
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const googleAIService = require('../services/googleAIService');

// @desc    Get skill gap analysis for a job
// @route   GET /api/jobs/:id/gap
exports.getJobSkillGap = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'email');
    const job = await Job.findById(req.params.id);

    if (!student || !job) {
      return res.status(404).json({ message: 'Skill analysis data missing' });
    }

    try {
      // Use Google Gemini AI for advanced analysis
      const aiAnalysis = await googleAIService.getSkillAnalysis(student, job);
      return res.json(aiAnalysis);
    } catch (aiErr) {
      console.error('[SkillGap] AI analysis failed, falling back to local logic:', aiErr.message);
      
      // Fallback if AI fails (basic string filtering)
      const missing = job.skillsRequired.filter(s => 
        !student.skills.some(ss => ss.toLowerCase() === s.toLowerCase())
      );
      
      res.json({
        missing_skills: missing,
        matching_skills: student.skills.filter(s => 
          job.skillsRequired.some(js => js.toLowerCase() === s.toLowerCase())
        ),
        optimization_tips: [
          "Ensure your resume highlights the required skills mentioned in the job description.",
          "Add quantifiable achievements for the skills you already possess."
        ],
        suitability_score: Math.round((student.skills.length / (job.skillsRequired.length || 1)) * 100),
        recommendation: "Review the job description to understand key requirements and tailor your application accordingly."
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current student's applications
// @route   GET /api/jobs/my-applications
exports.getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        select: 'title location salaryRange jobType',
        populate: {
          path: 'company',
          select: 'companyName industry'
        }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
