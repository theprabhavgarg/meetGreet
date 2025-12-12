import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-heading font-bold text-text mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-text">0</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-text">0</h3>
            <p className="text-gray-600">Active Matches</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-text">0</h3>
            <p className="text-gray-600">Scheduled Meetups</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-text">0</h3>
            <p className="text-gray-600">SOS Alerts</p>
          </div>
        </div>
        <div className="card">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">Admin Panel</h2>
          <p className="text-gray-600">
            Admin management features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



