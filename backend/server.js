require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
// Route Imports
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resumes');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Mount Points
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Optional: Fallback Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: err.message, 
    stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
});

const PORT = process.env.PORT || 8001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
