const quizService = require('../services/quizService');

// @desc    Create a new quiz deck with flashcards
// @route   POST /api/quizzes
// @access  Private (Creators only)
exports.createQuiz = async (req, res) => {
  const createdQuiz = await quizService.createQuiz(req.body, req.user.id);
  res.status(201).json(createdQuiz);
};

// @desc    Get all quizzes created by the logged-in user
// @route   GET /api/quizzes/my-quizzes
// @access  Private (Teachers/Creators only)
exports.getUserQuizzes = async (req, res) => {
  const quizzes = await quizService.getUserQuizzes(req.user.id);
  res.status(200).json(quizzes);
};

// @desc    Get a single quiz deck by ID
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res) => {
    const quiz = await quizService.getQuizById(req.params.id);
    res.status(200).json(quiz);
}

// @desc    Update a quiz deck details or cards
// @route   PUT /api/quizzes/:id
// @access  Private (Only the creator can update)
exports.updateQuiz = async (req, res) => {
  const updatedQuiz = await quizService.updateQuiz(req.params.id, req.body, req.user.id);
  res.status(200).json(updatedQuiz);
};

// @desc    Delete a quiz deck
// @route   DELETE /api/quizzes/:id
// @access  Private (Only the creator can delete)
exports.deleteQuiz = async (req, res) => {
  const result = await quizService.deleteQuiz(req.params.id, req.user.id);
  res.status(200).json(result);
};