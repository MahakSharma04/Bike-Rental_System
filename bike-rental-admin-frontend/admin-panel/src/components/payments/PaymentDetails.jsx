import React from 'react';
import { X, Calendar, CreditCard, Clock, CheckCircle, AlertCircle, XCircle, Image as ImageIcon } from 'lucide-react';

const PaymentDetails = ({ payment, onClose }) => {
  if (!payment) return null;

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

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
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
          <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 120px)" }}>
          <div className="space-y-6">
            {/* Payment Header with status */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment #{payment.id}
                  </h2>
                  <span className={`ml-2 px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1.5">{payment.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Transaction ID: {payment.transaction_id || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{parseFloat(payment.amount).toFixed(2)}</p>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-blue-50">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Payment Method</h3>
                  <p className="text-sm text-gray-700 mt-1 capitalize">
                    {payment.payment_method || 'N/A'}
                    {payment.razor_pay_id && (
                      <span className="text-gray-500 ml-2">(Razorpay ID: {payment.razor_pay_id})</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Reservation details */}
            {payment.reservation && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Reservation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reservation ID</p>
                    <p className="text-sm text-gray-900">{payment.reservation.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm text-gray-900 capitalize">{payment.reservation.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="text-sm text-gray-900">{formatDate(payment.reservation.start_datetime)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="text-sm text-gray-900">{formatDate(payment.reservation.end_datetime)}</p>
                  </div>
                </div>
                
                {/* Bike details if available */}
                {payment.reservation.bike && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Bike Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {payment.reservation.bike.images && payment.reservation.bike.images.length > 0 && (
                        <div className="md:col-span-1">
                          <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                            {getImageUrl(payment.reservation.bike.images[0]) ? (
                              <img 
                                src={getImageUrl(payment.reservation.bike.images[0])}
                                alt={`${payment.reservation.bike.brand} ${payment.reservation.bike.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className={payment.reservation.bike.images && payment.reservation.bike.images.length > 0 ? "md:col-span-2" : "md:col-span-3"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Model</p>
                            <p className="text-sm text-gray-900">{payment.reservation.bike.brand} {payment.reservation.bike.model}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <p className="text-sm text-gray-900">{payment.reservation.bike.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                            <p className="text-sm text-gray-900">₹{parseFloat(payment.reservation.bike.hourly_rate).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Daily Rate</p>
                            <p className="text-sm text-gray-900">₹{parseFloat(payment.reservation.bike.daily_rate).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* User details if available */}
                {payment.reservation.user && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-sm text-gray-900">{payment.reservation.user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{payment.reservation.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{payment.reservation.user.phone_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">License Number</p>
                        <p className="text-sm text-gray-900">{payment.reservation.user.driving_license_number || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Payment dates */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Date</p>
                  <p className="text-sm text-gray-700">
                    {formatDate(payment.payment_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created On</p>
                  <p className="text-sm text-gray-700">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
                {payment.updated_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(payment.updated_at)}
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

export default PaymentDetails; 