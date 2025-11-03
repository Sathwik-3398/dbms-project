const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  notifyOnPriceChange: { type: Boolean, default: false },
  targetPrice: { type: Number, min: 0 },
  notifyOnAvailability: { type: Boolean, default: true },
  notes: String,
  addedAt: { type: Date, default: Date.now }
});

wishlistSchema.index({ userId: 1, bookId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1, addedAt: -1 });
wishlistSchema.index({ bookId: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
