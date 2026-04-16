const mongoose = require('mongoose');

const FraudReportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'ignored'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('FraudReport', FraudReportSchema);
