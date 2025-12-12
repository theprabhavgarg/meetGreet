import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing on physical device
// Find your IP: Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
export const API_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // For iOS simulator
  // ? 'http://10.0.2.2:5000/api'  // For Android emulator
  // ? 'http://YOUR_IP_ADDRESS:5000/api'  // For physical device
  : 'https://your-production-api.com/api';

export const SOCKET_URL = __DEV__
  ? 'http://localhost:5000'
  : 'https://your-production-api.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Navigate to login - handled in AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;



