import React from 'react';
import { 
  Wrench, 
  X, 
  Edit, 
  Calendar, 
  Check, 
  Clock, 
  Bike,
  Clipboard,
  DollarSign,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

const MaintenanceDetails = ({ 
  maintenance, 
  onClose,
  onEdit,
  onComplete,
  onDelete 
}) => {
  if (!maintenance) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    let bgColor;
    switch(status) {
      case 'completed':
        bgColor = 'bg-green-100 text-green-800';
        break;
      case 'in-progress':
        bgColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'scheduled':
        bgColor = 'bg-blue-100 text-blue-800';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status?.replace(/-/g, ' ')}
      </span>
    );
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
          <div className="flex items-center">
            <Wrench className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Maintenance Details</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 120px)" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Maintenance #{maintenance.id}
              </h2>
              <div className="mt-1">
                {getStatusBadge(maintenance.status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Cost</p>
              <p className="text-2xl font-bold text-gray-900">${parseFloat(maintenance.cost || 0).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {maintenance.maintenance_type === 'routine' ? 'Routine Service' : 'Repair'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Bike</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Bike size={16} className="mr-2 text-gray-400" />
                    <span>Bike ID: {maintenance.bike_inventory_id}</span>
                    {maintenance.bikeInventory && (
                      <span className="ml-2 text-gray-500">
                        ({maintenance.bikeInventory.plate_number || 'No plate number'})
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cost</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <span>₹{parseFloat(maintenance.cost || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created At</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>{formatDate(maintenance.created_at)}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Scheduled Date</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>{formatDate(maintenance.scheduled_date)}</span>
                  </div>
                </div>
                
                {maintenance.completion_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Completion Date</label>
                    <div className="mt-1 flex items-center text-sm text-gray-900">
                      <Check size={16} className="mr-2 text-gray-400" />
                      <span>{formatDate(maintenance.completion_date)}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span>{formatDate(maintenance.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start">
                <Clipboard size={18} className="mr-2 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {maintenance.description || 'No description provided.'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 border-t space-x-3">
          {maintenance.status !== 'completed' && (
            <button
              onClick={() => onComplete(maintenance.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Mark as Completed
            </button>
          )}
          <button
            onClick={() => onEdit(maintenance)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(maintenance.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails; 