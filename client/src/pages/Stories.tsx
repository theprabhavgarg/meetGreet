import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import { FaHeart, FaComment, FaShare, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

interface Story {
  _id: string;
  author: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  content: string;
  images: string[];
  likes: string[];
  comments: Array<{
    user: {
      _id: string;
      fullName: string;
    };
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoryContent, setNewStoryContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories/feed');
      setStories(response.data.stories);
    } catch (error: any) {
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const likeStory = async (storyId: string) => {
    try {
      await axios.post(`/api/stories/${storyId}/like`);
      // Update local state
      setStories(stories.map(story => {
        if (story._id === storyId) {
          const isLiked = story.likes.includes(user?.id || '');
          return {
            ...story,
            likes: isLiked
              ? story.likes.filter(id => id !== user?.id)
              : [...story.likes, user?.id || '']
          };
        }
        return story;
      }));
    } catch (error: any) {
      toast.error('Failed to like story');
    }
  };

  const createStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryContent.trim()) return;

    try {
      await axios.post('/api/stories', { content: newStoryContent });
      toast.success('Story posted!');
      setNewStoryContent('');
      setShowCreateModal(false);
      fetchStories();
    } catch (error: any) {
      toast.error('Failed to post story');
    }
  };

  const shareStory = (storyId: string) => {
    toast.success('Share feature coming soon! You\'ll earn bonus stars for sharing.');
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
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-text">Story Wall</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Share Story</span>
          </button>
        </div>

        {/* Create Story Modal */}
        {showCreateModal && (
          <div className="card mb-6 animate-fade-in">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">
              Share Your Experience
            </h3>
            <form onSubmit={createStory}>
              <textarea
                value={newStoryContent}
                onChange={(e) => setNewStoryContent(e.target.value)}
                placeholder="Share your meetup experience, thoughts, or updates..."
                className="input-field h-32 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                  {newStoryContent.length}/1000
                </span>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewStoryContent('');
                    }}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newStoryContent.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    Post Story
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Stories Feed */}
        {stories.length === 0 ? (
          <div className="card text-center py-12">
            <h2 className="text-2xl font-heading font-bold text-text mb-2">No Stories Yet</h2>
            <p className="text-gray-600 mb-6">
              Be the first to share your experience!
            </p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Share Your Story
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div key={story._id} className="card">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    {story.author.profileImage ? (
                      <img
                        src={story.author.profileImage}
                        alt={story.author.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-heading font-bold text-text">
                        {story.author.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{story.author.fullName}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(story.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
                  {story.content}
                </p>

                {/* Images (if any) */}
                {story.images && story.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {story.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Story"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => likeStory(story._id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      story.likes.includes(user?.id || '')
                        ? 'text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <FaHeart />
                    <span>{story.likes.length}</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                    <FaComment />
                    <span>{story.comments.length}</span>
                  </button>

                  <button
                    onClick={() => shareStory(story._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-accent transition-colors"
                  >
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments */}
                {story.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {story.comments.slice(0, 3).map((comment, idx) => (
                      <div key={idx} className="flex space-x-2">
                        <span className="font-semibold text-text text-sm">
                          {comment.user.fullName}:
                        </span>
                        <span className="text-gray-700 text-sm">{comment.text}</span>
                      </div>
                    ))}
                    {story.comments.length > 3 && (
                      <button className="text-sm text-gray-600 hover:text-primary">
                        View all {story.comments.length} comments
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="card mt-6 bg-primary bg-opacity-20">
          <h3 className="font-heading font-semibold text-text mb-2">✨ Earn Rewards</h3>
          <p className="text-sm text-gray-700">
            Share your stories on LinkedIn or social media to earn bonus stars and increase your visibility!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Stories;
