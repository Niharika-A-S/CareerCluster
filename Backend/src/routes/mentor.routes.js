const express = require('express');
const { validate } = require('../middleware/validate');
const {
  listMentors,
  getMentorById,
  searchMentors,
  getMentorAvailability,
  listMentorsValidators,
  getMentorByIdValidators,
  searchMentorsValidators,
  getAvailabilityValidators,
} = require('../controllers/mentor.controller');

const router = express.Router();

router.get('/', listMentorsValidators, validate, listMentors);
router.get('/search', searchMentorsValidators, validate, searchMentors);
router.get('/:id', getMentorByIdValidators, validate, getMentorById);
router.get('/:id/availability', getAvailabilityValidators, validate, getMentorAvailability);

module.exports = router;

