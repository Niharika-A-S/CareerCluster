const { query, param } = require('express-validator');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const listMentorsValidators = [
  query('interest').optional().isString(),
  query('q').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const getMentorByIdValidators = [param('id').isString().notEmpty()];

const searchMentorsValidators = [
  query('q').optional().isString(),
  query('interest').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const getAvailabilityValidators = [param('id').isString().notEmpty()];

const listMentors = asyncHandler(async (req, res) => {
  const { interest, q } = req.query;
  const limit = req.query.limit || 50;

  const filter = { role: 'mentor', isActive: true };
  if (interest) filter.interests = interest;

  let queryBuilder = User.find(filter);
  if (q) {
    queryBuilder = queryBuilder.find({
      $or: [{ name: new RegExp(q, 'i') }, { 'profile.title': new RegExp(q, 'i') }, { 'profile.company': new RegExp(q, 'i') }],
    });
  }

  const mentors = await queryBuilder.limit(limit).sort({ createdAt: -1 }).exec();
  return ok(res, { data: { mentors: mentors.map((m) => m.toPublicJSON()) } });
});

const getMentorById = asyncHandler(async (req, res) => {
  const mentor = await User.findOne({ _id: req.params.id, role: 'mentor', isActive: true }).exec();
  if (!mentor) throw fail('Mentor not found', 404);
  return ok(res, { data: { mentor: mentor.toPublicJSON() } });
});

const searchMentors = asyncHandler(async (req, res) => {
  const { interest, q } = req.query;
  const limit = req.query.limit || 50;

  const filter = { role: 'mentor', isActive: true };
  if (interest) filter.interests = interest;

  let queryBuilder = User.find(filter);
  if (q) {
    queryBuilder = queryBuilder.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { interests: new RegExp(q, 'i') },
        { 'profile.title': new RegExp(q, 'i') },
        { 'profile.company': new RegExp(q, 'i') },
        { 'profile.bio': new RegExp(q, 'i') },
      ],
    });
  }

  const mentors = await queryBuilder.limit(limit).sort({ createdAt: -1 }).exec();
  return ok(res, { data: { mentors: mentors.map((m) => m.toPublicJSON()) } });
});

const getMentorAvailability = asyncHandler(async (req, res) => {
  const mentor = await User.findOne({ _id: req.params.id, role: 'mentor', isActive: true }).exec();
  if (!mentor) throw fail('Mentor not found', 404);
  return ok(res, { data: { availability: mentor.profile?.availability || [] } });
});

module.exports = {
  listMentorsValidators,
  getMentorByIdValidators,
  searchMentorsValidators,
  getAvailabilityValidators,
  listMentors,
  getMentorById,
  searchMentors,
  getMentorAvailability,
};

