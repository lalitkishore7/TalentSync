const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Unified Registration (Student or Company)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, password, role,
      university, degree, year, // Student fields
      companyName, gstNumber, regId, hqAddress // Company fields
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Create User
    const userData = {
      firstName,
      lastName: lastName || '',
      email,
      password: hashedPassword,
      role: role || 'student'
    };

    const user = await User.create(userData);

    // 2. Create Profile based on role
    if (user.role === 'student') {
      await Student.create({
        user: user._id,
        university,
        degree,
        year,
        skills: []
      });
    } else if (user.role === 'company') {
      // Mock Government Verification for company
      const isGovValid = regId?.startsWith('GOV') && (gstNumber?.length || 0) >= 10;
      const verifiedStatus = isGovValid ? 'verified' : 'rejected';

      await Company.create({
        user: user._id,
        companyName: companyName || firstName,
        govRegId: regId,
        gstCin: gstNumber,
        verifiedStatus
      });
    }

    res.status(201).json({
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user (any role)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      let extraInfo = {};
      if (user.role === 'company') {
        const company = await Company.findOne({ user: user._id });
        extraInfo.verified = company.verifiedStatus === 'verified';
      }

      res.json({
        user: {
          _id: user._id,
          name: user.role === 'student' ? `${user.firstName} ${user.lastName}` : user.firstName,
          email: user.email,
          role: user.role,
          ...extraInfo
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
