const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createReview,
  getMentorReviews,
  updateReview,
  deleteReview,
  createReviewValidators,
  reviewIdValidators,
  mentorIdValidators,
} = require('../controllers/review.controller');

const router = express.Router();

router.post('/', requireAuth, createReviewValidators, validate, createReview);
router.get('/mentor/:mentorId', mentorIdValidators, validate, getMentorReviews);
router.put('/:id', requireAuth, reviewIdValidators, validate, updateReview);
router.delete('/:id', requireAuth, reviewIdValidators, validate, deleteReview);

module.exports = router;

