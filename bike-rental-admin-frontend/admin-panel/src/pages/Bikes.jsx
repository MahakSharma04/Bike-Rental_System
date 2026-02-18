import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  X,
  ImageIcon
} from 'lucide-react';
import bikeService from '../services/bikeService';
import BikeDetailsModal from '../components/bikes/BikeDetailsModal';
import BikeForm from '../components/bikes/BikeForm';

const Bikes = () => {
  // State for bikes data and pagination
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0
  });

  // State for filters and sorting
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    min_hourly_rate: '',
    max_hourly_rate: ''
  });
  const [sort, setSort] = useState({
    sort_by: 'created_at',
    sort_direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // State for bike types (for filter dropdown)
  const [bikeTypes, setBikeTypes] = useState([]);
  const [brandsSet, setBrandsSet] = useState(new Set());

  // State for bike actions
  const [selectedBike, setSelectedBike] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchBikes();
    fetchBikeTypes();
  }, []);

  // Fetch bikes when pagination, sorting, or filters change
  useEffect(() => {
    fetchBikes();
  }, [pagination.currentPage, sort.sort_by, sort.sort_direction]);

  // Handle search term changes
  useEffect(() => {
    if (bikes.length > 0) {
      filterBikesBySearchTerm();
    }
  }, [searchTerm, bikes]);

  // Filter bikes locally based on search term
  const filterBikesBySearchTerm = () => {
    if (!searchTerm.trim()) {
      setFilteredBikes(bikes);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = bikes.filter(bike => 
      bike.model.toLowerCase().includes(term) || 
      bike.brand.toLowerCase().includes(term) || 
      bike.type.toLowerCase().includes(term)
    );
    
    setFilteredBikes(filtered);
  };

  // Fetch bikes function
  const fetchBikes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        sort_by: sort.sort_by,
        sort_direction: sort.sort_direction,
        ...filters
      };
      
      const response = await bikeService.getBikes(params);
      
      if (response.status) {
        setBikes(response.data.data);
        setFilteredBikes(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page,
          total: response.data.total
        });
        
        // Extract unique brands for filter dropdown
        const brands = new Set();
        response.data.data.forEach(bike => {
          if (bike.brand) {
            brands.add(bike.brand);
          }
        });
        setBrandsSet(brands);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bikes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bike types for filter dropdown
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
    fetchBikes();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      brand: '',
      min_hourly_rate: '',
      max_hourly_rate: ''
    });
    setSearchTerm('');
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    // Apply the reset by fetching bikes again
    setTimeout(fetchBikes, 0);
  };

  // Handle sorting
  const handleSort = (columnName) => {
    setSort(prev => ({
      sort_by: columnName,
      sort_direction: prev.sort_by === columnName && prev.sort_direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.lastPage) {
      setPagination(prev => ({
        ...prev,
        currentPage: newPage
      }));
    }
  };

  // Handle successful bike update or creation
  const handleBikeSuccess = (updatedBike) => {
    fetchBikes(); // Refresh the bikes list
  };

  // View bike details
  const handleViewBike = (bike) => {
    setSelectedBike(bike);
    setIsViewModalOpen(true);
  };

  // Create new bike
  const handleCreateBike = () => {
    setIsCreateModalOpen(true);
  };

  // Edit bike
  const handleEditBike = (bike) => {
    setSelectedBike(bike);
    setIsEditModalOpen(true);
  };

  // Delete bike
  const handleDeleteBike = (bike) => {
    setSelectedBike(bike);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete bike
  const confirmDeleteBike = async () => {
    if (!selectedBike) return;
    
    setLoading(true);
    try {
      const response = await bikeService.deleteBike(selectedBike.id);
      if (response.status) {
        // Remove from the current list
        setBikes(bikes.filter(bike => bike.id !== selectedBike.id));
        setFilteredBikes(filteredBikes.filter(bike => bike.id !== selectedBike.id));
        setIsDeleteModalOpen(false);
        setSelectedBike(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete bike');
    } finally {
      setLoading(false);
    }
  };

  // Render sorting indicator
  const renderSortIndicator = (columnName) => {
    if (sort.sort_by !== columnName) {
      return null;
    }
    return sort.sort_direction === 'asc' ? 
      <ChevronUp className="inline-block ml-1 h-4 w-4" /> : 
      <ChevronDown className="inline-block ml-1 h-4 w-4" />;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Bike Models</h1>
        <button 
          onClick={handleCreateBike}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Bike
        </button>
      </div>

      {/* Search and filter section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search bikes..."
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
            <button
              onClick={fetchBikes}
              className="ml-2 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {bikeTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Brands</option>
                  {Array.from(brandsSet).map((brand, index) => (
                    <option key={index} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="min_hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  id="min_hourly_rate"
                  name="min_hourly_rate"
                  value={filters.min_hourly_rate}
                  onChange={handleFilterChange}
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="max_hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  id="max_hourly_rate"
                  name="max_hourly_rate"
                  value={filters.max_hourly_rate}
                  onChange={handleFilterChange}
                  min="0"
                  step="0.01"
                  placeholder="Max"
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

      {/* Bikes table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('model')}
                >
                  <div className="flex items-center">
                    Model {renderSortIndicator('model')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('brand')}
                >
                  <div className="flex items-center">
                    Brand {renderSortIndicator('brand')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type {renderSortIndicator('type')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('hourly_rate')}
                >
                  <div className="flex items-center">
                    Hourly Rate {renderSortIndicator('hourly_rate')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('daily_rate')}
                >
                  <div className="flex items-center">
                    Daily Rate {renderSortIndicator('daily_rate')}
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
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Loading bikes...
                    </div>
                  </td>
                </tr>
              ) : filteredBikes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No bikes found
                  </td>
                </tr>
              ) : (
                filteredBikes.map((bike) => (
                  <tr key={bike.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bike.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bike.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bike.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{parseFloat(bike.hourly_rate).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{parseFloat(bike.daily_rate).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewBike(bike)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditBike(bike)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit bike"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBike(bike)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete bike"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                  {bikes.length > 0 ? (pagination.currentPage - 1) * pagination.perPage + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.perPage, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> bikes
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
      </div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, marginLeft: 0, marginRight: 0 }}>
          <div 
            className="fixed inset-0 transition-opacity" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl z-10" style={{ width: "85%", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Delete Bike</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete the bike model "{selectedBike?.model}"? This action cannot be undone.
              </p>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  onClick={confirmDeleteBike}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  ) : null}
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View bike modal */}
      {isViewModalOpen && (
        <BikeDetailsModal 
          bike={selectedBike} 
          onClose={() => setIsViewModalOpen(false)} 
        />
      )}

      {/* Create bike modal */}
      {isCreateModalOpen && (
        <BikeForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleBikeSuccess}
        />
      )}

      {/* Edit bike modal */}
      {isEditModalOpen && (
        <BikeForm
          bike={selectedBike}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleBikeSuccess}
        />
      )}
    </div>
  );
};

export default Bikes;