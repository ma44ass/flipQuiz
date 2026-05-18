const Quiz = require('../models/Quiz');

// @desc    Create a new quiz deck with flashcards
// @route   POST /api/quizzes
// @access  Private (Creators only)
exports.createQuiz = async (req, res) => {
    const { title, description, cards } = req.body;
    
    // Build the quiz document
    // inject req.user._id (which our auth middleware will provide) straight into creator!
    const quiz = new Quiz({
      title,
      description,
      cards,
      creator: req.user.id 
    });

    const createdQuiz = await quiz.save();

    // 4. Return the freshly created quiz deck
    res.status(201).json(createdQuiz);
};


// @desc    Get all quizzes created by the logged-in user
// @route   GET /api/quizzes/my-quizzes
// @access  Private (Teachers/Creators only)
exports.getUserQuizzes = async (req, res) => {
    // Look for all quizzes where the creator field matches the authenticated user's ID
    const quizzes = await Quiz.find({ creator: req.user.id });
    res.status(200).json(quizzes);

};

// @desc    Update a quiz deck details or cards
// @route   PUT /api/quizzes/:id
// @access  Private (Only the creator can update)
exports.updateQuiz = async (req, res) => {
    // 1. Find the quiz by URL ID
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    // 2. Strict Ownership Check
    if (quiz.creator.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized to update this quiz');
    }

    // 3. Update the quiz in the database with the incoming req.body data
    // { new: true } returns the freshly updated document, and runValidators ensures the schema rules still apply
    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.status(200).json(quiz)
};

// @desc    Delete a quiz deck
// @route   DELETE /api/quizzes/:id
// @access  Private (Only the creator can delete)
exports.deleteQuiz = async (req,res) => {
    // 1. Find the quiz by the ID passed in the URL parameters
    const quiz = await Quiz.findById(req.params.id);

    // 2. If the quiz doesn't exist, send a 404
    if(!quiz){
      res.status(404);
      throw new Error('Quiz not found');
    }

      // 3. Check Ownership: Does the quiz creator ID match the logged in user's ID?
      // NOTE: quiz.creator is a MongoDB ObjectId, so we must convert it to a string to compare it to req.user.id
      if(quiz.creator.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized to delete this quiz');
      }

        // 4. Secure check passed! Delete the document from the database
      await quiz.deleteOne();
      res.status(200).json({ message: 'Quiz successfully removed' });
  };