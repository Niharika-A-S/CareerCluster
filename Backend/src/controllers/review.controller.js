const { body, param } = require('express-validator');
const Review = require('../models/Review');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const createReviewValidators = [
  body('mentorId').isString().notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }).toInt(),
  body('comment').optional().isString(),
];

const reviewIdValidators = [param('id').isString().notEmpty()];
const mentorIdValidators = [param('mentorId').isString().notEmpty()];

const createReview = asyncHandler(async (req, res) => {
  const mentor = await User.findOne({ _id: req.body.mentorId, role: 'mentor', isActive: true }).exec();
  if (!mentor) throw fail('Mentor not found', 404);

  const review = await Review.create({
    mentor: mentor._id,
    mentee: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment || '',
  });

  return ok(res, { data: { review } }, 201);
});

const getMentorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ mentor: req.params.mentorId })
    .populate('mentee', 'name profile')
    .sort({ createdAt: -1 })
    .exec();
  return ok(res, { data: { reviews } });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, mentee: req.user.id }).exec();
  if (!review) throw fail('Review not found', 404);

  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;

  await review.save();
  return ok(res, { data: { review } });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, mentee: req.user.id }).exec();
  if (!review) throw fail('Review not found', 404);
  await review.deleteOne();
  return ok(res, { message: 'Review deleted' });
});

module.exports = {
  createReviewValidators,
  reviewIdValidators,
  mentorIdValidators,
  createReview,
  getMentorReviews,
  updateReview,
  deleteReview,
};

