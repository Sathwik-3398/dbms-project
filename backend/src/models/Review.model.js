const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  images: [String],
  helpful: { type: Number, default: 0 },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerifiedPurchase: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'hidden', 'reported', 'removed'],
    default: 'active'
  },
  reportedBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    reason: String,
    reportedAt: Date
  }],
  sellerResponse: {
    comment: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ reviewedUserId: 1, status: 1 });
reviewSchema.index({ transactionId: 1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);
