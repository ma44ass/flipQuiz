const express = require('express');
const router = express.Router();

const { createQuiz, getUserQuizzes, deleteQuiz, updateQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// Zod validator :
const { validateBody } = require('../middleware/validateMiddleware');
const { quizSchema } = require('../validations/quizValidation');

//Routes
router.get('/my-quizzes', protect, getUserQuizzes);
router.post('/', protect, validateBody(quizSchema), createQuiz);
router.put('/:id', protect,validateBody(quizSchema), updateQuiz);
router.delete('/:id', protect, deleteQuiz);

module.exports = router;