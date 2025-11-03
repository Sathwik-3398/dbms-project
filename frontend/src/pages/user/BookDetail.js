import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, MessageCircle, Repeat, MapPin, Calendar, BookOpen, Star } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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
    // Navigate to purchase page (we'll create this)
    toast.info('Purchase feature - Coming soon!');
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
    toast.info('Exchange feature - Coming soon!');
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
    </div>
  );
};

export default BookDetail;
