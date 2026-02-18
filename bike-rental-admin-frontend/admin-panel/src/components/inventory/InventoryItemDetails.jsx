import React from 'react';
import { X, Calendar, Wrench, AlertCircle } from 'lucide-react';

const InventoryItemDetails = ({ item, onClose }) => {
  if (!item) return null;
  
  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, marginLeft: 0, marginRight: 0 }}>
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full max-w-xl mx-auto shadow-xl z-10 overflow-hidden" style={{ width: "85%", maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Inventory Item Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Item basic info */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {item.plate_number}
                </h2>
                <p className="text-sm text-gray-500">
                  Serial Number: {item.serial_number}
                </p>
              </div>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            {/* Bike details */}
            {item.bike && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Bike Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Model:</span> {item.bike.model}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Brand:</span> {item.bike.brand}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Type:</span> {item.bike.type}
                  </p>
                  <div className="flex gap-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Hourly Rate:</span> ${parseFloat(item.bike.hourly_rate).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Daily Rate:</span> ${parseFloat(item.bike.daily_rate).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Maintenance info */}
            <div className="flex items-start gap-4 border-t border-gray-200 pt-4">
              <div className="rounded-full p-2 bg-blue-50">
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Maintenance Information</h3>
                <p className="text-sm text-gray-700 mt-1">
                  {item.last_maintenance_date ? (
                    <>
                      Last maintenance performed on <span className="font-medium">{new Date(item.last_maintenance_date).toLocaleDateString()}</span>
                    </>
                  ) : (
                    'No maintenance records available'
                  )}
                </p>
              </div>
            </div>
            
            {/* System info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Added on</p>
                  <p className="text-sm text-gray-700">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                {item.updated_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-700">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemDetails; 