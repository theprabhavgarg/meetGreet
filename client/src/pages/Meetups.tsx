import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUser, FaStar } from 'react-icons/fa';

interface Meetup {
  _id: string;
  participants: Array<{
    _id: string;
    fullName: string;
    profileImage?: string;
  }>;
  location: {
    venue: string;
    address?: string;
    city?: string;
    isAppRecommended: boolean;
  };
  scheduledTime: Date;
  status: string;
  confirmedBy: string[];
}

const Meetups: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('scheduled');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetups();
  }, [filter]);

  const fetchMeetups = async () => {
    try {
      const response = await axios.get('/api/meetups/my-meetups', {
        params: filter !== 'all' ? { status: filter } : {}
      });
      setMeetups(response.data.meetups);
    } catch (error: any) {
      toast.error('Failed to load meetups');
    } finally {
      setLoading(false);
    }
  };

  const confirmMeetup = async (meetupId: string) => {
    try {
      await axios.post(`/api/meetups/${meetupId}/confirm`);
      toast.success('Meetup confirmed!');
      fetchMeetups();
    } catch (error: any) {
      toast.error('Failed to confirm meetup');
    }
  };

  const cancelMeetup = async (meetupId: string) => {
    if (!window.confirm('Are you sure you want to cancel this meetup?')) return;
    
    try {
      await axios.delete(`/api/meetups/${meetupId}`);
      toast.success('Meetup cancelled');
      fetchMeetups();
    } catch (error: any) {
      toast.error('Failed to cancel meetup');
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-text">My Meetups</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['all', 'scheduled', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-primary text-text'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Meetups List */}
        {meetups.length === 0 ? (
          <div className="card text-center py-12">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-text mb-2">
              No Meetups {filter !== 'all' && filter}
            </h2>
            <p className="text-gray-600">
              {filter === 'scheduled'
                ? 'Schedule a meetup with your matches!'
                : 'Your meetup history will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetups.map((meetup) => (
              <div key={meetup._id} className="card hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    {/* Participants */}
                    <div className="flex items-center space-x-3 mb-3">
                      <FaUser className="text-gray-600" />
                      <div>
                        <p className="font-semibold text-text">
                          Meeting with{' '}
                          {meetup.participants
                            .map((p) => p.fullName)
                            .join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start space-x-3 mb-2">
                      <FaMapMarkerAlt className="text-gray-600 mt-1" />
                      <div>
                        <p className="font-medium text-text">{meetup.location.venue}</p>
                        {meetup.location.address && (
                          <p className="text-sm text-gray-600">{meetup.location.address}</p>
                        )}
                        {meetup.location.isAppRecommended && (
                          <span className="inline-flex items-center text-xs bg-accent px-2 py-1 rounded-full mt-1">
                            <FaStar className="mr-1" /> Recommended Venue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center space-x-3 mb-3">
                      <FaClock className="text-gray-600" />
                      <p className="text-gray-700">
                        {new Date(meetup.scheduledTime).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        meetup.status === 'scheduled'
                          ? 'bg-primary text-text'
                          : meetup.status === 'completed'
                          ? 'bg-accent text-text'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {meetup.status.charAt(0).toUpperCase() + meetup.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  {meetup.status === 'scheduled' && (
                    <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                      {!meetup.confirmedBy.includes('currentUserId') && (
                        <button
                          onClick={() => confirmMeetup(meetup._id)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => cancelMeetup(meetup._id)}
                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safety Guidelines */}
        <div className="card mt-8 bg-accent bg-opacity-20">
          <h3 className="font-heading font-semibold text-text mb-3 flex items-center">
            🛡️ Safety Guidelines
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Always meet in public, well-lit places</li>
            <li>• Share meetup details with someone you trust</li>
            <li>• Use app-recommended venues for discounts and safety</li>
            <li>• Keep your phone charged and accessible</li>
            <li>• Use the SOS button if you feel unsafe</li>
            <li>• Trust your instincts - if something feels off, leave</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Meetups;
