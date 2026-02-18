import React, { useState } from 'react';
import { X } from 'lucide-react';

const DamageReportForm = ({ report, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    description: report?.description || '',
    severity: report?.severity || 'minor',
    status: report?.status || 'reported',
    additional_charges: report?.additional_charges || '0'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.additional_charges && (isNaN(parseFloat(formData.additional_charges)) || parseFloat(formData.additional_charges) < 0)) {
      newErrors.additional_charges = 'Additional charges must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format data for API
      const dataToSubmit = {
        ...formData,
        additional_charges: parseFloat(formData.additional_charges).toFixed(2)
      };
      
      onSubmit(dataToSubmit);
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, marginLeft: 0, marginRight: 0 }}>
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full mx-auto shadow-xl z-10 overflow-hidden" style={{ width: "85%", maxWidth: "600px", maxHeight: "85vh", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">Update Damage Report</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 180px)" }}>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-300' : ''}`}
                    placeholder="Describe the damage in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
              
              {/* Severity */}
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                  Severity
                </label>
                <div className="mt-1">
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${errors.severity ? 'border-red-300' : ''}`}
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                  {errors.severity && (
                    <p className="mt-1 text-sm text-red-600">{errors.severity}</p>
                  )}
                </div>
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${errors.status ? 'border-red-300' : ''}`}
                  >
                    <option value="reported">Reported</option>
                    <option value="under review">Under Review</option>
                    <option value="repair scheduled">Repair Scheduled</option>
                    <option value="repaired">Repaired</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>
              </div>
              
              {/* Additional Charges */}
              <div>
                <label htmlFor="additional_charges" className="block text-sm font-medium text-gray-700">
                  Additional Charges (₹)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="additional_charges"
                    name="additional_charges"
                    value={formData.additional_charges}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.additional_charges ? 'border-red-300' : ''}`}
                    placeholder="0.00"
                  />
                  {errors.additional_charges && (
                    <p className="mt-1 text-sm text-red-600">{errors.additional_charges}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamageReportForm; 