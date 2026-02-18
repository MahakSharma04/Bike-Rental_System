import React, { useState } from 'react';
import { 
  Wrench, 
  Edit, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  PlusCircle,
  Trash2,
  Calendar,
  X,
  Search,
  RefreshCw,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmDialog from '../common/ConfirmDialog';

const MaintenanceList = ({ 
  maintenanceRecords = [], 
  loading = false, 
  onViewMaintenance,
  onEditMaintenance,
  onCompleteMaintenance,
  onDeleteMaintenance,
  onCreateMaintenance
}) => {
  const [sortField, setSortField] = useState('scheduled_date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    status: '',
    bike_inventory_id: '',
    maintenance_type: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Apply client-side sorting
  const getSortedRecords = () => {
    if (!maintenanceRecords.length) return [];
    
    // First filter by search term if any
    let records = maintenanceRecords;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      records = records.filter(record => 
        record.id.toString().includes(term) || 
        (record.description && record.description.toLowerCase().includes(term)) ||
        (record.bikeInventory?.plate_number && record.bikeInventory.plate_number.toLowerCase().includes(term))
      );
    }
    
    // Then filter by selected filters
    if (filters.status) {
      records = records.filter(record => record.status === filters.status);
    }
    if (filters.bike_inventory_id) {
      records = records.filter(record => record.bike_inventory_id.toString() === filters.bike_inventory_id);
    }
    if (filters.maintenance_type) {
      records = records.filter(record => record.maintenance_type === filters.maintenance_type);
    }
    
    // Then sort
    return [...records].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      // Handle dates
      if (sortField === 'scheduled_date' || sortField === 'completion_date' || sortField === 'created_at' || sortField === 'updated_at') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      
      // Handle strings
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
      }
      if (typeof valB === 'string') {
        valB = valB.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      bike_inventory_id: '',
      maintenance_type: ''
    });
    setSearchTerm('');
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await onDeleteMaintenance(deleteId);
    } catch (error) {
      toast.error('Failed to delete maintenance record');
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const filteredAndSortedRecords = getSortedRecords();

  // Show a loading state when initially loading records
  if (loading && maintenanceRecords.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="mb-2 md:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search maintenance records..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={onCreateMaintenance}
            className="flex items-center px-3 py-2 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100"
          >
            <PlusCircle size={16} className="mr-1" />
            New Maintenance
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Filter Maintenance Records</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bike ID</label>
              <input
                type="text"
                name="bike_inventory_id"
                value={filters.bike_inventory_id}
                onChange={handleFilterChange}
                placeholder="Enter Bike ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
              <select
                name="maintenance_type"
                value={filters.maintenance_type}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Types</option>
                <option value="routine">Routine</option>
                <option value="repair">Repair</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedRecords.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <Wrench size={48} className="mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-700">No maintenance records found</h3>
          <p className="text-gray-500 mt-1">Try changing your filters or add a new record</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('bike_inventory_id')}
                >
                  <div className="flex items-center">
                    Bike ID
                    {getSortIcon('bike_inventory_id')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('maintenance_type')}
                >
                  <div className="flex items-center">
                    Type
                    {getSortIcon('maintenance_type')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('scheduled_date')}
                >
                  <div className="flex items-center">
                    Scheduled Date
                    {getSortIcon('scheduled_date')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('cost')}
                >
                  <div className="flex items-center">
                    Cost
                    {getSortIcon('cost')}
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
              {filteredAndSortedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.bike_inventory_id}
                    {record.bikeInventory && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({record.bikeInventory.plate_number})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.maintenance_type === 'routine' ? 'Routine' : 'Repair'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {record.scheduled_date ? format(new Date(record.scheduled_date), 'MMM dd, yyyy') : 'Not scheduled'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${record.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        record.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {record.status?.replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{parseFloat(record.cost || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onViewMaintenance(record)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEditMaintenance(record)}
                        className="text-amber-600 hover:text-amber-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      {record.status !== 'completed' && (
                        <button
                          onClick={() => onCompleteMaintenance(record.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Completed"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(record.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Maintenance Record"
        message="Are you sure you want to delete this maintenance record? This action cannot be undone."
        confirmLabel="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default MaintenanceList; 