const User = require('../models/User.model');
const Book = require('../models/Book.model');
const Review = require('../models/Review.model');
const Transaction = require('../models/Transaction.model');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBooks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = { sellerId: req.params.id, isActive: true };
    if (status) query.status = status;

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUserId: req.params.id, status: 'active' })
      .populate('reviewerId', 'username profile.avatar')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
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

exports.getUserTransactions = async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (type === 'purchases') {
      query.buyerId = req.user.id;
    } else if (type === 'sales') {
      query.sellerId = req.user.id;
    } else {
      query.$or = [{ buyerId: req.user.id }, { sellerId: req.user.id }];
    }

    const transactions = await Transaction.find(query)
      .populate('bookId')
      .populate('buyerId', 'username profile.avatar')
      .populate('sellerId', 'username profile.avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
