const Student = require('../models/Student');
const fs = require('fs');
const { parseResume } = require('../services/affindaService');
const { quickMatch } = require('../services/matchingService');
const { anonymizeResume, getBiasReport } = require('../services/biasRemoval');

// @desc    Upload resume and parse with Affinda AI
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

    // Parse resume with Affinda (or fallback)
    let analysisResult;
    try {
      console.log(`[Resume Upload] Parsing file: ${req.file.path}`);
      analysisResult = await parseResume(req.file.path);

      if (analysisResult && analysisResult.success) {
        const profile = analysisResult.profile;

        // Update student profile with parsed data
        if (profile.skills && profile.skills.length > 0) {
          student.skills = profile.skills;
        }
        if (profile.experience_years !== undefined) {
          student.experience_years = profile.experience_years;
        }
        if (profile.education_level) {
          student.education_level = profile.education_level;
        }
        if (profile.certifications && profile.certifications.length > 0) {
          student.certifications = profile.certifications;
        }
        if (profile.role) {
          student.detectedRole = profile.role;
          if (!student.bio) student.bio = `Professional ${profile.role}`;
        }
        if (profile.resume_strength) {
          student.resumeStrength = profile.resume_strength;
        }
        if (profile.raw_text) {
          student.parsedResumeText = profile.raw_text;
        }
        if (profile.education && profile.education.length > 0) {
          student.parsedEducation = profile.education;
        }
        if (profile.experience && profile.experience.length > 0) {
          student.parsedExperience = profile.experience;
        }

        // Generate bias report
        const biasReport = getBiasReport(
          profile.raw_text || '',
          anonymizeResume(profile.raw_text || '')
        );

        analysisResult.biasReport = biasReport;

        console.log(`[Resume Upload] Parsed successfully via ${analysisResult.source} — ${profile.skills.length} skills, ${profile.experience_years}yr exp`);
      }
    } catch (aiError) {
      console.error('[Resume Upload] AI Parse Error:', aiError.message);
      analysisResult = {
        success: false,
        source: 'error',
        error: aiError.message
      };
    }

    await student.save();

    res.status(200).json({
      message: 'Resume uploaded and processed',
      resumeUrl,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('[Resume Upload] Server Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Match resume against a job description (Quick Match)
// @route   POST /api/resumes/match-job
exports.matchJob = async (req, res) => {
  try {
    const { job_description } = req.body;
    if (!job_description) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (!student.skills || student.skills.length === 0) {
      return res.status(400).json({ message: 'Please upload and parse your resume first' });
    }

    const candidateData = {
      skills: student.skills,
      raw_text: student.parsedResumeText || student.skills.join(' '),
      experience_years: student.experience_years || 0
    };

    const result = quickMatch(candidateData, job_description);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[Quick Match] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
