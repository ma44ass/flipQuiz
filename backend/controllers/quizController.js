const Quiz = require('../models/Quiz');

// @desc    Create a new quiz deck with flashcards
// @route   POST /api/quizzes
// @access  Private (Creators only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, cards } = req.body;

    // 1.Ensure a title and cards array are present
    if (!title || !cards || !Array.isArray(cards)) {
      return res.status(400).json({ 
        message: 'Validation failed. A quiz requires a title and an array of flashcards.' 
      });
    }

    // 2. Build the quiz document
    //  inject req.user._id (which our auth middleware will provide) straight into creator!
    const newQuiz = new Quiz({
      title,
      description,
      cards,
      creator: req.user._id 
    });

    // 3. Save to MongoDB Atlas
    const savedQuiz = await newQuiz.save();

    // 4. Return the freshly created quiz deck
    res.status(201).json(savedQuiz);

  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error during quiz creation', 
      error: error.message 
    });
  }
};