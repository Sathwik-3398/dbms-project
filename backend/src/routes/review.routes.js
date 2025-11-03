const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createReview,
  getBookReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful
} = require('../controllers/review.controller');

router.post('/', protect, createReview);
router.get('/book/:bookId', getBookReviews);
router.get('/user/:userId', getUserReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;
