const { body, param } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const createBookingValidators = [
  body('mentorId').isString().notEmpty(),
  body('date').isString().notEmpty(),
  body('time').isString().notEmpty(),
  body('domain').optional().isString(),
  body('message').optional().isString(),
];

const bookingIdValidators = [param('id').isString().notEmpty()];

const createBooking = asyncHandler(async (req, res) => {
  const mentor = await User.findOne({ _id: req.body.mentorId, role: 'mentor', isActive: true }).exec();
  if (!mentor) throw fail('Mentor not found', 404);

  const booking = await Booking.create({
    mentee: req.user.id,
    mentor: mentor._id,
    date: req.body.date,
    time: req.body.time,
    domain: req.body.domain || '',
    notes: req.body.message || '',
    status: 'pending',
  });

  return ok(res, { data: { booking } }, 201);
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ mentee: req.user.id })
    .populate('mentor', 'name profile role')
    .sort({ createdAt: -1 })
    .exec();
  return ok(res, { data: { bookings } });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, mentee: req.user.id })
    .populate('mentor', 'name profile role')
    .exec();
  if (!booking) throw fail('Booking not found', 404);
  return ok(res, { data: { booking } });
});

const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, mentee: req.user.id }).exec();
  if (!booking) throw fail('Booking not found', 404);

  const allowed = ['date', 'time', 'domain', 'status', 'notes'];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) booking[k] = req.body[k];
  });

  await booking.save();
  return ok(res, { data: { booking } });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, mentee: req.user.id }).exec();
  if (!booking) throw fail('Booking not found', 404);
  booking.status = 'cancelled';
  await booking.save();
  return ok(res, { data: { booking } });
});

module.exports = {
  createBookingValidators,
  bookingIdValidators,
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};

