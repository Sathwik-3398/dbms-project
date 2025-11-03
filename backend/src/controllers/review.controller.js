const Review = require('../models/Review.model');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');

exports.createReview = async (req, res) => {
  try {
    const { reviewedUserId, transactionId, bookId, rating, title, comment, images } = req.body;

    const existingReview = await Review.findOne({ reviewerId: req.user.id, transactionId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this transaction' });
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      reviewedUserId,
      transactionId,
      bookId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: true
    });

    const user = await User.findById(reviewedUserId);
    user.updateRating(rating);
    await user.save();

    await review.populate('reviewerId', 'username profile.avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ bookId: req.params.bookId, status: 'active' })
      .populate('reviewerId', 'username profile.avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ bookId: req.params.bookId, status: 'active' });
    
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: total,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUserId: req.params.userId, status: 'active' })
      .populate('reviewerId', 'username profile.avatar')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.reviewerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, isEdited: true, editedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, review: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.reviewerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.helpfulBy.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already marked as helpful' });
    }

    review.helpful += 1;
    review.helpfulBy.push(req.user.id);
    await review.save();

    res.json({ success: true, helpful: review.helpful });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
