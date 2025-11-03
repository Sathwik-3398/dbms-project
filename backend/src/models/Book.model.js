const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: 100
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  estimatedValue: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    enum: ['fiction', 'non-fiction', 'academic', 'textbook', 'comics', 'magazines', 'children', 'young-adult', 'biography', 'history', 'science', 'technology', 'self-help', 'cooking', 'art', 'other'],
    required: true
  },
  genre: [String],
  language: {
    type: String,
    default: 'English'
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear() + 1
  },
  publisher: String,
  pages: {
    type: Number,
    min: 1
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook']
  },
  listingType: {
    type: String,
    enum: ['sale', 'exchange', 'both'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'exchanged', 'reserved', 'inactive'],
    default: 'available'
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  tags: [{ type: String, lowercase: true }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  soldAt: Date,
  exchangedAt: Date
}, {
  timestamps: true
});

// Text indexes for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ sellerId: 1, status: 1 });
bookSchema.index({ category: 1, status: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ listingType: 1, status: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ views: -1 });

module.exports = mongoose.model('Book', bookSchema);
