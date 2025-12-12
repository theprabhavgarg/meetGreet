import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';

const ProfileSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const handleSkipForNow = async () => {
    setLoading(true);
    try {
      // Mark profile as complete with minimal data
      await axios.put('/api/users/complete-profile', {
        dateOfBirth: '1990-01-01',
        gender: 'prefer-not-to-say',
        city: 'Not specified',
        educationLevel: 'other',
        educationInstitute: 'Not specified',
        currentOrganization: 'Not specified',
        currentDesignation: 'Not specified',
        bio: 'Getting started on MeetUp Network',
        primaryObjective: 'networking'
      });

      // Update user context
      if (user) {
        updateUser({ ...user, isProfileComplete: true });
      }

      toast.success('Welcome to MeetUp Network!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              Welcome to MeetUp Network!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. To get the most out of the platform, 
              we recommend completing your profile with detailed information.
            </p>
          </div>

          <div className="bg-canvas p-6 rounded-lg mb-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">
              Complete Profile Setup (Recommended)
            </h3>
            <ul className="text-left space-y-2 mb-4 text-gray-700">
              <li>✓ Upload profile picture</li>
              <li>✓ Add professional details</li>
              <li>✓ Complete personality assessment</li>
              <li>✓ Set location preferences</li>
              <li>✓ Verify phone, email & LinkedIn</li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              Note: Full profile setup will be available in the Settings page after you explore the app.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSkipForNow}
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Continue to Dashboard'}
            </button>

            <p className="text-sm text-gray-600">
              You can complete your profile anytime from Settings
            </p>
          </div>

          <div className="mt-8 p-4 bg-accent bg-opacity-30 rounded-lg">
            <p className="text-sm text-text">
              <strong>Safety First:</strong> MeetUp Network is for genuine friendships and 
              professional networking, not dating. Always meet in public places and use our 
              safety features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

