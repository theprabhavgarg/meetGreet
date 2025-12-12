import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Chat {
  id: string;
  otherUser: {
    id: string;
    fullName: string;
    profileImage?: string;
    lastActive: Date;
  };
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
  };
  content: string;
  createdAt: Date;
}

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(chatId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chats');
      setChats(response.data.chats);
    } catch (error: any) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages`);
      setMessages(response.data.messages);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Upgrade to premium to continue chatting');
      } else {
        toast.error('Failed to load messages');
      }
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      const response = await axios.post(`/api/chats/${selectedChat}/messages`, {
        content: newMessage
      });
      setMessages([...messages, response.data.message]);
      setNewMessage('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
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

  if (chats.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="card">
            <h2 className="text-2xl font-heading font-bold text-text mb-4">No Chats Yet</h2>
            <p className="text-gray-600 mb-6">
              Start matching with people to begin conversations!
            </p>
            <button
              onClick={() => navigate('/matches')}
              className="btn-primary"
            >
              Find Matches
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-180px)] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Chat List Sidebar */}
        <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200 overflow-y-auto`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-heading font-bold text-text">Messages</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? 'bg-primary bg-opacity-20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    {chat.otherUser.profileImage ? (
                      <img
                        src={chat.otherUser.profileImage}
                        alt={chat.otherUser.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-heading font-bold text-text">
                        {chat.otherUser.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-text truncate">
                        {chat.otherUser.fullName}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="bg-primary text-text text-xs font-bold px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden mr-2"
                >
                  <FaArrowLeft />
                </button>
                {chats.find(c => c.id === selectedChat)?.otherUser && (
                  <>
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-lg font-heading font-bold text-text">
                        {chats.find(c => c.id === selectedChat)?.otherUser.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">
                        {chats.find(c => c.id === selectedChat)?.otherUser.fullName}
                      </h3>
                      <p className="text-xs text-gray-600">Active</p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === chats.find(c => c.id === selectedChat)?.otherUser.id
                        ? 'justify-start'
                        : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        message.sender._id === chats.find(c => c.id === selectedChat)?.otherUser.id
                          ? 'bg-gray-200 text-text'
                          : 'bg-primary text-text'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input-field"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary px-6 disabled:opacity-50"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
