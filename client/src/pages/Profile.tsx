import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaHeart,
  FaComments,
  FaCalendarAlt,
  FaStar,
  FaEdit
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setProfileData(response.data.user);
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
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

  const stats = [
    {
      icon: FaHeart,
      label: 'Matches',
      value: profileData?.matches?.length || 0,
      color: 'text-red-500'
    },
    {
      icon: FaComments,
      label: 'Chats',
      value: '0',
      color: 'text-blue-500'
    },
    {
      icon: FaCalendarAlt,
      label: 'Meetups',
      value: '0',
      color: 'text-green-500'
    },
    {
      icon: FaStar,
      label: 'Stars',
      value: (profileData?.dailyStars?.count || 0) + (profileData?.purchasedStars || 0),
      color: 'text-yellow-500'
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl font-heading font-bold text-text">
                {profileData?.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt={profileData.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profileData?.fullName?.charAt(0) || 'U'
                )}
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <FaEdit className="text-text" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-heading font-bold text-text mb-2">
                {profileData?.fullName || 'User'}
              </h1>
              <p className="text-gray-600 mb-1">@{profileData?.username || 'username'}</p>
              
              {profileData?.currentDesignation && (
                <div className="flex items-center justify-center md:justify-start text-gray-700 mb-2">
                  <FaBriefcase className="mr-2" />
                  <span>
                    {profileData.currentDesignation}
                    {profileData.currentOrganization && ` at ${profileData.currentOrganization}`}
                  </span>
                </div>
              )}

              {profileData?.educationInstitute && (
                <div className="flex items-center justify-center md:justify-start text-gray-700 mb-2">
                  <FaGraduationCap className="mr-2" />
                  <span>{profileData.educationInstitute}</span>
                </div>
              )}

              {profileData?.city && (
                <div className="flex items-center justify-center md:justify-start text-gray-700">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{profileData.city}</span>
                </div>
              )}

              {profileData?.bio && (
                <p className="mt-4 text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/settings')}
              className="w-full md:w-auto btn-primary"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card text-center">
                <Icon className={`text-4xl ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Verification Status */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-bold text-text mb-4">
            Verification Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Phone Verification</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profileData?.isPhoneVerified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {profileData?.isPhoneVerified ? '✓ Verified' : 'Not Verified'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Verification</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profileData?.isEmailVerified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {profileData?.isEmailVerified ? '✓ Verified' : 'Not Verified'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">LinkedIn Verification</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profileData?.isLinkedInVerified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {profileData?.isLinkedInVerified ? '✓ Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="card bg-gradient-to-r from-primary via-secondary to-accent">
          <h2 className="text-xl font-heading font-bold text-text mb-2">
            Invite Friends & Earn Rewards
          </h2>
          <p className="text-gray-700 mb-4">
            Share your referral code and earn cash + 20 stars for each friend who joins!
          </p>
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <span className="text-2xl font-heading font-bold text-text">
              {profileData?.referralCode || 'XXXXX'}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(profileData?.referralCode || '');
                toast.success('Referral code copied!');
              }}
              className="btn-primary text-sm"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
