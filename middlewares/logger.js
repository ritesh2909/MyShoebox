// logger.js
const pino = require('pino')();

function logger(req, res, next) {
  pino.info({
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
  next();
}

module.exports = logger;
