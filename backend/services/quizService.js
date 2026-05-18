const Quiz = require('../models/Quiz');

/**
 * QuizService handles all core business rules and direct database operations
 * for the FlipQuiz application, keeping controllers completely decoupled from Mongoose.
 */

class QuizService {
  
  // 1. Create a quiz
  async createQuiz(quizData, userId) {
    const quiz = new Quiz({
      ...quizData,
      creator: userId
    });
    return await quiz.save();
  }

  // 2. Get all quizzes for a specific user
  async getUserQuizzes(userId) {
    return await Quiz.find({ creator: userId });
  }

  // 3. Update a quiz with explicit ownership validation
  async updateQuiz(quizId, updateData, userId) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      throw error;
    }

    // Business rule: Only the creator can alter data
    if (quiz.creator.toString() !== userId) {
      const error = new Error('User not authorized to update this quiz');
      error.statusCode = 401;
      throw error;
    }

    return await Quiz.findByIdAndUpdate(quizId, updateData, {
      returnDocument: 'after',
      runValidators: true
    });
  }

  // 4. Delete a quiz with explicit ownership validation
  async deleteQuiz(quizId, userId) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      throw error;
    }

    // Business rule: Only the creator can destroy data
    if (quiz.creator.toString() !== userId) {
      const error = new Error('User not authorized to delete this quiz');
      error.statusCode = 401;
      throw error;
    }

    await quiz.deleteOne();
    return { message: 'Quiz successfully removed' };
  }
}

// Export a single instance of the service so it acts as a Singleton throughout our app
module.exports = new QuizService();