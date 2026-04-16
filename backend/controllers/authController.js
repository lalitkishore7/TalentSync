const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new student
// @route   POST /api/auth/register/student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      email,
      password: hashedPassword,
      role: 'student'
    });

    await Student.create({ user: user._id });

    res.status(201).json({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new company
// @route   POST /api/auth/register/company
exports.registerCompany = async (req, res) => {
  try {
    const { companyName, govRegId, gstCin, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Mock Government Verification
    const isGovValid = govRegId.startsWith('GOV') && gstCin.length >= 10;
    const verifiedStatus = isGovValid ? 'verified' : 'rejected';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName: companyName,
      email,
      password: hashedPassword,
      role: 'company'
    });

    const company = await Company.create({
      user: user._id,
      companyName,
      govRegId,
      gstCin,
      verifiedStatus
    });

    res.status(201).json({
      _id: user._id,
      name: user.firstName,
      email: user.email,
      role: user.role,
      verified: company.verifiedStatus === 'verified',
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
        _id: user._id,
        name: user.role === 'student' ? `${user.firstName} ${user.lastName}` : user.firstName,
        email: user.email,
        role: user.role,
        ...extraInfo,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
