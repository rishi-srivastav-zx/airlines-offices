import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with cookies
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Adding token to request:', token.substring(0, 20) + '...');
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.error('Unauthorized - token may be expired');
    }
    return Promise.reject(error);
  }
);

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      // Since there's no /me endpoint, we'll get all users and find current user
      const response = await api.get('/api/users');
      const users = response.data;
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUser = users.find(user => user.email === storedUser.email);
      return currentUser;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Get full image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${API_BASE_URL}${imagePath}`;
  },

  // Update user profile
  updateProfile: async (userId, userData, imageFile = null) => {
    try {
      console.log('Updating profile for userId:', userId);
      console.log('UserData:', userData);
      console.log('ImageFile:', imageFile);
      
      // Get token directly like in login page
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const formData = new FormData();
      
      // Add text fields
      if (userData.name) formData.append('name', userData.name);
      if (userData.role) formData.append('role', userData.role);
      if (userData.password) formData.append('password', userData.password);
      
      // Add image file if provided
      if (imageFile) {
        formData.append('avatar', imageFile);
      }

      console.log('Sending FormData to:', `/api/users/${userId}`);
      
      // Use axios directly with same config as login page
      const response = await axios.put(
        `${API_BASE_URL}/api/users/${userId}`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check if image exists at URL
  checkImageExists: async (imageUrl) => {
    if (!imageUrl) return false;
    
    try {
      // Construct full URL with backend base URL
      const fullImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `${API_BASE_URL}${imageUrl}`;
      
      console.log('Checking image at:', fullImageUrl);
      const response = await api.head(fullImageUrl);
      return response.status === 200;
    } catch (error) {
      console.error('Error checking image:', error);
      return false;
    }
  },
};

export default api;