const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  notificationIdValidators,
} = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', requireAuth, getNotifications);
router.put('/read-all', requireAuth, markAllAsRead);
router.put('/:id/read', requireAuth, notificationIdValidators, validate, markAsRead);

module.exports = router;

