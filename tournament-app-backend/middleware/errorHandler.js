// middleware/errorHandler.js

// This middleware will catch any unhandled errors and respond with a message.
const errorHandler = (err, req, res, next) => {
    console.error(err);  // Log the error for debugging
  
    // Check for specific errors and send proper status codes
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: err.errors.map(e => e.message),
      });
    }
  
    // Generic error handler
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  };
  
  module.exports = errorHandler;
  