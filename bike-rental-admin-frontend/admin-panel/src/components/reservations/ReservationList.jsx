import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  X,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import ConfirmDialog from '../common/ConfirmDialog';

const ReservationList = ({ 
  reservations = [], 
  loading = false, 
  onViewReservation,
  onUpdateStatus,
  onCancelReservation
}) => {
  const [sortField, setSortField] = useState('start_datetime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    bike_id: '',
    start_date: '',
    end_date: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');

  // Format bike display info
  const formatBikeInfo = (reservation) => {
    if (reservation.bikeInventory) {
      if (reservation.bikeInventory.bike) {
        return {
          display: `${reservation.bikeInventory.bike.brand} ${reservation.bikeInventory.bike.model}`,
          plate: reservation.bikeInventory.plate_number
        };
      }
      return {
        display: `Bike #${reservation.bikeInventory.id}`,
        plate: reservation.bikeInventory.plate_number
      };
    }
    
    if (reservation.bike_inventory_id) {
      return {
        display: `Bike ID: ${reservation.bike_inventory_id}`,
        plate: ''
      };
    }
    
    return {
      display: 'Unknown Bike',
      plate: ''
    };
  };

  // Get sorted and filtered reservations
  const getFilteredAndSortedReservations = () => {
    if (!reservations.length) return [];
    
    // Filter by search term
    let filtered = reservations;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.id.toString().includes(term) ||
        (res.bikeInventory?.plate_number && res.bikeInventory.plate_number.toLowerCase().includes(term)) ||
        (res.bikeInventory?.bike?.model && res.bikeInventory.bike.model.toLowerCase().includes(term)) ||
        (res.bikeInventory?.bike?.brand && res.bikeInventory.bike.brand.toLowerCase().includes(term))
      );
    }
    
    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(res => res.status === filters.status);
    }
    
    if (filters.bike_id) {
      filtered = filtered.filter(res => res.bikeInventory?.bike_id === parseInt(filters.bike_id));
    }
    
    if (filters.start_date) {
      filtered = filtered.filter(res => {
        const startDate = new Date(res.start_datetime);
        const filterDate = new Date(filters.start_date);
        return startDate >= filterDate;
      });
    }
    
    if (filters.end_date) {
      filtered = filtered.filter(res => {
        const endDate = new Date(res.end_datetime);
        const filterDate = new Date(filters.end_date);
        return endDate <= filterDate;
      });
    }
    
    // Sort the results
    return [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      // Handle dates
      if (sortField === 'start_datetime' || sortField === 'end_datetime' || sortField === 'created_at') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      
      // Handle numbers
      if (sortField === 'pay_amount') {
        valA = parseFloat(valA || 0);
        valB = parseFloat(valB || 0);
      }
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  const filteredReservations = getFilteredAndSortedReservations();

  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      bike_id: '',
      start_date: '',
      end_date: ''
    });
    setSearchTerm('');
  };

  // Handle cancel reservation
  const handleCancelClick = (id, e) => {
    e.stopPropagation();
    setSelectedReservationId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    onCancelReservation(selectedReservationId);
    setShowCancelModal(false);
    setSelectedReservationId(null);
  };

  // Handle status update
  const handleStatusUpdateClick = (id, status, e) => {
    e.stopPropagation();
    setSelectedReservationId(id);
    setStatusToUpdate(status);
    setShowUpdateStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    onUpdateStatus(selectedReservationId, statusToUpdate);
    setShowUpdateStatusModal(false);
    setSelectedReservationId(null);
    setStatusToUpdate('');
  };

  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    try {
      return format(new Date(dateTimeStr), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return dateTimeStr;
    }
  };

  // Get status badge style
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
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Render sort indicator
  const renderSortIndicator = (columnName) => {
    if (sortField !== columnName) {
      return null;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="inline-block ml-1 h-4 w-4" /> : 
      <ChevronDown className="inline-block ml-1 h-4 w-4" />;
  };

  // Loading state
  if (loading && reservations.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="mb-2 md:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reservations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="flex items-center px-3 py-2 text-sm border border-gray-300 shadow-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div> */}

      {showFilters && (
        <div className="bg-white shadow-md p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Filter Reservations</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bike ID</label>
              <input
                type="text"
                name="bike_id"
                value={filters.bike_id}
                onChange={handleFilterChange}
                placeholder="Enter Bike ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (From)</label>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Until)</label>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={resetFilters}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              onClick={() => resetFilters()} // This would normally be applyFilters, but keeping simple for now
              className="px-3 py-1 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {filteredReservations.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-700">No reservations found</h3>
          <p className="text-gray-500 mt-1">Try changing your filters or check back later</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID {renderSortIndicator('id')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Bike
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('start_datetime')}
                  >
                    <div className="flex items-center">
                      Start Date {renderSortIndicator('start_datetime')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('end_datetime')}
                  >
                    <div className="flex items-center">
                      End Date {renderSortIndicator('end_datetime')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status {renderSortIndicator('status')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('pay_amount')}
                  >
                    <div className="flex items-center">
                      Amount {renderSortIndicator('pay_amount')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                        Loading reservations...
                      </div>
                    </td>
                  </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No reservations found
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => {
                    const bikeInfo = formatBikeInfo(reservation);
                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">
                              {bikeInfo.display}
                            </div>
                            {bikeInfo.plate && (
                              <div className="text-xs text-gray-400">
                                Plate: {bikeInfo.plate}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                            {formatDateTime(reservation.start_datetime)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                            {formatDateTime(reservation.end_datetime)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(reservation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{parseFloat(reservation.pay_amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => onViewReservation(reservation)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            
                            {reservation.status === 'pending' && (
                              <button
                                onClick={(e) => handleStatusUpdateClick(reservation.id, 'confirmed', e)}
                                className="text-green-600 hover:text-green-900"
                                title="Confirm Reservation"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                            )}
                            
                            {reservation.status === 'confirmed' && (
                              <button
                                onClick={(e) => handleStatusUpdateClick(reservation.id, 'completed', e)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark as Completed"
                              >
                                <CheckSquare className="h-5 w-5" />
                              </button>
                            )}
                            
                            {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                              <button
                                onClick={(e) => handleCancelClick(reservation.id, e)}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel Reservation"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelModal}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmLabel="Cancel Reservation"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />

      {/* Status Update Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showUpdateStatusModal}
        title={`Update Reservation Status to ${statusToUpdate}`}
        message={`Are you sure you want to change the status to ${statusToUpdate}?`}
        confirmLabel="Update Status"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
        onConfirm={confirmStatusUpdate}
        onCancel={() => setShowUpdateStatusModal(false)}
      />
    </div>
  );
};

export default ReservationList; 