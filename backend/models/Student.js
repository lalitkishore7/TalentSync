const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  university: {
    type: String,
    required: false
  },
  degree: {
    type: String,
    required: false
  },
  year: {
    type: String,
    required: false
  },
  skills: [{
    type: String
  }],
  resumeUrl: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  github: String,
  linkedin: String
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
