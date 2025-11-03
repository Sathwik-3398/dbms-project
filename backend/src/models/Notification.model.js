const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['exchange-request', 'exchange-accepted', 'exchange-rejected', 'exchange-counter', 'message', 'price-alert', 'availability-alert', 'transaction', 'payment', 'shipping', 'review', 'system', 'promotion'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  relatedId: mongoose.Schema.Types.ObjectId,
  relatedModel: {
    type: String,
    enum: ['Book', 'Transaction', 'Exchange', 'Chat', 'Review', 'User']
  },
  actionUrl: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  isSent: { type: Boolean, default: false },
  sentAt: Date
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
