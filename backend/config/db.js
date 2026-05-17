const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB Atlas cloud cluster using your secret URI string
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🚀 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); // Shut down the server completely if the database connection fails
  }
};

module.exports = connectDB;