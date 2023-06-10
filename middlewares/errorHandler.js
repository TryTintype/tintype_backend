const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes

    // Set an appropriate status code and error message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send the error response
    res.status(statusCode).json({ message });
  };

  module.exports = errorHandler
