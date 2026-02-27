const morgan = require('morgan');

/**
 * Request Logging Middleware
 * Logs all incoming HTTP requests with method, URL, status, and response time
 */
const logger = morgan(':method :url :status :response-time ms - :res[content-length]');

module.exports = logger;
