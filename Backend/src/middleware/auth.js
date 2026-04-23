const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { fail } = require('../utils/apiResponse');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(fail('Unauthorized', 401));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).exec();
    if (!user || !user.isActive) {
      return next(fail('Unauthorized', 401));
    }

    req.user = user.toPublicJSON();
    req.userDoc = user;
    return next();
  } catch (e) {
    return next(fail('Unauthorized', 401));
  }
}

function requireRole(...roles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) return next(fail('Unauthorized', 401));
    if (!roles.includes(req.user.role)) {
      return next(fail('Forbidden', 403));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };

