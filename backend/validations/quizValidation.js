
const { z } = require('zod');

// Schema for an individual flashcard inside the quiz
const cardSchema = z.object({
  question: z
    .string({ required_error: "Question is required" })
    .trim()
    .min(3, "Question must be at least 3 characters long"),
  answer: z
    .string({ required_error: "Answer is required" })
    .trim()
    .min(1, "Answer cannot be empty")
});

// Main Quiz Validation Schema
const quizSchema = z.object({
  title: z
    .string({ required_error: "Quiz title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  // Ensures cards is an array containing at least one valid card object
  cards: z
    .array(cardSchema)
    .min(1, "A quiz must contain at least one flashcard")
});

module.exports = { quizSchema };