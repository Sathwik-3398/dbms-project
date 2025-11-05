import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut, ShoppingBag, Repeat, MessageCircle, Heart, Search, Menu, X, Bell, Settings, Package } from 'lucide-react';

const Navbar = () => {
  const { logout, isAuthenticated, isSeller, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">BookMarket</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for books, authors, or ISBN..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-full transition relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Chats */}
                <Link to="/chats" className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-full transition relative">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </Link>

                {/* Wishlist */}
                <Link to="/wishlist" className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-full transition">
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Sell Button */}
                {isSeller && (
                  <Link 
                    to="/seller/add-book" 
                    className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition font-medium flex items-center space-x-1 shadow-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span>Sell</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-full transition"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user?.username || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || ''}</p>
                      </div>
                      
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Dashboard
                      </Link>
                      
                      <Link 
                        to="/exchanges" 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Repeat className="w-4 h-4 mr-3" />
                        My Exchanges
                      </Link>
                      
                      {isSeller && (
                        <Link 
                          to="/seller/dashboard" 
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <ShoppingBag className="w-4 h-4 mr-3" />
                          Seller Dashboard
                        </Link>
                      )}
                      
                      <Link 
                        to="/settings" 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/books" className="px-4 py-2 text-gray-700 hover:text-primary-600 transition font-medium">
                  Browse Books
                </Link>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition font-medium shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <User className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
                <Link to="/books" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Browse Books
                </Link>
                <Link to="/exchanges" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <Repeat className="w-5 h-5 mr-3" />
                  Exchanges
                </Link>
                <Link to="/chats" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Chats
                </Link>
                <Link to="/wishlist" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <Heart className="w-5 h-5 mr-3" />
                  Wishlist
                </Link>
                {isSeller && (
                  <Link to="/seller/dashboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                    <Package className="w-5 h-5 mr-3" />
                    Sell Books
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/books" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Browse Books
                </Link>
                <Link to="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-3 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
