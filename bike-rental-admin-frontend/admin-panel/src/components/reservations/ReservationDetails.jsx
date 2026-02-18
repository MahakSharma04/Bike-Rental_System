import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  Bike, 
  DollarSign,
  CreditCard,
  MapPin,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';

const ReservationDetails = ({ 
  reservation, 
  onClose,
  onCancel,
  onUpdateStatus 
}) => {
  if (!reservation) return null;

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    try {
      return format(new Date(dateTimeStr), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return dateTimeStr;
    }
  };

  const getStatusBadge = (status) => {
    let bgColor;
    switch(status) {
      case 'confirmed':
        bgColor = 'bg-blue-100 text-blue-800';
        break;
      case 'completed':
        bgColor = 'bg-green-100 text-green-800';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'cancelled':
      case 'rejected':
        bgColor = 'bg-red-100 text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${bgColor}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Calculate duration in days/hours
  const calculateDuration = () => {
    const start = new Date(reservation.start_datetime);
    const end = new Date(reservation.end_datetime);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let durationText = '';
    if (diffDays > 0) {
      durationText += `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    if (diffHours > 0) {
      durationText += `${durationText ? ' ' : ''}${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
    return durationText || 'Less than 1 hour';
  };

  // Show available status updates based on current status
  const getAvailableStatusUpdates = () => {
    switch(reservation.status) {
      case 'pending':
        return [
          { value: 'confirmed', label: 'Confirm', color: 'bg-blue-600 hover:bg-blue-700' },
          { value: 'rejected', label: 'Reject', color: 'bg-red-600 hover:bg-red-700' }
        ];
      case 'confirmed':
        return [
          { value: 'completed', label: 'Mark as Completed', color: 'bg-green-600 hover:bg-green-700' }
        ];
      default:
        return [];
    }
  };

  // Get bike image URL with proper prefix if needed
  const getBikeImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (Array.isArray(imagePath) && imagePath.length > 0) {
      imagePath = imagePath[0];
    }
    return imagePath.startsWith('http') ? imagePath : `http://localhost:8000/storage/${imagePath}`;
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full mx-auto shadow-xl z-50 overflow-hidden" style={{ width: "85%", maxWidth: "800px", maxHeight: "85vh" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">Reservation Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 120px)" }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Reservation #{reservation.id}
              </h2>
              <div className="mt-1">
                {getStatusBadge(reservation.status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{parseFloat(reservation.pay_amount).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Bike Details */}
              <div className="bg-gray-50 rounded-md p-4 mb-5">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Bike className="h-5 w-5 text-gray-500 mr-2" />
                  Bike Information
                </h3>
                
                {reservation.bikeInventory && reservation.bikeInventory.bike && (
                  <div className="flex flex-col space-y-4">
                    {reservation.bikeInventory.bike.images && (
                      <div className="h-40 w-full rounded-md overflow-hidden mb-2">
                        <img 
                          src={getBikeImageUrl(reservation.bikeInventory.bike.images)} 
                          alt={reservation.bikeInventory.bike.model}
                          className="h-full w-full object-cover"
                          onError={(e) => { 
                            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image+Available'; 
                            e.target.onerror = null; 
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Model</p>
                        <p className="text-sm text-gray-900">{reservation.bikeInventory.bike.model}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Brand</p>
                        <p className="text-sm text-gray-900">{reservation.bikeInventory.bike.brand}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Type</p>
                        <p className="text-sm text-gray-900">{reservation.bikeInventory.bike.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Plate Number</p>
                        <p className="text-sm text-gray-900">{reservation.bikeInventory.plate_number}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Serial Number</p>
                      <p className="text-sm text-gray-900">{reservation.bikeInventory.serial_number}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Reservation Timeline */}
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  Reservation Timeline
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Start Date</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatDateTime(reservation.start_datetime)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">End Date</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatDateTime(reservation.end_datetime)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Duration</span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {calculateDuration()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Created</span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {formatDateTime(reservation.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Customer Information */}
              {reservation.user && (
                <div className="bg-gray-50 rounded-md p-4 mb-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    Customer Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-sm text-gray-900">{reservation.user.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{reservation.user.email}</p>
                    </div>
                    
                    {reservation.user.phone_number && (
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900">{reservation.user.phone_number}</p>
                        </div>
                      </div>
                    )}
                    
                    {reservation.user.address && (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="text-sm text-gray-900">{reservation.user.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {reservation.user.driving_license_number && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">License No.</p>
                        <p className="text-sm text-gray-900">{reservation.user.driving_license_number}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Payment Information */}
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                  Payment Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Amount</span>
                    <span className="text-sm text-gray-900 font-medium">₹{parseFloat(reservation.pay_amount).toFixed(2)}</span>
                  </div>
                  
                  {reservation.bikeInventory?.bike?.hourly_rate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Hourly Rate</span>
                      <span className="text-sm text-gray-900">₹{parseFloat(reservation.bikeInventory.bike.hourly_rate).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {reservation.bikeInventory?.bike?.daily_rate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Daily Rate</span>
                      <span className="text-sm text-gray-900">₹{parseFloat(reservation.bikeInventory.bike.daily_rate).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t space-x-3">
          {/* Status Update Buttons */}
          {getAvailableStatusUpdates().map(status => (
            <button
              key={status.value}
              onClick={() => onUpdateStatus(reservation.id, status.value)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${status.color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {status.label}
            </button>
          ))}
          
          {/* Cancel Button */}
          {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Reservation
            </button>
          )}
          
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

export default ReservationDetails; 