import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

const getBearerToken = () => {
  const token = localStorage.getItem('authToken');
  return token ? `Bearer ${token}` : '';
};

const bikeInventoryService = {
  // Get paginated list of bike inventory items with optional filters
  getBikeInventory: async (params = {}) => {
    try {
      // Filter out empty string parameters
      const filteredParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== '') {
          filteredParams[key] = params[key];
        }
      });
      
      const response = await axios.get(`${API_URL}/bike-inventory`, {
        headers: {
          Authorization: getBearerToken()
        },
        params: filteredParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Get a specific bike inventory item
  getBikeInventoryItem: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/bike-inventory/${id}`, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Create a new bike inventory item
  createBikeInventoryItem: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/bike-inventory`, data, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Update a bike inventory item
  updateBikeInventoryItem: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/bike-inventory/${id}`, data, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Delete a bike inventory item
  deleteBikeInventoryItem: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/bike-inventory/${id}`, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Get available inventory for a specific bike
  getAvailableInventoryForBike: async (bikeId, params = {}) => {
    try {
      // Filter out empty string parameters
      const filteredParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== '') {
          filteredParams[key] = params[key];
        }
      });
      
      const response = await axios.get(`${API_URL}/bikes/${bikeId}/available-inventory`, {
        headers: {
          Authorization: getBearerToken()
        },
        params: filteredParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  }
};

export default bikeInventoryService; 