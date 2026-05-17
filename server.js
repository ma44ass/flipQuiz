const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added the native Node path module
const dotenv = require('dotenv');


dotenv.config({ path: path.resolve(__dirname, '.env') });


// STEP 3: Initialize the Express application
const app = express();

// STEP 4: Global Middlewares
app.use(cors());          // Allow frontend communication
app.use(express.json());  // Read incoming JSON request bodies!

// STEP 5: Connect to MongoDB using the freshly loaded URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas Cloud.'))
  .catch((err) => console.error('❌ Database connection error:', err));

// STEP 6: A Basic Health-Check Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Flip Quiz API Engine!" });
});

// STEP 7: Start listening for network traffic
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in development on http://localhost:${PORT}`);
});