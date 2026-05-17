const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Clean import
const authRoutes = require('./routes/authRoutes');

// Load env variables
dotenv.config();

// Initialize Server
const app = express();

// Run the separated database connection
connectDB();

// Body Parser Middleware
app.use(express.json());

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});