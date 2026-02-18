import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.status) {
        localStorage.setItem('authToken', response.data.data.access_token);
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },
  
  logout: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },
  
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${API_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },
  
  updateUserProfile: async (userData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${API_URL}/auth/user`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },
  
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  },
  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

export default authService; 