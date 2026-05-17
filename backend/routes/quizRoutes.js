const express = require('express');
const router = express.Router();
const { createQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/quizzes
// Placing 'protect' right before 'createQuiz' creates the security wall
router.post('/', protect, createQuiz);

module.exports = router;