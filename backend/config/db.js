const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/', {
      dbName: 'glowcart',
    });

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Continuing in local dev mode without active MongoDB.');
  }
};

module.exports = connectDB;
