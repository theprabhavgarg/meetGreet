import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaBell,
  FaLock,
  FaShieldAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight
} from 'react-icons/fa';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/');
    }
  };

  const settings = [
    {
      id: 'profile',
      icon: FaUser,
      title: 'Edit Profile',
      description: 'Update your profile information',
      action: () => toast('Profile editing coming soon!')
    },
    {
      id: 'notifications',
      icon: FaBell,
      title: 'Notifications',
      description: 'Manage notification preferences',
      action: () => setActiveSection(activeSection === 'notifications' ? null : 'notifications')
    },
    {
      id: 'privacy',
      icon: FaShieldAlt,
      title: 'Privacy & Safety',
      description: 'Control your privacy settings',
      action: () => setActiveSection(activeSection === 'privacy' ? null : 'privacy')
    },
    {
      id: 'password',
      icon: FaLock,
      title: 'Change Password',
      description: 'Update your password',
      action: () => toast('Password change coming soon!')
    },
    {
      id: 'subscription',
      icon: FaCreditCard,
      title: 'Subscription & Billing',
      description: 'Manage your premium subscription',
      action: () => setActiveSection(activeSection === 'subscription' ? null : 'subscription')
    },
    {
      id: 'help',
      icon: FaQuestionCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => toast('Support page coming soon!')
    }
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-text mb-6">Settings</h1>

        {/* Account Info Card */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-heading font-bold text-text">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-text">
                {user?.fullName || 'User'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-1 px-3 py-1 bg-primary rounded-full text-sm font-medium text-text">
                Free Account
              </span>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-2">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.id}>
                <button
                  onClick={setting.action}
                  className="w-full card hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="text-xl text-text" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-text">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400" />
                </button>

                {/* Expanded Sections */}
                {activeSection === setting.id && (
                  <div className="card mt-2 bg-canvas animate-fade-in">
                    {setting.id === 'notifications' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Match Notifications</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Message Notifications</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Meetup Reminders</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                    )}

                    {setting.id === 'privacy' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Show Profile to Verified Users Only</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Hide Last Active Status</span>
                          <input type="checkbox" className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Allow Story Tags</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                    )}

                    {setting.id === 'subscription' && (
                      <div>
                        <h4 className="font-semibold text-text mb-4">Upgrade to Premium</h4>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Unlimited chat access</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Unlimited super push stars</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Priority matching</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Ad-free experience</span>
                          </div>
                        </div>
                        <button className="w-full btn-primary">
                          Upgrade to Premium - $9.99/month
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Danger Zone */}
        <div className="card mt-8 border-2 border-red-200">
          <h3 className="text-lg font-heading font-bold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
            <button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
              Delete Account
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>MeetUp Network v1.0.0</p>
          <p className="mt-1">For friendships & professional networking, not dating</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
