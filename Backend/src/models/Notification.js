const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, default: 'info' },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    metadata: { type: Object, default: {} },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

