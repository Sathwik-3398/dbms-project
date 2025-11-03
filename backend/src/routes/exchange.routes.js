const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createExchange,
  getExchange,
  acceptExchange,
  rejectExchange,
  counterOffer,
  getReceivedExchanges,
  getSentExchanges,
  completeExchange
} = require('../controllers/exchange.controller');

router.post('/', protect, createExchange);
router.get('/received', protect, getReceivedExchanges);
router.get('/sent', protect, getSentExchanges);
router.get('/:id', protect, getExchange);
router.put('/:id/accept', protect, acceptExchange);
router.put('/:id/reject', protect, rejectExchange);
router.put('/:id/counter', protect, counterOffer);
router.post('/:id/complete', protect, completeExchange);

module.exports = router;
