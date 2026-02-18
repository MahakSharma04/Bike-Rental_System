import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage?.getItem('authToken')}`
  }
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common error cases
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = {
      status: error.response?.status,
      message: error.response?.data?.message || 'An error occurred',
      errors: error.response?.data?.errors,
    };
    
    return Promise.reject(errorResponse);
  }
);

// API method shortcuts
export const api = {
  get: (endpoint) => axiosInstance.get(endpoint),
  post: (endpoint, data) => axiosInstance.post(endpoint, data),
  put: (endpoint, data) => axiosInstance.put(endpoint, data),
  patch: (endpoint, data) => axiosInstance.patch(endpoint, data),
  delete: (endpoint) => axiosInstance.delete(endpoint),
  
  // Auth endpoints
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
};

export default api; 