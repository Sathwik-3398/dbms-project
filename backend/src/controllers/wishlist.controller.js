const Wishlist = require('../models/Wishlist.model');

exports.getWishlist = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate('bookId')
      .sort({ addedAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Wishlist.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      wishlist,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { bookId, notifyOnPriceChange, targetPrice } = req.body;

    const existing = await Wishlist.findOne({ userId: req.user.id, bookId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Book already in wishlist' });
    }

    const wishlist = await Wishlist.create({
      userId: req.user.id,
      bookId,
      notifyOnPriceChange,
      targetPrice
    });

    await wishlist.populate('bookId');

    res.status(201).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.user.id, bookId: req.params.bookId });

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
