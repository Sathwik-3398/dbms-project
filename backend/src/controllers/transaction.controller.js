const Transaction = require('../models/Transaction.model');
const Book = require('../models/Book.model');
const User = require('../models/User.model');
const Notification = require('../models/Notification.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPurchase = async (req, res) => {
  try {
    const { bookId, paymentMethod, shippingAddress } = req.body;

    const book = await Book.findById(bookId).populate('sellerId');
    
    if (!book || book.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Book not available' });
    }

    const amount = book.price;
    const platformFee = amount * (Number(process.env.PLATFORM_FEE_PERCENTAGE) / 100);
    const sellerAmount = amount - platformFee;

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const transaction = await Transaction.create({
      transactionType: 'purchase',
      transactionId,
      buyerId: req.user.id,
      sellerId: book.sellerId._id,
      bookId,
      amount,
      platformFee,
      sellerAmount,
      paymentMethod,
      shippingDetails: { address: shippingAddress }
    });

    let paymentIntent = null;
    if (paymentMethod === 'card') {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { transactionId: transaction.transactionId }
      });

      transaction.paymentIntentId = paymentIntent.id;
      await transaction.save();
    }

    await Book.findByIdAndUpdate(bookId, { status: 'reserved' });

    await Notification.create({
      userId: book.sellerId._id,
      type: 'transaction',
      title: 'New Purchase',
      message: `Your book "${book.title}" has been purchased`,
      relatedId: transaction._id,
      relatedModel: 'Transaction'
    });

    res.status(201).json({
      success: true,
      transaction,
      paymentIntent: paymentIntent ? {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId, paymentIntentId } = req.body;

    const transaction = await Transaction.findOne({ transactionId });
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      transaction.paymentStatus = 'completed';
      transaction.status = 'payment-completed';
      await transaction.save();

      await Book.findByIdAndUpdate(transaction.bookId, { status: 'sold', soldAt: Date.now() });

      res.json({ success: true, transaction });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyerId', 'username profile')
      .populate('sellerId', 'username profile')
      .populate('bookId');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (type === 'purchases') {
      query.buyerId = req.user.id;
    } else if (type === 'sales') {
      query.sellerId = req.user.id;
    } else {
      query.$or = [{ buyerId: req.user.id }, { sellerId: req.user.id }];
    }

    const transactions = await Transaction.find(query)
      .populate('bookId')
      .populate('buyerId', 'username profile.avatar')
      .populate('sellerId', 'username profile.avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;
    
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    transaction.status = status;
    if (trackingNumber) {
      transaction.shippingDetails.trackingNumber = trackingNumber;
      transaction.shippingDetails.carrier = carrier;
      transaction.shippingDetails.shippingStatus = 'shipped';
      transaction.shippingDetails.shippedAt = Date.now();
    }

    await transaction.save();

    await Notification.create({
      userId: transaction.buyerId,
      type: 'shipping',
      title: 'Order Shipped',
      message: `Your order has been shipped. Tracking: ${trackingNumber}`,
      relatedId: transaction._id,
      relatedModel: 'Transaction'
    });

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
