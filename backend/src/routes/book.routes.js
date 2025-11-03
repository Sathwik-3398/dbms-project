const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getTrendingBooks,
  getRecommendations,
  calculateValuation
} = require('../controllers/book.controller');

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/trending', getTrendingBooks);
router.get('/recommendations', protect, getRecommendations);
router.post('/', protect, authorize('seller', 'admin'), createBook);
router.get('/:id', getBook);
router.put('/:id', protect, authorize('seller', 'admin'), updateBook);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteBook);
router.post('/:id/valuation', protect, calculateValuation);

module.exports = router;
