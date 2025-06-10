/**
 * Handles errors consistently across the application
 * @param {Response} res - Express response object
 * @param {string} operation - Description of the operation being performed
 * @param {Error} error - The error object
 */
function handleError(res, operation, error) {
  console.error(`Error during ${operation}:`, error.message);
  
  if (error.code) {
    console.error('Error code:', error.code);
  }
  
  if (error.details) {
    console.error('Error details:', error.details);
  }

  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: `Failed to ${operation}.`,
    error: error.message,
    code: error.code || 'UNKNOWN_ERROR'
  });
}

module.exports = { handleError };