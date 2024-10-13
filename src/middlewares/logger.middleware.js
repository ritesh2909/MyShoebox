import pino from 'pino';

// Create a logger instance
const logger = pino();

function logMiddleware(req, res, next) {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
  next();
}

export default logMiddleware;