const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getUser,
  updateUser,
  getUserBooks,
  getUserReviews,
  getUserTransactions
} = require('../controllers/user.controller');

router.get('/:id', getUser);
router.put('/:id', protect, updateUser);
router.get('/:id/books', getUserBooks);
router.get('/:id/reviews', getUserReviews);
router.get('/:id/transactions', protect, getUserTransactions);

module.exports = router;
