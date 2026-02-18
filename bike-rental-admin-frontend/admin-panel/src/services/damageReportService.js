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

// Get all damage reports with optional filters
const getDamageReports = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/damages`, {
      ...getAuthHeader(),
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching damage reports:', error);
    return {
      status: false,
      message: error.response?.data?.message || 'Failed to fetch damage reports',
      data: null
    };
  }
};

// Get damage report details by ID
const getDamageReportById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/damages/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error fetching damage report ${id}:`, error);
    return {
      status: false,
      message: error.response?.data?.message || 'Failed to fetch damage report details',
      data: null
    };
  }
};

// Create a new damage report
const createDamageReport = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/damages`, formData, {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating damage report:', error);
    return {
      status: false,
      message: error.response?.data?.message || 'Failed to create damage report',
      data: null
    };
  }
};

// Update an existing damage report
const updateDamageReport = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/damages/${id}`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error updating damage report ${id}:`, error);
    return {
      status: false,
      message: error.response?.data?.message || 'Failed to update damage report',
      data: null
    };
  }
};

// Upload images to an existing damage report
const uploadDamageReportImages = async (id, formData) => {
  try {
    const response = await axios.post(`${API_URL}/damages/${id}/images`, formData, {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading images for damage report ${id}:`, error);
    return {
      status: false,
      message: error.response?.data?.message || 'Failed to upload images',
      data: null
    };
  }
};

const damageReportService = {
  getDamageReports,
  getDamageReportById,
  createDamageReport,
  updateDamageReport,
  uploadDamageReportImages
};

export default damageReportService; 