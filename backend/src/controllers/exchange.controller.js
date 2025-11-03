const Exchange = require('../models/Exchange.model');
const Book = require('../models/Book.model');
const Notification = require('../models/Notification.model');

exports.createExchange = async (req, res) => {
  try {
    const { requestedBookId, offeredBookId, notes } = req.body;

    const requestedBook = await Book.findById(requestedBookId);
    const offeredBook = await Book.findById(offeredBookId);

    if (!requestedBook || !offeredBook) {
      return res.status(404).json({ success: false, message: 'One or both books not found' });
    }

    if (offeredBook.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only offer books you own' });
    }

    const exchangeId = `EXC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const exchange = await Exchange.create({
      exchangeId,
      initiatorId: req.user.id,
      receiverId: requestedBook.sellerId,
      requestedBookId,
      offeredBookId,
      requestedBookValue: requestedBook.estimatedValue || requestedBook.price,
      offeredBookValue: offeredBook.estimatedValue || offeredBook.price,
      notes
    });

    await Notification.create({
      userId: requestedBook.sellerId,
      type: 'exchange-request',
      title: 'New Exchange Request',
      message: `${req.user.username} wants to exchange a book with you`,
      relatedId: exchange._id,
      relatedModel: 'Exchange'
    });

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('initiatorId', 'username profile.avatar')
      .populate('receiverId', 'username profile.avatar')
      .populate('requestedBookId')
      .populate('offeredBookId');

    res.status(201).json({ success: true, exchange: populatedExchange });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('initiatorId', 'username profile')
      .populate('receiverId', 'username profile')
      .populate('requestedBookId')
      .populate('offeredBookId');

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange not found' });
    }

    res.json({ success: true, exchange });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange not found' });
    }

    if (exchange.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    exchange.status = 'accepted';
    await exchange.save();

    await Book.findByIdAndUpdate(exchange.requestedBookId, { status: 'reserved' });
    await Book.findByIdAndUpdate(exchange.offeredBookId, { status: 'reserved' });

    await Notification.create({
      userId: exchange.initiatorId,
      type: 'exchange-accepted',
      title: 'Exchange Accepted',
      message: 'Your exchange request has been accepted',
      relatedId: exchange._id,
      relatedModel: 'Exchange'
    });

    res.json({ success: true, exchange });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange not found' });
    }

    if (exchange.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    exchange.status = 'rejected';
    exchange.cancellationReason = req.body.reason;
    await exchange.save();

    await Notification.create({
      userId: exchange.initiatorId,
      type: 'exchange-rejected',
      title: 'Exchange Rejected',
      message: 'Your exchange request has been rejected',
      relatedId: exchange._id,
      relatedModel: 'Exchange'
    });

    res.json({ success: true, message: 'Exchange rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.counterOffer = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange not found' });
    }

    if (exchange.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    exchange.status = 'counter-offered';
    exchange.counterOffer = {
      additionalAmount: req.body.additionalAmount,
      message: req.body.message,
      offeredAt: Date.now()
    };
    await exchange.save();

    await Notification.create({
      userId: exchange.initiatorId,
      type: 'exchange-counter',
      title: 'Counter Offer Received',
      message: 'You received a counter offer for your exchange request',
      relatedId: exchange._id,
      relatedModel: 'Exchange'
    });

    res.json({ success: true, exchange });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReceivedExchanges = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { receiverId: req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const exchanges = await Exchange.find(query)
      .populate('initiatorId', 'username profile.avatar')
      .populate('requestedBookId')
      .populate('offeredBookId')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Exchange.countDocuments(query);

    res.json({
      success: true,
      exchanges,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSentExchanges = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { initiatorId: req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const exchanges = await Exchange.find(query)
      .populate('receiverId', 'username profile.avatar')
      .populate('requestedBookId')
      .populate('offeredBookId')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Exchange.countDocuments(query);

    res.json({
      success: true,
      exchanges,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange not found' });
    }

    exchange.status = 'completed';
    exchange.completedAt = Date.now();
    await exchange.save();

    await Book.findByIdAndUpdate(exchange.requestedBookId, { status: 'exchanged', exchangedAt: Date.now() });
    await Book.findByIdAndUpdate(exchange.offeredBookId, { status: 'exchanged', exchangedAt: Date.now() });

    res.json({ success: true, message: 'Exchange completed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
