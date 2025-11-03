import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, sales: 0, exchanges: 0 });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get(`/users/${user.id}/books`);
      setBooks(response.data.books);
      setStats({
        total: response.data.books.length,
        sales: response.data.books.filter(b => b.status === 'sold').length,
        exchanges: response.data.books.filter(b => b.status === 'exchanged').length
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${bookId}`);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link to="/seller/add-book" className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add New Book
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Books Sold</h3>
          <p className="text-3xl font-bold text-green-600">{stats.sales}</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Exchanges</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.exchanges}</p>
        </div>
      </div>

      {/* Books List */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">My Books</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">You haven't added any books yet</p>
            <Link to="/seller/add-book" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Condition</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img
                          src={book.images[0] || 'https://via.placeholder.com/100x150?text=Book'}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{book.title}</p>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-primary-600">${book.price}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="capitalize text-sm">{book.condition}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        book.status === 'available' ? 'bg-green-100 text-green-800' :
                        book.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-gray-600">
                        <Eye className="w-4 h-4 mr-1" />
                        {book.views}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/books/${book._id}`}
                          className="text-primary-600 hover:text-primary-800"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
