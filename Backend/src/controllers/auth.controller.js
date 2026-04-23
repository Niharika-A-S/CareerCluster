const { body } = require('express-validator');
const User = require('../models/User');
const { signToken, verifyToken } = require('../utils/jwt');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const signupValidators = [
  body('name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  // Frontend currently validates 6+ chars, align to avoid confusing 422s
  body('password').isString().isLength({ min: 6 }),
  body('role').isIn(['mentor', 'mentee']),
];

const loginValidators = [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()];

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email }).exec();
  if (existing) throw fail('Email already in use', 409);

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role });

  const token = signToken({ sub: user._id.toString(), role: user.role });

  return ok(res, { token, data: { user: user.toPublicJSON() } }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash').exec();
  if (!user || !user.isActive) throw fail('Invalid email or password', 401);

  const valid = await user.verifyPassword(password);
  if (!valid) throw fail('Invalid email or password', 401);

  const token = signToken({ sub: user._id.toString(), role: user.role });
  return ok(res, { token, data: { user: user.toPublicJSON() } });
});

const logout = asyncHandler(async (req, res) => {
  // Frontend stores JWT in localStorage; server-side logout is a no-op.
  return ok(res, { message: 'Logged out' });
});

const refresh = asyncHandler(async (req, res) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) throw fail('Unauthorized', 401);

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.sub).exec();
  if (!user || !user.isActive) throw fail('Unauthorized', 401);

  const nextToken = signToken({ sub: user._id.toString(), role: user.role });
  return ok(res, { token: nextToken, data: { user: user.toPublicJSON() } });
});

module.exports = {
  signupValidators,
  loginValidators,
  signup,
  login,
  logout,
  refresh,
};

