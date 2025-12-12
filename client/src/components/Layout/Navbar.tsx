import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, FaHeart, FaComments, FaCalendarAlt, 
  FaImages, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Home' },
    { path: '/matches', icon: FaHeart, label: 'Matches' },
    { path: '/chat', icon: FaComments, label: 'Chat' },
    { path: '/meetups', icon: FaCalendarAlt, label: 'Meetups' },
    { path: '/stories', icon: FaImages, label: 'Stories' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-text">M</span>
            </div>
            <span className="text-2xl font-heading font-bold text-text">MeetUp</span>
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-text' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <FaUser className="text-text" />
                </div>
              )}
              <span className="font-medium text-text">{user?.fullName}</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaCog className="text-xl text-gray-600" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt className="text-xl text-red-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xl font-heading font-bold text-text">M</span>
            </div>
            <span className="text-xl font-heading font-bold text-text">MeetUp</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-2xl text-text" />
            ) : (
              <FaBars className="text-2xl text-text" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t border-gray-200 animate-slide-in">
            <div className="px-4 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                      isActive 
                        ? 'bg-primary text-text' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-100"
              >
                <FaUser className="text-xl" />
                <span className="font-medium">Profile</span>
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-100"
              >
                <FaCog className="text-xl" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-red-500 hover:bg-red-50 w-full"
              >
                <FaSignOutAlt className="text-xl" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Tab Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                  isActive ? 'text-text' : 'text-gray-400'
                }`}
              >
                <Icon className="text-2xl mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;



