const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getProfile,
  updateProfile,
  getInterests,
  updateInterests,
  deleteAccount,
  updateProfileValidators,
  updateInterestsValidators,
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfileValidators, validate, updateProfile);

router.get('/interests', requireAuth, getInterests);
router.put('/interests', requireAuth, updateInterestsValidators, validate, updateInterests);

router.delete('/account', requireAuth, deleteAccount);

module.exports = router;

