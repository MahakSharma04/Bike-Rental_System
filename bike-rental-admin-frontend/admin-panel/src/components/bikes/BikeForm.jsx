import React, { useState, useEffect } from 'react';
import { X, Plus, Upload, Image as ImageIcon, Trash2, Loader } from 'lucide-react';
import bikeService from '../../services/bikeService';

const BikeForm = ({ bike, onClose, onSuccess }) => {
  const isEditing = !!bike;
  
  const [formData, setFormData] = useState({
    model: '',
    brand: '',
    type: '',
    description: '',
    hourly_rate: '',
    daily_rate: '',
    images: [],
    replace_images: false
  });
  
  const [bikeTypes, setBikeTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageFiles, setUploadedImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Load bike data for editing
  useEffect(() => {
    if (isEditing && bike) {
      setFormData({
        model: bike.model || '',
        brand: bike.brand || '',
        type: bike.type || '',
        description: bike.description || '',
        hourly_rate: bike.hourly_rate || '',
        daily_rate: bike.daily_rate || '',
        images: [],
        replace_images: false
      });
      
      if (bike.images && bike.images.length > 0) {
        setUploadedImages(bike.images);
      }
    }
    
    fetchBikeTypes();
  }, [bike, isEditing]);
  
  // Fetch bike types for dropdown
  const fetchBikeTypes = async () => {
    try {
      const response = await bikeService.getBikeTypes();
      if (response.status) {
        setBikeTypes(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch bike types:', err);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      // For numeric inputs, validate and format
      const formattedValue = value === '' ? '' : parseFloat(value) >= 0 ? value : '0';
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Create preview URLs for the images
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setUploadedImageFiles(prev => [...prev, ...files]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    // Clear any file input error
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };
  
  // Remove an image from the preview
  const removePreviewImage = (index) => {
    const newPreviewImages = [...previewImages];
    const newUploadedImageFiles = [...uploadedImageFiles];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewImages[index]);
    
    newPreviewImages.splice(index, 1);
    newUploadedImageFiles.splice(index, 1);
    
    setPreviewImages(newPreviewImages);
    setUploadedImageFiles(newUploadedImageFiles);
    setFormData(prev => ({
      ...prev,
      images: newUploadedImageFiles
    }));
  };
  
  // Toggle replace_images option for edits
  const handleReplaceImagesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      replace_images: e.target.checked
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model name is required';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Bike type is required';
    }
    
    if (!formData.hourly_rate) {
      newErrors.hourly_rate = 'Hourly rate is required';
    } else if (parseFloat(formData.hourly_rate) < 0) {
      newErrors.hourly_rate = 'Hourly rate cannot be negative';
    }
    
    if (!formData.daily_rate) {
      newErrors.daily_rate = 'Daily rate is required';
    } else if (parseFloat(formData.daily_rate) < 0) {
      newErrors.daily_rate = 'Daily rate cannot be negative';
    }
    
    // If no uploaded images and no existing images (for new bike)
    if (!isEditing && formData.images.length === 0 && previewImages.length === 0) {
      newErrors.images = 'At least one image is required';
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
      const submitData = {
        ...formData,
        images: uploadedImageFiles
      };
      
      let response;
      
      if (isEditing) {
        response = await bikeService.updateBike(bike.id, submitData);
      } else {
        response = await bikeService.createBike(submitData);
      }
      
      if (response.status) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        setErrors({ form: response.message || 'Failed to save bike' });
      }
    } catch (error) {
      setErrors({ 
        form: error.message || `Failed to ${isEditing ? 'update' : 'create'} bike` 
      });
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
      <div className="relative bg-white rounded-lg w-full max-w-3xl mx-auto shadow-xl z-10 overflow-y-auto max-h-[90vh]" style={{ width: "85%", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Bike' : 'Add New Bike'}
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
          
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Bike Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Bike Type</option>
                {bikeTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
                {formData.type && !bikeTypes.includes(formData.type) && (
                  <option value={formData.type}>{formData.type}</option>
                )}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>
            
            <div>
              <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                Hourly Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="hourly_rate"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`mt-1 block w-full border ${errors.hourly_rate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.hourly_rate && <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>}
            </div>
            
            <div>
              <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700">
                Daily Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="daily_rate"
                name="daily_rate"
                value={formData.daily_rate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`mt-1 block w-full border ₹{errors.daily_rate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.daily_rate && <p className="mt-1 text-sm text-red-600">{errors.daily_rate}</p>}
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              
              {isEditing && uploadedImages.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="replace_images"
                      name="replace_images"
                      checked={formData.replace_images}
                      onChange={handleReplaceImagesChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="replace_images" className="ml-2 block text-sm text-gray-900">
                      Replace existing images
                    </label>
                  </div>
                  
                  {!formData.replace_images && (
                    <div className="flex flex-wrap gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={image.startsWith('http') ? image : `http://localhost:8000/storage/${image}`} 
                            alt={`Uploaded ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload images</span>
                      <input 
                        id="images" 
                        name="images" 
                        type="file" 
                        multiple 
                        accept=".jpg,.jpeg,.png"
                        className="sr-only" 
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</p>
                </div>
              </div>
              
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
              
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Images</p>
                  <div className="flex flex-wrap gap-2">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePreviewImage(index)}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                isEditing ? 'Update Bike' : 'Create Bike'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BikeForm; 