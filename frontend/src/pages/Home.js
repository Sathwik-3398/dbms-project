import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Repeat, MessageCircle, Star, TrendingUp, Shield, Zap, DollarSign, Clock, Award, ArrowRight, Users, Package } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wIDEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">India's #1 Book Marketplace</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Buy, Sell & Exchange
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                Books You Love
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-10 text-primary-50 max-w-2xl mx-auto">
              Join thousands of book lovers. Get the best deals on pre-loved books or sell your collection at great prices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/books" className="group px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:bg-gray-50 transition shadow-xl hover:shadow-2xl flex items-center space-x-2">
                <span>Browse Books</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/register" className="px-8 py-4 bg-transparent text-white rounded-full font-semibold hover:bg-white/10 transition border-2 border-white backdrop-blur-sm">
                Start Selling
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">5000+</div>
                <div className="text-primary-100 text-sm">Books Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2000+</div>
                <div className="text-primary-100 text-sm">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-primary-100 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Why Book Lovers Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to buy, sell, and exchange books with confidence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-interactive group">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Best Prices</h3>
            <p className="text-gray-600">
              Get up to 70% off on pre-loved books. Sell your books at fair market prices.
            </p>
          </div>

          <div className="card-interactive group">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Repeat className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Smart Exchange</h3>
            <p className="text-gray-600">
              Exchange books with automatic value calculation. Pay only the difference.
            </p>
          </div>

          <div className="card-interactive group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Chat Instantly</h3>
            <p className="text-gray-600">
              Real-time messaging with sellers. Get quick responses to your questions.
            </p>
          </div>

          <div className="card-interactive group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Quick Listing</h3>
            <p className="text-gray-600">
              List your books in under 2 minutes. Simple, fast, and hassle-free.
            </p>
          </div>

          <div className="card-interactive group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Secure Payments</h3>
            <p className="text-gray-600">
              100% secure payments with Stripe. Your money is always protected.
            </p>
          </div>

          <div className="card-interactive group">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Verified Sellers</h3>
            <p className="text-gray-600">
              Buy from trusted sellers. Check ratings and reviews before purchase.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Sign Up Free</h3>
              <p className="text-gray-600">
                Create your account in seconds. No credit card required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Browse or List</h3>
              <p className="text-gray-600">
                Find books you want or list your own books to sell.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Buy or Sell</h3>
              <p className="text-gray-600">
                Complete transactions securely and enjoy your books!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bS0xMCAwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAxMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <Users className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Join India's Largest Book Community
            </h2>
            <p className="text-xl text-primary-50 mb-10">
              Over 2000+ book lovers are already buying, selling, and exchanging books. Don't miss out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="px-10 py-4 bg-white text-primary-600 rounded-full font-bold hover:bg-gray-50 transition shadow-xl hover:shadow-2xl text-lg">
                Create Free Account
              </Link>
              <Link to="/books" className="px-10 py-4 bg-transparent text-white rounded-full font-bold hover:bg-white/10 transition border-2 border-white backdrop-blur-sm text-lg">
                Browse Books
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-primary-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Trusted by 2000+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
