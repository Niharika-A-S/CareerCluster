const { body } = require('express-validator');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const updateProfileValidators = [
  body('name').optional().isString().trim().notEmpty(),
  body('profile').optional().isObject(),
  body('profile.title').optional().isString(),
  body('profile.bio').optional().isString(),
  body('profile.company').optional().isString(),
  body('profile.location').optional().isString(),
  body('profile.avatarUrl').optional().isString(),
];

const updateInterestsValidators = [
  body('interests').isArray({ min: 0 }),
  body('interests.*').isString().trim().notEmpty(),
];

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) throw fail('User not found', 404);
  return ok(res, { data: { user: user.toPublicJSON() } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) throw fail('User not found', 404);

  if (typeof req.body.name === 'string') user.name = req.body.name;
  if (req.body.profile && typeof req.body.profile === 'object') {
    user.profile = { ...user.profile, ...req.body.profile };
  }

  await user.save();
  return ok(res, { data: { user: user.toPublicJSON() } });
});

const getInterests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) throw fail('User not found', 404);
  return ok(res, { data: { interests: user.interests } });
});

const updateInterests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) throw fail('User not found', 404);

  user.interests = req.body.interests;
  await user.save();
  return ok(res, { data: { interests: user.interests } });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) throw fail('User not found', 404);

  user.isActive = false;
  await user.save();
  return ok(res, { message: 'Account deleted' });
});

module.exports = {
  updateProfileValidators,
  updateInterestsValidators,
  getProfile,
  updateProfile,
  getInterests,
  updateInterests,
  deleteAccount,
};

