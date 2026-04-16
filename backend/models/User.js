const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false, // Required only for non-login (handled in route)
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'company', 'admin'],
    default: 'student'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
