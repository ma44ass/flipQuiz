const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.issues
      ? result.error.issues.map(err => err.message).join(', ')
      : "Invalid request data";
    
    res.status(400); // Bad Request
    throw new Error(`Validation Error: ${errorMessages}`);
  }

  // If validation passes, overwrite req.body with the cleaned/parsed data
  req.body = result.data;
  next();
};

module.exports = { validateBody };