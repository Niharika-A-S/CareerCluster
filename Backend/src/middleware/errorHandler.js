/* eslint-disable no-console */

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Server error';

  if (process.env.NODE_ENV !== 'production') {
    // Avoid noisy logs for expected auth/permission failures during normal browsing.
    if (statusCode >= 500) {
      console.error(err);
    }
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {}),
  });
}

module.exports = { errorHandler };

