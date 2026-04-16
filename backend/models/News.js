const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  source: String,
  url: {
    type: String,
    required: true
  },
  publishedAt: Date,
  category: {
    type: String,
    enum: ['Hiring', 'Startups', 'Layoffs', 'Technology'],
    default: 'Technology'
  }
}, { timestamps: true });

module.exports = mongoose.model('News', NewsSchema);
