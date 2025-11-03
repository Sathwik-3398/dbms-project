const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlist.controller');

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:bookId', protect, removeFromWishlist);

module.exports = router;
