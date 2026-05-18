// Middleware factory that takes a Zod schema and validates the request body
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Extract only the error messages into a clean format
    const errorMessages = result.error.errors.map(err => err.message).join(', ');
    
    res.status(400); // Bad Request
    throw new Error(`Validation Error: ${errorMessages}`);
  }

  // If validation passes, overwrite req.body with the cleaned/parsed data
  req.body = result.data;
  next();
};

module.exports = { validateBody };