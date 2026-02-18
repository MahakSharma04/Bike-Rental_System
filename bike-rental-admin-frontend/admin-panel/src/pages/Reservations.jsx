import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Search, 
  Filter, 
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import reservationService from '../services/reservationService';
import ReservationList from '../components/reservations/ReservationList';
import ReservationDetails from '../components/reservations/ReservationDetails';
import SpinnerOverlay from '../components/common/SpinnerOverlay';

const Reservations = () => {
  // State
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    perPage: 10,
    lastPage: 1
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    bike_id: '',
    start_date: '',
    end_date: '',
    search: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reservations on component mount and when filters/pagination change
  useEffect(() => {
    fetchReservations();
  }, [pagination.currentPage, filters]);

  // Update search term in filters when it changes
  useEffect(() => {
    if (searchTerm) {
      setFilters(prev => ({
        ...prev,
        search: searchTerm
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        search: ''
      }));
    }
  }, [searchTerm]);

  // Fetch reservations from API
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Clean up params - only include non-empty values
      const queryParams = {
        page: pagination.currentPage
      };
      
      // Only add filter params if they have values
      if (filters.status) queryParams.status = filters.status;
      if (filters.bike_id) queryParams.bike_id = filters.bike_id;
      if (filters.start_date) queryParams.start_date = filters.start_date;
      if (filters.end_date) queryParams.end_date = filters.end_date;
      if (filters.search) queryParams.search = filters.search;
      
      const response = await reservationService.getReservations(queryParams);
      
      if (response.status) {
        setReservations(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page || 1,
          total: response.data.total || 0,
          perPage: response.data.per_page || 10,
          lastPage: response.data.last_page || 1
        });
      } else {
        setError(response.message || 'Failed to fetch reservations');
        console.error('Error fetching reservations:', response.message);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch reservations');
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing reservation details
  const handleViewReservation = async (reservation) => {
    setLoading(true);
    try {
      // If we already have full details, use them
      if (reservation.user && reservation.bikeInventory) {
        setSelectedReservation(reservation);
      } else {
        // Otherwise fetch the details
        const response = await reservationService.getReservationById(reservation.id);
        if (response.status) {
          setSelectedReservation(response.data);
        } else {
          console.error('Error fetching reservation details:', response.message);
        }
      }
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching reservation details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating reservation status
  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await reservationService.updateReservationStatus(id, status);
      if (response.status) {
        // Close modal if open
        if (showDetailsModal && selectedReservation?.id === id) {
          setShowDetailsModal(false);
          setSelectedReservation(null);
        }
        // Refresh reservations list
        fetchReservations();
      } else {
        console.error('Error updating reservation status:', response.message);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancelling a reservation
  const handleCancelReservation = async (id) => {
    setLoading(true);
    try {
      const response = await reservationService.cancelReservation(id);
      if (response.status) {
        // Close modal if open
        if (showDetailsModal && selectedReservation?.id === id) {
          setShowDetailsModal(false);
          setSelectedReservation(null);
        }
        // Refresh reservations list
        fetchReservations();
      } else {
        console.error('Error cancelling reservation:', response.message);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    } finally {
      setLoading(false);
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

  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page when applying filters
    }));
    fetchReservations();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      bike_id: '',
      start_date: '',
      end_date: '',
      search: ''
    });
    setSearchTerm('');
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    // Apply the reset
    setTimeout(fetchReservations, 0);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return;
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Close details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Reservations</h1>
        <button 
          onClick={() => fetchReservations()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Refresh Reservations
        </button>
      </div>

      {/* Search and filter section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
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
          
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="bike_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike ID
                </label>
                <input
                  type="text"
                  id="bike_id"
                  name="bike_id"
                  value={filters.bike_id}
                  onChange={handleFilterChange}
                  placeholder="Enter Bike ID"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (From)
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Until)
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex text-red-400 focus:outline-none focus:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ReservationList
          reservations={reservations}
          loading={loading}
          onViewReservation={handleViewReservation}
          onUpdateStatus={handleUpdateStatus}
          onCancelReservation={handleCancelReservation}
        />

        {/* Pagination */}
        {reservations.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.currentPage === pagination.lastPage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {reservations.length > 0 ? (pagination.currentPage - 1) * pagination.perPage + 1 : 0}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * pagination.perPage, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> reservations
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      pagination.currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <ChevronLeft className="h-5 w-5" />
                    <ChevronLeft className="h-5 w-5 -ml-2" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${
                      pagination.currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
                    .filter(
                      page => 
                        page === 1 || 
                        page === pagination.lastPage || 
                        (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    )
                    .map((page, i, array) => {
                      const isGap = i > 0 && array[i - 1] !== page - 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {isGap && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${
                      pagination.currentPage === pagination.lastPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.lastPage)}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      pagination.currentPage === pagination.lastPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <ChevronRight className="h-5 w-5" />
                    <ChevronRight className="h-5 w-5 -ml-2" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          onClose={handleCloseDetailsModal}
          onCancel={handleCancelReservation}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default Reservations;