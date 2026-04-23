const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ mentor: 1, mentee: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

