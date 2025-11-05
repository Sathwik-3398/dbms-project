import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>
      
      <div className="mb-8 flex gap-4">
        <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link key={book._id} to={`/books/${book._id}`} className="card hover:shadow-lg transition group">
            <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
              <img
                src={book.images[0] || `https://via.placeholder.com/300x450/f97316/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`}
                alt={book.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450/f97316/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`;
                }}
              />
              <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                ₹{book.price}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{book.author}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">{book.condition}</span>
              <span className="text-xs text-gray-500">{book.location?.city || 'India'}</span>
            </div>
          </Link>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No books found</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
