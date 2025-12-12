import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { FaHeart, FaComments, FaCalendarAlt, FaStar, FaUsers, FaShieldAlt } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Welcome Section */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4 mb-6">
            {user?.profileImage && (
              <img 
                src={user.profileImage} 
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-primary"
              />
            )}
            <div>
              <h1 className="text-3xl font-heading font-bold text-text">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to make new connections today?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary bg-opacity-20 rounded-lg p-4 text-center">
              <FaHeart className="text-3xl text-text mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-gray-600">Matches</p>
            </div>
            <div className="bg-secondary bg-opacity-20 rounded-lg p-4 text-center">
              <FaComments className="text-3xl text-text mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-gray-600">Chats</p>
            </div>
            <div className="bg-accent bg-opacity-20 rounded-lg p-4 text-center">
              <FaCalendarAlt className="text-3xl text-text mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">0</p>
              <p className="text-sm text-gray-600">Meetups</p>
            </div>
            <div className="bg-primary bg-opacity-20 rounded-lg p-4 text-center">
              <FaStar className="text-3xl text-text mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">2</p>
              <p className="text-sm text-gray-600">Daily Stars</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/matches" className="card hover:shadow-2xl transition-all group">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaUsers className="text-3xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Find Matches
              </h3>
              <p className="text-gray-600">
                Browse profiles and start connecting
              </p>
            </div>
          </Link>

          <Link to="/chat" className="card hover:shadow-2xl transition-all group">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaComments className="text-3xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Messages
              </h3>
              <p className="text-gray-600">
                Chat with your matches
              </p>
            </div>
          </Link>

          <Link to="/meetups" className="card hover:shadow-2xl transition-all group">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaCalendarAlt className="text-3xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Plan Meetup
              </h3>
              <p className="text-gray-600">
                Schedule a safe meetup
              </p>
            </div>
          </Link>
        </div>

        {/* Safety Guidelines */}
        <div className="card bg-gradient-to-r from-accent to-secondary bg-opacity-30">
          <div className="flex items-start space-x-4">
            <FaShieldAlt className="text-4xl text-text flex-shrink-0" />
            <div>
              <h3 className="text-xl font-heading font-semibold text-text mb-2">
                Safety Guidelines
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Always use app chat - don't share personal contact initially</li>
                <li>✓ Meet in well-lit, crowded, public places</li>
                <li>✓ Use app-recommended venues when possible</li>
                <li>✓ Share meetup details with someone you trust</li>
                <li>✓ Use the SOS button if you feel unsafe</li>
                <li>✓ Remember: This is for friendships and networking, not dating</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;



