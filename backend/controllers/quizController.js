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


// @desc    Get all quizzes created by the logged-in user
// @route   GET /api/quizzes/my-quizzes
// @access  Private (Teachers/Creators only)
exports.getUserQuizzes = async (req, res) => {
  try {
    // Look for all quizzes where the creator field matches the authenticated user's ID
    const quizzes = await Quiz.find({ creator: req.user._id });

    // Send back the array (even if empty [], a 200 OK is the correct HTTP behavior)
    return res.status(200).json(quizzes);
    
  } catch (error) {
    return res.status(500).json({ 
      message: 'Server Error while fetching your quizzes.', 
      error: error.message 
    });
  }
};

// @desc    Update a quiz deck details or cards
// @route   PUT /api/quizzes/:id
// @access  Private (Only the creator can update)
exports.updateQuiz = async (req, res) => {
  try {
    // 1. Find the quiz by URL ID
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // 2. Strict Ownership Check
    if (quiz.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this quiz' });
    }

    // 3. Update the quiz in the database with the incoming req.body data
    // { new: true } returns the freshly updated document, and runValidators ensures the schema rules still apply
    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    return res.status(200).json(quiz);

  } catch (error) {
    return res.status(500).json({
      message: 'Server Error while trying to update quiz',
      error: error.message
    });
  }
};

// @desc    Delete a quiz deck
// @route   DELETE /api/quizzes/:id
// @access  Private (Only the creator can delete)
exports.deleteQuiz = async (req,res) => {
  try{
    // 1. Find the quiz by the ID passed in the URL parameters
    const quiz = await Quiz.findById(req.params.id);

    // 2. If the quiz doesn't exist, send a 404
    if(!quiz){
      return res.status(404).json({
        message : 'Quiz not found'
        });
      }

      // 3. Check Ownership: Does the quiz creator ID match the logged in user's ID?
      // NOTE: quiz.creator is a MongoDB ObjectId, so we must convert it to a string to compare it to req.user.id
      if(quiz.creator.toString() !== req.user.id){
        return res.status(401).json({
          message : 'User not authorized to delete this quiz'
        });
      }

        // 4. Secure check passed! Delete the document from the database
        await quiz.deleteOne();
        return res.status(200).json({
          message : 'Quiz successfully removed'
        });
    
  } catch (error) {
    return res.status(500).json({
      message : 'Server Error while trying to delete quiz',
      error: error.message
    });
  }
};