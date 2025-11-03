const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id, isActive: true })
      .populate('participants', 'username profile.avatar')
      .populate('bookId', 'title images')
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participantId, bookId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      bookId
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, participantId],
        bookId
      });
    }

    await chat.populate('participants', 'username profile.avatar');
    await chat.populate('bookId', 'title images');

    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ chatId: req.params.id })
      .populate('senderId', 'username profile.avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ chatId: req.params.id });

    res.json({
      success: true,
      messages: messages.reverse(),
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType = 'text' } = req.body;

    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const receiverId = chat.participants.find(p => p.toString() !== req.user.id);

    const message = await Message.create({
      chatId: req.params.id,
      senderId: req.user.id,
      receiverId,
      content,
      messageType
    });

    chat.lastMessage = {
      text: content,
      senderId: req.user.id,
      timestamp: Date.now()
    };
    chat.updatedAt = Date.now();
    await chat.save();

    // Don't emit here - let the frontend handle Socket.io emission
    // This prevents duplicate messages
    
    await message.populate('senderId', 'username profile.avatar');

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { chatId: req.params.id, receiverId: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
