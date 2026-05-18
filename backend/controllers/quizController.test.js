const quizController = require('./quizController');
const quizService = require('../services/quizService');

// Mock the quizService completely
jest.mock('../services/quizService');

describe('Quiz Controller Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up mock request and response objects matching your controller's structure
    req = {
      params: {},
      body: {},
      user: { id: 'mockUserId123' } // Maps perfectly to req.user.id in your controllers
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  // ==========================================
  //  UPDATE QUIZ TEST
  // ==========================================
  describe('updateQuiz', () => {
    it('should call quizService.updateQuiz and return 200 with the updated quiz', async () => {
      req.params.id = 'quizId111';
      req.body = { title: 'Updated Tailwind Quiz' };

      const mockUpdatedQuiz = {
        _id: 'quizId111',
        title: 'Updated Tailwind Quiz',
        instructor: 'mockUserId123'
      };

      // Force our mock service to return the updated quiz data
      quizService.updateQuiz.mockResolvedValue(mockUpdatedQuiz);

      await quizController.updateQuiz(req, res);

      // Verify the controller parsed inputs and called the service flawlessly
      expect(quizService.updateQuiz).toHaveBeenCalledWith('quizId111', req.body, 'mockUserId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedQuiz);
    });
  });

  // ==========================================
  //  DELETE QUIZ TEST
  // ==========================================
  describe('deleteQuiz', () => {
    it('should call quizService.deleteQuiz and return 200 with a success message', async () => {
      req.params.id = 'quizId222';
      
      const mockSuccessResult = { message: 'Quiz deleted successfully' };
      
      // Force our mock service to return a success message
      quizService.deleteQuiz.mockResolvedValue(mockSuccessResult);

      await quizController.deleteQuiz(req, res);

      // Verify the controller forwarded the request details perfectly
      expect(quizService.deleteQuiz).toHaveBeenCalledWith('quizId222', 'mockUserId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSuccessResult);
    });
  });
});