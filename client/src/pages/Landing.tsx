import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShieldAlt, FaStar, FaHandshake } from 'react-icons/fa';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-text mb-6">
              Connect Beyond <span className="text-primary">Boundaries</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Find meaningful connections, professional networks, and friends for casual hangouts. 
              Not a dating app - it's about genuine friendships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-4 text-center"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-text font-semibold py-4 px-8 rounded-lg border-2 border-primary hover:bg-primary transition-all duration-200 shadow-md text-lg text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold text-center text-text mb-12">
            Why MeetUp Network?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-4xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">100% Verified</h3>
              <p className="text-gray-600">
                Triple verification via Mobile OTP, Email, and LinkedIn ensures authentic profiles only.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-4xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Advanced algorithm matches you based on location, interests, and professional goals.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-4xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Safe Meetups</h3>
              <p className="text-gray-600">
                Meet at verified venues with SOS support. Safety guidelines at every step.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-4xl text-text" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Real Connections</h3>
              <p className="text-gray-600">
                For networking, knowledge sharing, and genuine friendships - not dating.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-canvas">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold text-center text-text mb-12">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-heading font-bold text-text">1</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-600">
                  Sign up with verified credentials. Complete your profile with professional details and interests.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-heading font-bold text-text">2</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Get Matched</h3>
                <p className="text-gray-600">
                  Browse verified profiles matched based on your preferences, location, and interests.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-heading font-bold text-text">3</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Connect & Meet</h3>
                <p className="text-gray-600">
                  Chat with matches, plan meetups at recommended venues, and build genuine connections.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-heading font-bold text-text">4</span>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Share Experiences</h3>
                <p className="text-gray-600">
                  Post stories, rate your meetups, and help build a trustworthy community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold text-text mb-6">
            Ready to Make New Friends?
          </h2>
          <p className="text-xl text-text mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and young adults building meaningful connections.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-text font-semibold py-4 px-10 rounded-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Join Now - It's Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-text text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 MeetUp Network. All rights reserved.</p>
          <p className="mt-2 text-sm">Built for genuine connections, not dating.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;



