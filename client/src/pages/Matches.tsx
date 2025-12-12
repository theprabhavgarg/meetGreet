import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import { FaHeart, FaTimes, FaStar, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

interface MatchUser {
  _id: string;
  fullName: string;
  profileImage?: string;
  age?: number;
  city?: string;
  currentDesignation?: string;
  currentOrganization?: string;
  bio?: string;
  compatibilityScore?: number;
}

const Matches: React.FC = () => {
  const [potentialMatches, setPotentialMatches] = useState<MatchUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('/api/matches/potential');
      setPotentialMatches(response.data.matches);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= potentialMatches.length) return;
    
    setSwipeDirection(direction);
    
    setTimeout(async () => {
      const currentUser = potentialMatches[currentIndex];
      
      try {
        if (direction === 'right') {
          const response = await axios.post(`/api/matches/swipe-right/${currentUser._id}`);
          if (response.data.isMatch) {
            toast.success(`It's a match with ${currentUser.fullName}! 🎉`);
          } else {
            toast.success('Interest sent!');
          }
        } else {
          await axios.post(`/api/matches/swipe-left/${currentUser._id}`);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to process swipe');
      }
      
      setSwipeDirection(null);
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const handleSuperPush = async () => {
    if (currentIndex >= potentialMatches.length) return;
    
    const currentUser = potentialMatches[currentIndex];
    
    try {
      const response = await axios.post(`/api/matches/super-push/${currentUser._id}`);
      if (response.data.isMatch) {
        toast.success(`It's a match with ${currentUser.fullName}! ⭐`);
      } else {
        toast.success('Super push sent!');
      }
      setCurrentIndex(currentIndex + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'No stars available');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="card">
            <h2 className="text-2xl font-heading font-bold text-text mb-4">
              No More Matches
            </h2>
            <p className="text-gray-600 mb-6">
              You've seen all available matches. Check back later for new connections!
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                fetchMatches();
              }}
              className="btn-primary"
            >
              Refresh Matches
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentMatch = potentialMatches[currentIndex];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Find Your Match</h1>
          <p className="text-gray-600">
            {potentialMatches.length - currentIndex} profile{potentialMatches.length - currentIndex !== 1 ? 's' : ''} available
          </p>
        </div>
        
        {/* Swipeable Match Card */}
        <div className="relative h-[600px] mb-8">
          <div 
            className={`absolute inset-0 ${
              swipeDirection === 'left' ? 'swipe-left' : 
              swipeDirection === 'right' ? 'swipe-right' : ''
            }`}
          >
            {/* Main Card */}
            <div className="card h-full flex flex-col overflow-hidden shadow-2xl">
              {/* Large Profile Image Section */}
              <div className="relative h-3/5 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center overflow-hidden">
                {currentMatch.profileImage ? (
                  <img 
                    src={currentMatch.profileImage} 
                    alt={currentMatch.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-8xl text-white font-heading font-bold">
                    {currentMatch.fullName.charAt(0)}
                  </div>
                )}
                
                {/* Overlay Gradient for text readability */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Name and Age on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-4xl font-heading font-bold drop-shadow-lg">
                    {currentMatch.fullName}
                    {currentMatch.age && (
                      <span className="text-3xl ml-2">{currentMatch.age}</span>
                    )}
                  </h2>
                </div>

                {/* Compatibility Badge */}
                {currentMatch.compatibilityScore && (
                  <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-text">
                      {currentMatch.compatibilityScore}% Match
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Details Section */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Designation & Company */}
                {currentMatch.currentDesignation && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-start space-x-3">
                      <FaBriefcase className="text-2xl text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xl font-semibold text-text">
                          {currentMatch.currentDesignation}
                        </p>
                        {currentMatch.currentOrganization && (
                          <p className="text-gray-600 mt-1">
                            at {currentMatch.currentOrganization}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}
                {currentMatch.city && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-2xl text-secondary flex-shrink-0" />
                      <p className="text-lg text-gray-700">{currentMatch.city}</p>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {currentMatch.bio && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {currentMatch.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons - Large and Prominent */}
              <div className="p-6 bg-canvas border-t border-gray-200">
                <div className="flex justify-center items-center space-x-6">
                  {/* Decline Button */}
                  <button
                    onClick={() => handleSwipe('left')}
                    className="group relative"
                  >
                    <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-red-100">
                      <FaTimes className="text-4xl text-red-500 group-hover:rotate-12 transition-transform" />
                    </div>
                    <p className="text-center text-sm font-medium text-gray-600 mt-2">Pass</p>
                  </button>

                  {/* Super Push Button */}
                  <button
                    onClick={handleSuperPush}
                    className="group relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-yellow-200">
                      <FaStar className="text-5xl text-text group-hover:rotate-180 transition-transform duration-300" />
                    </div>
                    <p className="text-center text-sm font-medium text-gray-600 mt-2">Super Push</p>
                  </button>

                  {/* Like Button */}
                  <button
                    onClick={() => handleSwipe('right')}
                    className="group relative"
                  >
                    <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-green-100">
                      <FaHeart className="text-4xl text-green-500 group-hover:scale-125 transition-transform" />
                    </div>
                    <p className="text-center text-sm font-medium text-gray-600 mt-2">Like</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center py-4 bg-red-50">
            <FaTimes className="text-3xl text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Swipe Left to Pass</p>
          </div>
          <div className="card text-center py-4 bg-yellow-50">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Super Push Star</p>
            <p className="text-xs text-gray-600">2 free daily</p>
          </div>
          <div className="card text-center py-4 bg-green-50">
            <FaHeart className="text-3xl text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Swipe Right to Like</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="card bg-gradient-to-r from-accent via-primary to-secondary bg-opacity-30">
          <p className="text-center text-text">
            <strong>💡 Pro Tip:</strong> Complete your profile and verify all details for better matches!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Matches;
