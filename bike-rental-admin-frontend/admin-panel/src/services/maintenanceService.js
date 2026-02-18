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

const maintenanceService = {
  // Get all maintenance records with optional filters
  getAllMaintenance: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/maintenance`, {
        ...getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to fetch maintenance records',
        data: []
      };
    }
  },

  // Get scheduled maintenance
  getScheduledMaintenance: async () => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/scheduled`, {
        ...getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled maintenance:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to fetch scheduled maintenance',
        data: []
      };
    }
  },

  // Get a single maintenance record
  getMaintenanceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/${id}`, {
        ...getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to fetch maintenance details',
        data: null
      };
    }
  },

  // Create a new maintenance record
  createMaintenance: async (maintenanceData) => {
    try {
      const response = await axios.post(`${API_URL}/maintenance`, maintenanceData, {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to create maintenance record',
        data: null
      };
    }
  },

  // Update an existing maintenance record
  updateMaintenance: async (id, maintenanceData) => {
    try {
      const response = await axios.put(`${API_URL}/maintenance/${id}`, maintenanceData, {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating maintenance with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to update maintenance record',
        data: null
      };
    }
  },

  // Complete a maintenance record
  completeMaintenance: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/maintenance/${id}/complete`, {}, {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error completing maintenance with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to complete maintenance record',
        data: null
      };
    }
  },

  // Delete a maintenance record
  deleteMaintenance: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/maintenance/${id}`, {
        ...getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting maintenance with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to delete maintenance record',
        data: null
      };
    }
  },

  // Get bike inventory for maintenance assignment
  getBikeInventory: async () => {
    try {
      const response = await axios.get(`${API_URL}/bike-inventory`, {
        ...getAuthHeader(),
        params: {
          per_page: 100 // Get a reasonable number of bikes
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bike inventory:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to fetch bike inventory',
        data: []
      };
    }
  }
};

export default maintenanceService; 