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

const reservationService = {
  // Get paginated list of reservations with optional filters
  getReservations: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/reservations`, {
        ...getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to fetch reservations',
        data: []
      };
    }
  },

  // Get a specific reservation by ID
  getReservationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`, {
        ...getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to fetch reservation details',
        data: null
      };
    }
  },

  // Update the status of a reservation (Admin only)
  updateReservationStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/reservations/${id}/status`, 
        { status }, 
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation status for ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to update reservation status',
        data: null
      };
    }
  },

  // Update reservation details
  updateReservation: async (id, reservationData) => {
    try {
      const response = await axios.put(
        `${API_URL}/reservations/${id}`, 
        reservationData, 
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to update reservation',
        data: null
      };
    }
  },

  // Cancel a reservation
  cancelReservation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/reservations/${id}`, {
        ...getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling reservation with ID ${id}:`, error);
      return {
        status: false,
        message: error.response?.data?.message || 'Failed to cancel reservation',
        data: null
      };
    }
  }
};

export default reservationService; 