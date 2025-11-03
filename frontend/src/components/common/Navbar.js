import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut, ShoppingBag, Repeat, MessageCircle, Heart } from 'lucide-react';

const Navbar = () => {
  const { logout, isAuthenticated, isSeller } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">BookMarket</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/books" className="flex items-center text-gray-700 hover:text-primary-600 transition">
              <ShoppingBag className="w-5 h-5 mr-1" />
              Browse
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <User className="w-5 h-5 mr-1" />
                  Dashboard
                </Link>
                <Link to="/exchanges" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <Repeat className="w-5 h-5 mr-1" />
                  Exchanges
                </Link>
                <Link to="/chats" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <MessageCircle className="w-5 h-5 mr-1" />
                  Chats
                </Link>
                <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <Heart className="w-5 h-5 mr-1" />
                  Wishlist
                </Link>
                {isSeller && (
                  <Link to="/seller/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition">
                    Sell Books
                  </Link>
                )}
                <button 
                  onClick={logout} 
                  className="flex items-center text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
