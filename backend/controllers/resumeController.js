const Student = require('../models/Student');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// @desc    Upload resume and parse with AI
// @route   POST /api/resumes/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;
    student.resumeUrl = resumeUrl;
    await student.save();

    // Call AI Microservice for parsing
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path));

      const aiResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/analyze-resume`, 
        formData,
        { headers: { ...formData.getHeaders() } }
      );

      // Update student profile with AI results
      if (aiResponse.data.success && aiResponse.data.profile) {
        const { skills, education, experience_level, role } = aiResponse.data.profile;
        
        // Replace skills with the latest analysis to keep it dynamic
        if (skills && Array.isArray(skills)) {
          student.skills = skills;
        }
        
        // Update profile fields
        if (education) student.education = education;
        if (experience_level) student.experience_level = experience_level;
        if (role && !student.bio) student.bio = `Professional ${role}`;
        
        await student.save();
      }

      res.status(200).json({
        message: 'Resume uploaded and processed',
        resumeUrl,
        analysis: aiResponse.data
      });
    } catch (aiError) {
      console.error('AI Service Error:', aiError.message);
      // Still return success for upload, even if AI parsing fails
      res.status(200).json({
        message: 'Resume uploaded, but AI analysis failed',
        resumeUrl
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
