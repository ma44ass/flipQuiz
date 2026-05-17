const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');
const authRoutes = require('./backend/routes/authRoutes');

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
app.use('/api/auth', require('./backend/routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('API is running smoothly...');
});

app.use('/api/quizzes', require('./backend/routes/quizRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});