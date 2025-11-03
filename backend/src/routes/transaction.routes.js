const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createPurchase,
  verifyPayment,
  getTransaction,
  getUserTransactions,
  updateTransactionStatus
} = require('../controllers/transaction.controller');

router.post('/purchase', protect, createPurchase);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, getUserTransactions);
router.get('/:id', protect, getTransaction);
router.put('/:id/status', protect, updateTransactionStatus);

module.exports = router;
