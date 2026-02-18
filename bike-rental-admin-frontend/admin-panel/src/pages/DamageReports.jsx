import React, { useState, useEffect } from 'react';
import damageReportService from '../services/damageReportService';
import DamageReportList from '../components/damages/DamageReportList';
import DamageReportDetails from '../components/damages/DamageReportDetails';
import DamageReportForm from '../components/damages/DamageReportForm';

const DamageReports = () => {
  // State for damage reports data
  const [damageReports, setDamageReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    bike_id: '',
    bike_inventory_id: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // State for modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // User role check - in a real app, this would come from auth context
  const [isAdmin, setIsAdmin] = useState(true); // For demo purposes, set to true

  // Load initial data
  useEffect(() => {
    fetchDamageReports();
  }, []);

  // Fetch damage reports
  const fetchDamageReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters };
      
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await damageReportService.getDamageReports(params);
      
      if (response.status === "success") {
        setDamageReports(response.data);
        setFilteredReports(response.data);
      } else {
        setError(response.message || 'Failed to fetch damage reports');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching damage reports');
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
    fetchDamageReports();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      severity: '',
      bike_id: '',
      bike_inventory_id: ''
    });
    setSearchTerm('');
    setTimeout(fetchDamageReports, 0);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // If search is empty, reset to original data
    if (!value.trim()) {
      setFilteredReports(damageReports);
      return;
    }
    
    // Simple client-side filtering
    const lowerCaseValue = value.toLowerCase();
    const filtered = damageReports.filter(report => 
      report.id.toString().includes(lowerCaseValue) ||
      report.bike_inventory_id.toString().includes(lowerCaseValue) ||
      report.description?.toLowerCase().includes(lowerCaseValue) ||
      report.status?.toLowerCase().includes(lowerCaseValue) ||
      report.severity?.toLowerCase().includes(lowerCaseValue) ||
      report.bikeInventory?.plate_number?.toLowerCase().includes(lowerCaseValue)
    );
    
    setFilteredReports(filtered);
  };

  // View report details
  const handleViewReport = async (report) => {
    try {
      // Get detailed report info
      const response = await damageReportService.getDamageReportById(report.id);
      if (response.status === "success") {
        setSelectedReport(response.data);
        setIsViewModalOpen(true);
      } else {
        setError(response.message || 'Failed to fetch report details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching report details');
    }
  };

  // Edit report
  const handleEditReport = (report) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  // Update report
  const handleUpdateReport = async (data) => {
    if (!selectedReport) return;
    
    setSubmitLoading(true);
    setError(null);
    
    try {
      const response = await damageReportService.updateDamageReport(selectedReport.id, data);
      
      if (response.status === "success") {
        // Update the report in the list
        setDamageReports(prev => prev.map(item => 
          item.id === selectedReport.id ? response.data : item
        ));
        setFilteredReports(prev => prev.map(item => 
          item.id === selectedReport.id ? response.data : item
        ));
        
        setIsEditModalOpen(false);
        setSelectedReport(null);
        
        // If the detailed view is open, update it too
        if (isViewModalOpen) {
          setSelectedReport(response.data);
        }
      } else {
        setError(response.message || 'Failed to update damage report');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the damage report');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Close modals
  const handleCloseDetailsModal = () => {
    setIsViewModalOpen(false);
    setSelectedReport(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Damage Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage damage reports for bike rentals.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <DamageReportList 
        damageReports={filteredReports}
        loading={loading}
        onViewReport={handleViewReport}
        onEditReport={handleEditReport}
        onFilterChange={handleFilterChange}
        filters={filters}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        isAdmin={isAdmin}
      />

      {isViewModalOpen && selectedReport && (
        <DamageReportDetails 
          report={selectedReport} 
          onClose={handleCloseDetailsModal} 
        />
      )}

      {isEditModalOpen && selectedReport && (
        <DamageReportForm 
          report={selectedReport}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateReport}
          loading={submitLoading}
        />
      )}
    </div>
  );
};

export default DamageReports;