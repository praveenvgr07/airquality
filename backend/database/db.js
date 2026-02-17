const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const username = process.env.MONGO_USERNAME || 'PRAVEEN';
    const password = process.env.MONGO_PASSWORD || 'praveen@2007';
    const cluster = process.env.MONGO_CLUSTER || 'cluster0.rztytky.mongodb.net';
    const dbName = process.env.MONGO_DB || 'airquality';
    
    // URL encode the password to handle special characters
    const encodedPassword = encodeURIComponent(password);
    const mongoURI = `mongodb+srv://${username}:${encodedPassword}@${cluster}/${dbName}?retryWrites=true&w=majority`;
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;