/**
 * Input Validation Middleware
 * Validates incoming request data
 */

/**
 * Validate chat message input
 */
const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Message is required and must be a string'
      }
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Message cannot be empty'
      }
    });
  }

  if (message.length > 500) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Message is too long (max 500 characters)'
      }
    });
  }

  next();
};

/**
 * Validate intent input (keyword and response)
 */
const validateIntent = (req, res, next) => {
  const { keyword, response } = req.body;

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Keyword is required and must be a string'
      }
    });
  }

  if (!response || typeof response !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Response is required and must be a string'
      }
    });
  }

  if (keyword.trim().length === 0 || response.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Keyword and response cannot be empty'
      }
    });
  }

  next();
};

module.exports = {
  validateChatMessage,
  validateIntent
};
