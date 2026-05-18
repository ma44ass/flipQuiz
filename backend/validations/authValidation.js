const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .trim()
      .min(2, 'Username must be at least 2 characters long'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    role: z.string().optional() 
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
  })
});

module.exports = {
  registerSchema,
  loginSchema
};