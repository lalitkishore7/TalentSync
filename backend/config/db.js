const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error('MONGO_URI environment variable is missing!');
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Force IPv4, fixes Render Node 18+ DNS issues with Atlas
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // DO NOT crash process on Vercel
  }
};

module.exports = connectDB;
