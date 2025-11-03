import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}!</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">My Purchases</h3>
          <p className="text-gray-600">View your purchase history</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">My Exchanges</h3>
          <p className="text-gray-600">Manage your book exchanges</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">My Wishlist</h3>
          <p className="text-gray-600">Books you want to buy</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
