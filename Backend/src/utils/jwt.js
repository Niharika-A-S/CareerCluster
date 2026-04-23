const jwt = require('jsonwebtoken');

function signToken(payload, opts = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('JWT_SECRET is required');
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    ...opts,
  });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('JWT_SECRET is required');
    err.statusCode = 500;
    throw err;
  }

  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };

