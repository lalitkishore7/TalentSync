const Company = require('../models/Company');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingVerifications = await Company.countDocuments({ verifiedStatus: 'pending' });

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingVerifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending company verifications
// @route   GET /api/admin/verifications/pending
exports.getPendingVerifications = async (req, res) => {
  try {
    const pending = await Company.find({ verifiedStatus: 'pending' }).populate('user', 'email');
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company verification status
// @route   PUT /api/admin/verifications/:id
exports.verifyCompany = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.verifiedStatus = status;
    await company.save();

    res.json({ message: `Company ${status} successfully`, company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
