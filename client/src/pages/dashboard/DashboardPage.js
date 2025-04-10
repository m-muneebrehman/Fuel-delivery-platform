// client/src/pages/dashboard/DashboardPage.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  // Content based on user role
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
            <p>Welcome to the admin dashboard. From here you can:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Manage users and suppliers</li>
              <li>View platform statistics</li>
              <li>Handle disputes and reports</li>
            </ul>
          </div>
        );
      
      case 'customer':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Dashboard</h2>
            <p>Welcome to your dashboard. From here you can:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Order fuel or vehicle parts</li>
              <li>Track your current orders</li>
              <li>View your order history</li>
            </ul>
          </div>
        );
      
      case 'fuel_supplier':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Fuel Supplier Dashboard</h2>
            <p>Welcome to your supplier dashboard. From here you can:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Manage your fuel inventory</li>
              <li>Process incoming orders</li>
              <li>Coordinate with delivery personnel</li>
            </ul>
          </div>
        );
      
      case 'parts_supplier':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Parts Supplier Dashboard</h2>
            <p>Welcome to your supplier dashboard. From here you can:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Manage your parts inventory</li>
              <li>Process incoming orders</li>
              <li>Coordinate with delivery personnel</li>
            </ul>
          </div>
        );
      
      case 'delivery':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Dashboard</h2>
            <p>Welcome to your delivery dashboard. From here you can:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>View assigned deliveries</li>
              <li>Update delivery status</li>
              <li>Check delivery history</li>
            </ul>
          </div>
        );
      
      default:
        return <p>Welcome to the dashboard!</p>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col space-y-4">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
                <p className="text-gray-600">Role: {user.role.replace('_', ' ')}</p>
              </div>
              
              {renderDashboardContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;