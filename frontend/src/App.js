import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookList from './pages/user/BookList';
import BookDetail from './pages/user/BookDetail';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddBook from './pages/seller/AddBook';
import UserDashboard from './pages/user/UserDashboard';
import ExchangeList from './pages/user/ExchangeList';
import ChatPage from './pages/user/ChatPage';
import Wishlist from './pages/user/Wishlist';

// Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/exchanges" element={
          <ProtectedRoute>
            <ExchangeList />
          </ProtectedRoute>
        } />
        <Route path="/chats" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
        
        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute requireSeller>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/seller/add-book" element={
          <ProtectedRoute requireSeller>
            <AddBook />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
