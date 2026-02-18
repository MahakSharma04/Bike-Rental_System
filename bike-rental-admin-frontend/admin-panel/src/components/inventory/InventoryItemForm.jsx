import React, { useState, useEffect } from 'react';
import { X, Loader, Calendar } from 'lucide-react';
import bikeService from '../../services/bikeService';
import bikeInventoryService from '../../services/bikeInventoryService';

const InventoryItemForm = ({ item, onClose, onSuccess }) => {
  const isEditing = !!item;
  
  const [formData, setFormData] = useState({
    bike_id: '',
    plate_number: '',
    serial_number: '',
    status: 'available',
    last_maintenance_date: ''
  });
  
  const [bikes, setBikes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Load bike data for editing
  useEffect(() => {
    if (isEditing && item) {
      setFormData({
        bike_id: item.bike_id.toString(),
        plate_number: item.plate_number || '',
        serial_number: item.serial_number || '',
        status: item.status || 'available',
        last_maintenance_date: item.last_maintenance_date || ''
      });
    }
    
    fetchBikes();
  }, [item, isEditing]);
  
  // Fetch bikes for dropdown
  const fetchBikes = async () => {
    try {
      const response = await bikeService.getBikes({ per_page: 100 });
      if (response.status) {
        setBikes(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bikes:', err);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bike_id) {
      newErrors.bike_id = 'Bike model is required';
    }
    
    if (!formData.plate_number.trim()) {
      newErrors.plate_number = 'Plate number is required';
    }
    
    if (!formData.serial_number.trim()) {
      newErrors.serial_number = 'Serial number is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (isEditing) {
        response = await bikeInventoryService.updateBikeInventoryItem(item.id, formData);
      } else {
        response = await bikeInventoryService.createBikeInventoryItem(formData);
      }
      
      if (response.status) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        if (response.errors) {
          // Handle specific validation errors from the API
          const apiErrors = {};
          
          // Process each field's errors
          Object.keys(response.errors).forEach(field => {
            apiErrors[field] = response.errors[field][0]; // Get the first error message for each field
          });
          
          setErrors(apiErrors);
        } else {
          setErrors({ form: response.message || 'Failed to save inventory item' });
        }
      }
    } catch (error) {
      if (error.errors) {
        // Handle validation errors from the server
        const apiErrors = {};
        
        // Process each field's errors
        Object.keys(error.errors).forEach(field => {
          apiErrors[field] = error.errors[field][0]; // Get the first error message for each field
        });
        
        setErrors(apiErrors);
      } else if (error.message && typeof error.message === 'object') {
        setErrors({ ...error.message });
      } else {
        setErrors({ 
          form: error.message || `Failed to ${isEditing ? 'update' : 'create'} inventory item` 
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, marginLeft: 0, marginRight: 0 }}>
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-auto shadow-xl z-10 overflow-y-auto max-h-[90vh]" style={{ width: "85%", maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{errors.form}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="bike_id" className="block text-sm font-medium text-gray-700">
                Bike Model <span className="text-red-500">*</span>
              </label>
              <select
                id="bike_id"
                name="bike_id"
                value={formData.bike_id}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.bike_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Bike Model</option>
                {bikes.map((bike) => (
                  <option key={bike.id} value={bike.id}>
                    {bike.brand} {bike.model}
                  </option>
                ))}
              </select>
              {errors.bike_id && <p className="mt-1 text-sm text-red-600">{errors.bike_id}</p>}
            </div>
            
            <div>
              <label htmlFor="plate_number" className="block text-sm font-medium text-gray-700">
                Plate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="plate_number"
                name="plate_number"
                value={formData.plate_number}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.plate_number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="e.g. MTB-001"
              />
              {errors.plate_number && <p className="mt-1 text-sm text-red-600">{errors.plate_number}</p>}
            </div>
            
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="serial_number"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.serial_number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="e.g. TK1234567"
              />
              {errors.serial_number && <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>}
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="damaged">Damaged</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>
            
            <div>
              <label htmlFor="last_maintenance_date" className="block text-sm font-medium text-gray-700">
                Last Maintenance Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="last_maintenance_date"
                  name="last_maintenance_date"
                  value={formData.last_maintenance_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="inline-block animate-spin h-4 w-4 mr-2" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Item' : 'Create Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryItemForm; 