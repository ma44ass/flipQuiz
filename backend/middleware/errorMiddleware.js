/*
 * @file errorMiddleware.js
 * @description Centralized Express Error Handling Pipeline.
 * * MECHANICS:
 * - Intercepts all unhandled errors thrown inside async controllers wrapped by 'express-async-handler'.
 * - Prevents node process crashes by formatting exceptions into structured JSON responses.
 * * IMPORTANT: Express identifies error-handling middleware strictly by its 4-argument 
 * signature (err, req, res, next). Omitting any parameter breaks the pipeline.
 * * SECURITY:
 * - Automatically evaluates 'process.env.NODE_ENV'.
 * - In 'development': Exposes the full execution stack trace for fast debugging.
 * - In 'production': Strips the stack trace string to protect internal file paths from public exposure.
 */



const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    res.status(statusCode).json({
        stack : process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

module.exports = {errorHandler};
