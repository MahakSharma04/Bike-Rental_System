import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, Calendar } from 'lucide-react';

const MaintenanceForm = ({ 
  maintenance, 
  onSubmit, 
  onClose, 
  loading,
  bikeInventories = [] 
}) => {
  const isEditing = !!maintenance?.id;
  
  const [formData, setFormData] = useState({
    bike_inventory_id: '',
    maintenance_type: 'routine',
    description: '',
    cost: '',
    scheduled_date: '',
    status: 'scheduled'
  });

  // Initialize form with maintenance data if editing
  useEffect(() => {
    if (maintenance) {
      setFormData({
        bike_inventory_id: maintenance.bike_inventory_id || '',
        maintenance_type: maintenance.maintenance_type || 'routine',
        description: maintenance.description || '',
        cost: maintenance.cost || '',
        scheduled_date: maintenance.scheduled_date || '',
        status: maintenance.status || 'scheduled'
      });
    }
  }, [maintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.bike_inventory_id) {
      toast.error('Please select a bike');
      return;
    }
    
    if (!formData.scheduled_date) {
      toast.error('Please provide a scheduled date');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center">
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full mx-auto shadow-xl z-10 overflow-hidden" style={{ width: "85%", maxWidth: "800px", maxHeight: "85vh" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Maintenance Record' : 'Create New Maintenance Record'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 120px)" }}>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Bike Select */}
              <div>
                <label htmlFor="bike_inventory_id" className="block text-sm font-medium text-gray-700">
                  Bike *
                </label>
                <select
                  id="bike_inventory_id"
                  name="bike_inventory_id"
                  value={formData.bike_inventory_id}
                  onChange={handleChange}
                  disabled={isEditing || loading}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a bike</option>
                  {bikeInventories.map((bike) => (
                    <option key={bike.id} value={bike.id}>
                      {bike.plate_number} - {bike.bike?.model || 'Unknown Model'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Maintenance Type */}
              <div>
                <label htmlFor="maintenance_type" className="block text-sm font-medium text-gray-700">
                  Maintenance Type *
                </label>
                <select
                  id="maintenance_type"
                  name="maintenance_type"
                  value={formData.maintenance_type}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="routine">Routine</option>
                  <option value="repair">Repair</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Cost */}
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                  Cost (₹)
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  disabled={loading}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Scheduled Date */}
              <div>
                <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
                  Scheduled Date *
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="scheduled_date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm; 