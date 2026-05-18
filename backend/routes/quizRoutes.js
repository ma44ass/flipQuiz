const express = require('express');
const router = express.Router();
// 1. Add updateQuiz to your imports array
const { createQuiz, getUserQuizzes, deleteQuiz, updateQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createQuiz);
router.get('/my-quizzes', protect, getUserQuizzes);
router.delete('/:id', protect, deleteQuiz);

// Route: PUT /api/quizzes/:id (Update a specific quiz by ID)
router.put('/:id', protect, updateQuiz);

module.exports = router;