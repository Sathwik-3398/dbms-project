const Book = require('../models/Book.model');
const calculateBookValue = require('../utils/calculateBookValue');

exports.getBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      condition,
      listingType,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { isActive: true, status: 'available' };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (listingType) query.listingType = { $in: [listingType, 'both'] };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };

    const books = await Book.find(query)
      .populate('sellerId', 'username profile.avatar sellerInfo.rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('sellerId', 'username email profile sellerInfo');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.views += 1;
    await book.save();

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const bookData = { ...req.body, sellerId: req.user.id };
    
    // Remove empty ISBN to avoid duplicate key error
    if (!bookData.isbn || bookData.isbn.trim() === '') {
      delete bookData.isbn;
    }
    
    // Ensure required fields have defaults
    if (!bookData.publicationYear) {
      bookData.publicationYear = new Date().getFullYear();
    }
    if (!bookData.pages) {
      bookData.pages = 100;
    }
    if (!bookData.originalPrice) {
      bookData.originalPrice = bookData.price;
    }
    if (!bookData.images || bookData.images.length === 0) {
      // Try to use Open Library cover if ISBN is available, otherwise use styled placeholder
      if (bookData.isbn) {
        bookData.images = [`https://covers.openlibrary.org/b/isbn/${bookData.isbn}-L.jpg`];
      } else {
        // Create a nice placeholder with the book title
        const titleText = encodeURIComponent(bookData.title.substring(0, 30));
        bookData.images = [`https://via.placeholder.com/300x450/f97316/ffffff?text=${titleText}`];
      }
    }
    if (!bookData.genre || bookData.genre.length === 0) {
      bookData.genre = [];
    }
    
    const estimatedValue = calculateBookValue(bookData);
    bookData.estimatedValue = estimatedValue;

    const book = await Book.create(bookData);
    await book.populate('sellerId', 'username email profile sellerInfo');

    res.status(201).json({ success: true, book });
  } catch (error) {
    console.error('Create book error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        message: `A book with this ${field} already exists. Please use a different ${field}.` 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, book: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    book.isActive = false;
    await book.save();

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true, status: 'available' };
    
    if (q) {
      query.$text = { $search: q };
    }
    
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .populate('sellerId', 'username profile.avatar sellerInfo.rating')
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
      count: total,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrendingBooks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const books = await Book.find({ isActive: true, status: 'available' })
      .sort({ views: -1, favorites: -1 })
      .limit(Number(limit))
      .populate('sellerId', 'username profile.avatar sellerInfo.rating');

    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const books = await Book.find({ isActive: true, status: 'available' })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('sellerId', 'username profile.avatar sellerInfo.rating');

    res.json({ success: true, recommendations: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateValuation = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const estimatedValue = calculateBookValue(book);

    res.json({
      success: true,
      valuation: {
        estimatedValue,
        currentPrice: book.price,
        originalPrice: book.originalPrice
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
