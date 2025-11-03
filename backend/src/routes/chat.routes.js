const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getChats,
  createChat,
  getChatMessages,
  sendMessage,
  markAsRead
} = require('../controllers/chat.controller');

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:id/messages', protect, getChatMessages);
router.post('/:id/messages', protect, sendMessage);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
