const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  createBookingValidators,
  bookingIdValidators,
} = require('../controllers/booking.controller');

const router = express.Router();

router.post('/', requireAuth, createBookingValidators, validate, createBooking);
router.get('/', requireAuth, getBookings);
router.get('/:id', requireAuth, bookingIdValidators, validate, getBookingById);
router.put('/:id', requireAuth, bookingIdValidators, validate, updateBooking);
router.delete('/:id', requireAuth, bookingIdValidators, validate, cancelBooking);

module.exports = router;

