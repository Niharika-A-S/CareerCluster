const { param } = require('express-validator');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const notificationIdValidators = [param('id').isString().notEmpty()];

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).exec();
  return ok(res, { data: { notifications } });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id }).exec();
  if (!notification) throw fail('Notification not found', 404);
  notification.readAt = notification.readAt || new Date();
  await notification.save();
  return ok(res, { data: { notification } });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user.id, readAt: null }, { $set: { readAt: new Date() } }).exec();
  return ok(res, { message: 'All notifications marked as read' });
});

module.exports = {
  notificationIdValidators,
  getNotifications,
  markAsRead,
  markAllAsRead,
};

