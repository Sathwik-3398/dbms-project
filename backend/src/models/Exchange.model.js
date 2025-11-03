const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  exchangeId: {
    type: String,
    unique: true,
    required: true
  },
  initiatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  offeredBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  requestedBookValue: {
    type: Number,
    required: true,
    min: 0
  },
  offeredBookValue: {
    type: Number,
    required: true,
    min: 0
  },
  valueDifference: { type: Number, default: 0 },
  additionalAmount: { type: Number, default: 0, min: 0 },
  paymentRequired: { type: Boolean, default: false },
  paymentDirection: {
    type: String,
    enum: ['initiator-pays', 'receiver-pays', 'none'],
    default: 'none'
  },
  paymentStatus: {
    type: String,
    enum: ['not-required', 'pending', 'completed', 'failed'],
    default: 'not-required'
  },
  paymentIntentId: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'counter-offered', 'payment-pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  counterOffer: {
    additionalAmount: Number,
    message: String,
    offeredAt: Date
  },
  negotiationHistory: [{
    action: String,
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    message: String,
    timestamp: Date
  }],
  notes: String,
  shippingDetails: {
    initiatorTracking: String,
    receiverTracking: String,
    initiatorShipped: Boolean,
    receiverShipped: Boolean,
    initiatorReceived: Boolean,
    receiverReceived: Boolean
  },
  completedAt: Date,
  cancelledAt: Date,
  cancelledBy: mongoose.Schema.Types.ObjectId,
  cancellationReason: String
}, {
  timestamps: true
});

// Calculate value difference before saving
exchangeSchema.pre('save', function(next) {
  this.valueDifference = this.requestedBookValue - this.offeredBookValue;
  
  if (Math.abs(this.valueDifference) > 5) {
    this.paymentRequired = true;
    this.additionalAmount = Math.abs(this.valueDifference);
    this.paymentDirection = this.valueDifference > 0 ? 'initiator-pays' : 'receiver-pays';
  }
  
  next();
});

exchangeSchema.index({ exchangeId: 1 });
exchangeSchema.index({ initiatorId: 1, status: 1 });
exchangeSchema.index({ receiverId: 1, status: 1 });
exchangeSchema.index({ status: 1 });

module.exports = mongoose.model('Exchange', exchangeSchema);
