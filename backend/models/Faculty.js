const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: false
  },
  specialization: {
    type: String,
    required: false
  },
  university: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
