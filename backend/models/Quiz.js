const mongoose = require('mongoose');

// 1. Define the Flashcard Schema (The Individual Card Blueprint)
const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a flashcard question'],
    trim: true
  },
  correctAnswer: {
    type: String,
    required: [true, 'Please provide the correct answer'],
    trim: true
  },
  options: {
    type: [String], // Array of strings for multiple choice choices
    required: [true, 'Please provide choice options for the quiz card'],
    validate: [arrayLimit, 'A flashcard must have at least 2 options']
  }
});

// Custom validator helper function to make sure they provide choices
function arrayLimit(val) {
  return val.length >= 2;
}

// 2. Define the Main Quiz Schema (The Deck Container)
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId, // Relates this quiz to a specific User ID
    ref: 'User', // Points directly to our User Model
    required: true
  },
  cards: [flashcardSchema], // Embedding our array of cards right inside the deck!
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 3. Compile and Export
module.exports = mongoose.model('Quiz', quizSchema);