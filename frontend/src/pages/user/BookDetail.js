import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, MessageCircle, Repeat, MapPin, Calendar, BookOpen, Star, X, Check, Phone, CreditCard } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeForm, setExchangeForm] = useState({
    bookTitle: '',
    bookAuthor: '',
    bookCondition: 'good',
    message: ''
  });

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data.book);
    } catch (error) {
      toast.error('Failed to load book details');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      // Create transaction
      const response = await api.post('/transactions', {
        bookId: book._id,
        sellerId: book.sellerId._id,
        amount: book.price,
        type: 'purchase'
      });
      
      toast.success('Purchase request sent! Please contact seller to complete the transaction.');
      setShowBuyModal(false);
      
      // Start chat with seller
      const chatResponse = await api.post('/chats', {
        participantId: book.sellerId._id,
        bookId: book._id
      });
      
      // Send purchase message to chat
      await api.post(`/chats/${chatResponse.data.chat._id}/messages`, {
        content: `Hi! I'm interested in buying "${book.title}" for ₹${book.price}. Let's discuss the payment and delivery details.`
      });
      
      navigate(`/chats?chatId=${chatResponse.data.chat._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process purchase');
    }
  };

  const handleChatWithSeller = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to chat');
      navigate('/login');
      return;
    }

    try {
      // Create or get existing chat
      const response = await api.post('/chats', {
        participantId: book.sellerId._id,
        bookId: book._id
      });

      // Navigate to chat page with the chat ID
      navigate(`/chats?chatId=${response.data.chat._id}`);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleExchange = () => {
    if (!isAuthenticated) {
      toast.error('Please login to exchange');
      navigate('/login');
      return;
    }
    setShowExchangeModal(true);
  };

  const handleSubmitExchange = async () => {
    if (!exchangeForm.bookTitle || !exchangeForm.bookAuthor) {
      toast.error('Please fill in your book details');
      return;
    }

    try {
      // Create exchange request
      const response = await api.post('/exchanges', {
        requestedBookId: book._id,
        receiverId: book.sellerId._id,
        offeredBook: {
          title: exchangeForm.bookTitle,
          author: exchangeForm.bookAuthor,
          condition: exchangeForm.bookCondition
        },
        message: exchangeForm.message
      });

      toast.success('Exchange request sent to seller!');
      setShowExchangeModal(false);
      
      // Start chat with seller
      const chatResponse = await api.post('/chats', {
        participantId: book.sellerId._id,
        bookId: book._id
      });
      
      // Send exchange request message to chat
      await api.post(`/chats/${chatResponse.data.chat._id}/messages`, {
        content: `Hi! I'd like to exchange my book "${exchangeForm.bookTitle}" by ${exchangeForm.bookAuthor} (${exchangeForm.bookCondition} condition) for your "${book.title}". ${exchangeForm.message ? 'Additional message: ' + exchangeForm.message : ''}`
      });
      
      navigate(`/chats?chatId=${chatResponse.data.chat._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send exchange request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Book not found</p>
      </div>
    );
  }

  const canBuy = book.listingType === 'sale' || book.listingType === 'both';
  const canExchange = book.listingType === 'exchange' || book.listingType === 'both';
  const isOwnBook = user && book.sellerId._id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div>
          <img
            src={book.images[0] || 'https://via.placeholder.com/400x600?text=Book+Cover'}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
          {book.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {book.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${book.title} ${index + 2}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        {/* Book Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary-600">${book.price}</span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xl text-gray-400 line-through">${book.originalPrice}</span>
              )}
            </div>
            {book.estimatedValue && (
              <p className="text-sm text-gray-600 mt-1">
                Estimated Value: ${book.estimatedValue}
              </p>
            )}
          </div>

          {/* Status & Condition */}
          <div className="flex gap-3 mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              book.status === 'available' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {book.status}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">
              {book.condition}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 capitalize">
              {book.format}
            </span>
          </div>

          {/* Action Buttons */}
          {!isOwnBook && book.status === 'available' && (
            <div className="space-y-3 mb-6">
              {canBuy && (
                <button
                  onClick={handleBuyNow}
                  className="w-full btn-primary py-3 text-lg flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              )}
              
              <button
                onClick={handleChatWithSeller}
                className="w-full btn-secondary py-3 text-lg flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Seller
              </button>

              {canExchange && (
                <button
                  onClick={handleExchange}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition text-lg flex items-center justify-center"
                >
                  <Repeat className="w-5 h-5 mr-2" />
                  Exchange Book
                </button>
              )}
            </div>
          )}

          {isOwnBook && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">This is your book listing</p>
            </div>
          )}

          {/* Book Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Book Information</h3>
            <div className="space-y-3">
              {book.isbn && (
                <div className="flex">
                  <span className="text-gray-600 w-32">ISBN:</span>
                  <span className="font-medium">{book.isbn}</span>
                </div>
              )}
              <div className="flex">
                <span className="text-gray-600 w-32">Category:</span>
                <span className="font-medium capitalize">{book.category}</span>
              </div>
              {book.genre && book.genre.length > 0 && (
                <div className="flex">
                  <span className="text-gray-600 w-32">Genre:</span>
                  <span className="font-medium">{book.genre.join(', ')}</span>
                </div>
              )}
              {book.publisher && (
                <div className="flex">
                  <span className="text-gray-600 w-32">Publisher:</span>
                  <span className="font-medium">{book.publisher}</span>
                </div>
              )}
              {book.publicationYear && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 w-28">Published:</span>
                  <span className="font-medium">{book.publicationYear}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 w-28">Pages:</span>
                  <span className="font-medium">{book.pages}</span>
                </div>
              )}
              <div className="flex">
                <span className="text-gray-600 w-32">Language:</span>
                <span className="font-medium">{book.language}</span>
              </div>
              {book.location && book.location.city && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-600 w-28">Location:</span>
                  <span className="font-medium">
                    {book.location.city}, {book.location.state}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold text-lg">
                  {book.sellerId.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold">{book.sellerId.username}</p>
                {book.sellerId.sellerInfo && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{book.sellerId.sellerInfo.rating.toFixed(1)} ({book.sellerId.sellerInfo.totalRatings} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Description</h3>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{book.views}</p>
          <p className="text-gray-600 mt-1">Views</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-600">{book.favorites}</p>
          <p className="text-gray-600 mt-1">Favorites</p>
        </div>
        <div className="card text-center">
          <p className="text-lg font-bold text-gray-800 capitalize">{book.listingType}</p>
          <p className="text-gray-600 mt-1">Listing Type</p>
        </div>
        <div className="card text-center">
          <p className="text-lg font-bold text-gray-800">
            {new Date(book.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mt-1">Listed On</p>
        </div>
      </div>

      {/* Buy Now Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Purchase</h3>
              <p className="text-gray-600">You're about to buy this book</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={book.images[0]}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-2xl font-bold text-primary-600">₹{book.price}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Next Steps:</p>
                  <p className="text-gray-600">1. Chat will open with seller</p>
                  <p className="text-gray-600">2. Discuss payment method</p>
                  <p className="text-gray-600">3. Arrange delivery/pickup</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <p className="text-gray-600">Seller: <span className="font-medium">{book.sellerId.username}</span></p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition"
              >
                Confirm & Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowExchangeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Exchange Book</h3>
              <p className="text-gray-600">Offer your book in exchange for "{book.title}"</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Book Title *
                </label>
                <input
                  type="text"
                  value={exchangeForm.bookTitle}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, bookTitle: e.target.value })}
                  className="input-field"
                  placeholder="Enter your book title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Author *
                </label>
                <input
                  type="text"
                  value={exchangeForm.bookAuthor}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, bookAuthor: e.target.value })}
                  className="input-field"
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Book Condition *
                </label>
                <select
                  value={exchangeForm.bookCondition}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, bookCondition: e.target.value })}
                  className="input-field"
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={exchangeForm.message}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, message: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Add any additional details about your book or exchange offer..."
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your exchange request will be sent to the seller via chat. 
                You can discuss the exchange details directly with them.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExchangeModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitExchange}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
