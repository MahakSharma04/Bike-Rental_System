import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  User, 
  Truck, 
  DollarSign,
  Clock,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

const DamageReportDetails = ({ report, onClose }) => {
  if (!report) return null;

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get severity badge color
  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'reported':
        return 'bg-blue-100 text-blue-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'repair scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'repaired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'reported':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'under review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'repair scheduled':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'repaired':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `http://localhost:8000/storage/${imagePath}`;
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, marginLeft: 0, marginRight: 0 }}>
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full mx-auto shadow-xl z-10 overflow-hidden" style={{ width: "85%", maxWidth: "800px", maxHeight: "85vh", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">Damage Report Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 120px)" }}>
          <div className="space-y-6">
            {/* Report Header with severity and status */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Damage Report #{report.id}
                  </h2>
                  <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${getSeverityBadgeClass(report.severity)}`}>
                    {report.severity} damage
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Reported on {formatDate(report.created_at)}
                </div>
              </div>
              <div className="text-right">
                <span className={`ml-2 px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}>
                  {getStatusIcon(report.status)}
                  <span className="ml-1.5">{report.status}</span>
                </span>
                {report.additional_charges && parseFloat(report.additional_charges) > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    Additional charges: <span className="font-semibold">${parseFloat(report.additional_charges).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Damage Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Damage Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {report.description || 'No description provided'}
              </p>
            </div>
            
            {/* Damage Images */}
            {report.images && report.images.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Damage Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {report.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100 relative">
                      {getImageUrl(image) ? (
                        <img 
                          src={getImageUrl(image)}
                          alt={`Damage photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Bike Details */}
            {report.bikeInventory && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Bike Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bike Inventory ID</p>
                    <p className="text-sm text-gray-900">#{report.bike_inventory_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plate Number</p>
                    <p className="text-sm text-gray-900">{report.bikeInventory.plate_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Serial Number</p>
                    <p className="text-sm text-gray-900">{report.bikeInventory.serial_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm text-gray-900 capitalize">{report.bikeInventory.status || 'N/A'}</p>
                  </div>
                  
                  {/* Bike model information if available */}
                  {report.bikeInventory.bike && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Model</p>
                        <p className="text-sm text-gray-900">
                          {report.bikeInventory.bike.brand} {report.bikeInventory.bike.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Type</p>
                        <p className="text-sm text-gray-900">{report.bikeInventory.bike.type}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Reservation details if available */}
            {report.reservation && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Reservation Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reservation ID</p>
                    <p className="text-sm text-gray-900">#{report.reservation.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm text-gray-900 capitalize">{report.reservation.status}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reporter information */}
            {report.reporter && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Reported By</h3>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-gray-200">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.reporter.name}</p>
                    <p className="text-sm text-gray-500">{report.reporter.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Dates information */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created On</p>
                  <p className="text-sm text-gray-700">
                    {formatDate(report.created_at)}
                  </p>
                </div>
                {report.updated_at && report.updated_at !== report.created_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(report.updated_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 border-t">
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

export default DamageReportDetails; 