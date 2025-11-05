const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['purchase', 'exchange'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: { type: Number, default: 0, min: 0 },
  sellerAmount: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'cash', 'exchange'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: String,
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    receiptUrl: String
  },
  status: {
    type: String,
    enum: ['initiated', 'payment-pending', 'payment-completed', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'initiated'
  },
  shippingDetails: {
    address: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String
    },
    trackingNumber: String,
    carrier: String,
    shippingStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered', 'failed'],
      default: 'pending'
    },
    shippedAt: Date,
    deliveredAt: Date
  },
  refund: {
    requested: Boolean,
    requestedAt: Date,
    reason: String,
    status: String,
    amount: Number,
    processedAt: Date
  },
  notes: String,
  metadata: Object,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// transactionId index is automatically created by unique: true
transactionSchema.index({ buyerId: 1, createdAt: -1 });
transactionSchema.index({ sellerId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
