import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Repeat, MessageCircle, Star, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Smart Book Exchange & Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Buy, sell, and exchange books with intelligent valuation
          </p>
          <div className="space-x-4">
            <Link to="/books" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Browse Books
            </Link>
            <Link to="/register" className="inline-block bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border-2 border-white">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose BookMarket?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-lg transition">
            <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Browse & Buy</h3>
            <p className="text-gray-600">
              Discover thousands of books from verified sellers at great prices
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition">
            <Repeat className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Smart Exchange</h3>
            <p className="text-gray-600">
              Exchange books with automatic value calculation and fair pricing
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition">
            <MessageCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Real-time Chat</h3>
            <p className="text-gray-600">
              Connect with sellers instantly through our built-in messaging system
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition">
            <Star className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Reviews & Ratings</h3>
            <p className="text-gray-600">
              Make informed decisions with verified reviews from real buyers
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition">
            <TrendingUp className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Smart Valuation</h3>
            <p className="text-gray-600">
              AI-powered book valuation based on condition, demand, and rarity
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition">
            <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Secure Payments</h3>
            <p className="text-gray-600">
              Safe and secure transactions with Stripe payment integration
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to Start Trading Books?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of book lovers buying, selling, and exchanging books
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
