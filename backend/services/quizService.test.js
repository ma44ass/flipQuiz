const QuizService = require('./quizService'); // Path to your singleton service
const Quiz = require('../models/Quiz');  // Path to your Mongoose model

// 1. Tell Jest to automatically mock the Quiz model
jest.mock('../models/Quiz');

describe('QuizService - getUserQuizzes', () => {
  
  // Clear all mocks after each individual test case to keep things pristine
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(' should return quizzes belonging to a specific user', async () => {
    // 2. Setup your mock data (what we expect the DB to look like)
    const mockQuizzes = [
      { title: 'JavaScript Basics', creator: 'user123' },
      { title: 'CSS Layouts', creator: 'user123' }
    ];

    // 3. Train your mock Mongoose model to return our fake array
    Quiz.find.mockResolvedValue(mockQuizzes);

    // 4. Execute the actual service method we want to test
    const result = await QuizService.getUserQuizzes('user123');

    // 5. Assertions: Verify the outcome matches our expectations
    expect(Quiz.find).toHaveBeenCalledTimes(1);
    expect(Quiz.find).toHaveBeenCalledWith({ creator: 'user123' });
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('JavaScript Basics');
  });

  it('should throw a 404 error if the quiz does not exist', async () => {
    // 1. Train your mock Mongoose model to return null (simulating a missing document)
    Quiz.findById.mockResolvedValue(null);

    // 2. Assert that executing the service method throws an error
    await expect(QuizService.getQuizById('missingId123'))
      .rejects
      .toThrow();
      
    // 3. Verify Mongoose was called with the correct ID before it failed
    expect(Quiz.findById).toHaveBeenCalledWith('missingId123');
  });

});