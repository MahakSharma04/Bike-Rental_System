import React, { useState, useEffect } from 'react';
import MaintenanceList from '../components/maintenance/MaintenanceList';
import MaintenanceDetails from '../components/maintenance/MaintenanceDetails';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import { Wrench } from 'lucide-react';
import maintenanceService from '../services/maintenanceService';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const [loading, setLoading] = useState(false);
  const [bikeInventories, setBikeInventories] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  
  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch maintenance records and bike inventory on component mount
  useEffect(() => {
    fetchMaintenanceRecords();
    fetchBikeInventory();
  }, []);

  // Fetch maintenance records
  const fetchMaintenanceRecords = async () => {
    setLoading(true);
    try {
      const response = await maintenanceService.getAllMaintenance();
      if (response.status) {
        setMaintenanceRecords(response.data || []);
      } else {
        toast.error(response.message || 'Failed to fetch maintenance records');
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast.error('Failed to fetch maintenance records');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bike inventory for maintenance assignment
  const fetchBikeInventory = async () => {
    try {
      const response = await maintenanceService.getBikeInventory();
      if (response.status) {
        setBikeInventories(response.data?.data || []);
      } else {
        console.error('Failed to fetch bike inventory:', response.message);
      }
    } catch (error) {
      console.error('Error fetching bike inventory:', error);
    }
  };

  // Handle new maintenance record creation
  const handleCreateMaintenance = async (maintenanceData) => {
    setLoading(true);
    try {
      const response = await maintenanceService.createMaintenance(maintenanceData);
      if (response.status) {
        toast.success('Maintenance record created successfully');
        fetchMaintenanceRecords();
        setIsCreateModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to create maintenance record');
      }
    } catch (error) {
      console.error('Error creating maintenance:', error);
      toast.error('Failed to create maintenance record');
    } finally {
      setLoading(false);
    }
  };

  // Handle maintenance record update
  const handleUpdateMaintenance = async (maintenanceData) => {
    if (!selectedMaintenance) return;
    
    setLoading(true);
    try {
      const response = await maintenanceService.updateMaintenance(selectedMaintenance.id, maintenanceData);
      if (response.status) {
        toast.success('Maintenance record updated successfully');
        fetchMaintenanceRecords();
        setIsEditModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to update maintenance record');
      }
    } catch (error) {
      console.error('Error updating maintenance:', error);
      toast.error('Failed to update maintenance record');
    } finally {
      setLoading(false);
    }
  };

  // Handle maintenance record completion
  const handleCompleteMaintenance = async (id) => {
    setLoading(true);
    try {
      const response = await maintenanceService.completeMaintenance(id);
      if (response.status) {
        toast.success('Maintenance record completed successfully');
        fetchMaintenanceRecords();
      } else {
        toast.error(response.message || 'Failed to complete maintenance record');
      }
    } catch (error) {
      console.error('Error completing maintenance:', error);
      toast.error('Failed to complete maintenance record');
    } finally {
      setLoading(false);
    }
  };

  // Handle maintenance record deletion
  const handleDeleteMaintenance = async (id) => {
    setLoading(true);
    try {
      const response = await maintenanceService.deleteMaintenance(id);
      if (response.status) {
        toast.success('Maintenance record deleted successfully');
        fetchMaintenanceRecords();
      } else {
        toast.error(response.message || 'Failed to delete maintenance record');
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      toast.error('Failed to delete maintenance record');
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing maintenance details
  const handleViewMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDetailsModalOpen(true);
  };

  // Handle editing maintenance
  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Wrench className="h-6 w-6 text-blue-600 mr-2" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage bike maintenance records</p>
        </div>
      </div>

      <MaintenanceList 
        maintenanceRecords={maintenanceRecords}
        loading={loading}
        onViewMaintenance={handleViewMaintenance}
        onEditMaintenance={handleEditMaintenance}
        onCompleteMaintenance={handleCompleteMaintenance}
        onDeleteMaintenance={handleDeleteMaintenance}
        onCreateMaintenance={() => setIsCreateModalOpen(true)}
      />

      {/* Maintenance details modal */}
      {isDetailsModalOpen && selectedMaintenance && (
        <MaintenanceDetails 
          maintenance={selectedMaintenance}
          onClose={() => setIsDetailsModalOpen(false)}
          onEdit={() => {
            setIsDetailsModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onComplete={handleCompleteMaintenance}
          onDelete={handleDeleteMaintenance}
        />
      )}

      {/* Create maintenance modal */}
      {isCreateModalOpen && (
        <MaintenanceForm
          onSubmit={handleCreateMaintenance}
          onClose={() => setIsCreateModalOpen(false)}
          loading={loading}
          bikeInventories={bikeInventories}
        />
      )}

      {/* Edit maintenance modal */}
      {isEditModalOpen && selectedMaintenance && (
        <MaintenanceForm
          maintenance={selectedMaintenance}
          onSubmit={handleUpdateMaintenance}
          onClose={() => setIsEditModalOpen(false)}
          loading={loading}
          bikeInventories={bikeInventories}
        />
      )}
    </div>
  );
};

export default Maintenance;