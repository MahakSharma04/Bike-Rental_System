import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';
import PaymentList from '../components/payments/PaymentList';
import PaymentDetails from '../components/payments/PaymentDetails';

const Payments = () => {
  // State for payments data and pagination
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
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
    status: '',
    payment_method: '',
    reservation_id: '',
    min_amount: '',
    max_amount: '',
    date_from: '',
    date_to: ''
  });
  const [sort, setSort] = useState({
    sort_by: 'created_at',
    sort_direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // State for payment details modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch payments when pagination or sorting changes
  useEffect(() => {
    fetchPayments();
  }, [pagination.currentPage, sort.sort_by, sort.sort_direction]);

  // Fetch payments function
  const fetchPayments = async () => {
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
      
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await paymentService.getPayments(params);
      
      if (response.status) {
        setPayments(response.data.data);
        setFilteredPayments(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page,
          total: response.data.total
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch payments');
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
    fetchPayments();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      payment_method: '',
      reservation_id: '',
      min_amount: '',
      max_amount: '',
      date_from: '',
      date_to: ''
    });
    setSearchTerm('');
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    // Apply the reset by fetching payments again
    setTimeout(fetchPayments, 0);
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

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // If search is empty, reset to original data
    if (!value.trim()) {
      setFilteredPayments(payments);
      return;
    }
    
    // Simple client-side filtering - adjust based on your needs
    const lowerCaseValue = value.toLowerCase();
    const filtered = payments.filter(payment => 
      payment.id.toString().includes(lowerCaseValue) ||
      payment.reservation_id.toString().includes(lowerCaseValue) ||
      payment.transaction_id?.toLowerCase().includes(lowerCaseValue) ||
      payment.payment_method?.toLowerCase().includes(lowerCaseValue) ||
      payment.status?.toLowerCase().includes(lowerCaseValue)
    );
    
    setFilteredPayments(filtered);
  };

  // View payment details - using payment data already available
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  // Close payment details modal
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view payment records for bike reservations.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <PaymentList 
        payments={filteredPayments}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        currentSort={sort}
        onViewPayment={handleViewPayment}
        onFilterChange={handleFilterChange}
        filters={filters}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />

      {isViewModalOpen && selectedPayment && (
        <PaymentDetails 
          payment={selectedPayment} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Payments;