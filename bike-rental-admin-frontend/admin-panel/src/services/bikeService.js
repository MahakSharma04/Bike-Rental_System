import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

const getBearerToken = () => {
  const token = localStorage.getItem('authToken');
  return token ? `Bearer ${token}` : '';
};

const bikeService = {
  // Get paginated list of bikes with optional filters
  getBikes: async (params = {}) => {
    try {
      // Filter out empty string parameters
      const filteredParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== '') {
          filteredParams[key] = params[key];
        }
      });
      
      const response = await axios.get(`${API_URL}/bikes`, {
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

  // Get available bikes for a time period
  getAvailableBikes: async (params) => {
    try {
      // Filter out empty string parameters
      const filteredParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== '') {
          filteredParams[key] = params[key];
        }
      });
      
      const response = await axios.get(`${API_URL}/bikes/available`, {
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

  // Get all unique bike types
  getBikeTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/bikes/types`, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Get details of a specific bike
  getBikeDetails: async (bikeId) => {
    try {
      const response = await axios.get(`${API_URL}/bikes/${bikeId}`, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Create a new bike
  createBike: async (bikeData) => {
    try {
      const formData = new FormData();
      
      // Append basic bike data
      Object.keys(bikeData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, bikeData[key]);
        }
      });
      
      // Append images if present
      if (bikeData.images && bikeData.images.length > 0) {
        bikeData.images.forEach(image => {
          formData.append('images[]', image);
        });
      }
      
      const response = await axios.post(`${API_URL}/bikes`, formData, {
        headers: {
          Authorization: getBearerToken(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Update an existing bike
  updateBike: async (bikeId, bikeData) => {
    try {
      const formData = new FormData();
      
      // Append basic bike data
      Object.keys(bikeData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, bikeData[key]);
        }
      });
      
      // Append images if present
      if (bikeData.images && bikeData.images.length > 0) {
        bikeData.images.forEach(image => {
          formData.append('images[]', image);
        });
      }
      
      // Method PUT needs to be simulated with _method since FormData is always POST
      formData.append('_method', 'PUT');
      
      const response = await axios.post(`${API_URL}/bikes/${bikeId}`, formData, {
        headers: {
          Authorization: getBearerToken(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Delete a bike
  deleteBike: async (bikeId) => {
    try {
      const response = await axios.delete(`${API_URL}/bikes/${bikeId}`, {
        headers: {
          Authorization: getBearerToken()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  },

  // Upload additional images to a bike
  uploadBikeImages: async (bikeId, images) => {
    try {
      const formData = new FormData();
      
      images.forEach(image => {
        formData.append('images[]', image);
      });
      
      const response = await axios.post(`${API_URL}/bikes/${bikeId}/images`, formData, {
        headers: {
          Authorization: getBearerToken(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { status: false, message: 'Network error occurred' };
    }
  }
};

export default bikeService; 