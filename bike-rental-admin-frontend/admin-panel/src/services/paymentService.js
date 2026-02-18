import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Helper function to get stored token
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get paginated list of payments with optional filters
const getPayments = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/payments`, {
      ...getAuthHeader(),
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return {
      status: false,
      message: error.response?.data?.message || 'Failed to fetch payments',
      data: null
    };
  }
};

const paymentService = {
  getPayments
};

export default paymentService; 