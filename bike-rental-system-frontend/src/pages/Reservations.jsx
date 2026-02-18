import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { Calendar, Clock, Tag, Truck, Star, X, Edit, MessageSquare, DollarSign, Award, AlertTriangle } from "lucide-react";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  });
  const [filters, setFilters] = useState({
    status: "",
    sort_by: "start_datetime",
    sort_direction: "desc"
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionStatus, setActionStatus] = useState({
    loading: false,
    message: "",
    error: null,
    success: false
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [updateDates, setUpdateDates] = useState({
    start: "",
    end: ""
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    comment: ""
  });
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damageData, setDamageData] = useState({
    description: "",
    severity: "minor"
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Add query parameters from filters
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      params.append('sort_by', filters.sort_by);
      params.append('sort_direction', filters.sort_direction);
      
      const response = await api.get(`/reservations?${params.toString()}`);
      
      if (response && response.data) {
        if (response.data.data) {
          setReservations(response.data.data || []);
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
            perPage: response.data.per_page
          });
        } else if (Array.isArray(response.data)) {
          setReservations(response.data);
        }
      } else {
        setReservations([]);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setActionStatus({
        loading: false,
        error: "Failed to load reservations. Please try again.",
        message: "",
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);
  
  // Add a new useEffect to refetch when filters change
  useEffect(() => {
    fetchReservations();
  }, [filters]);

  // Handle cancellation
  const handleCancelReservation = async (reservationId) => {
    if (!reservationId) return;

    try {
      setActionStatus({
        loading: true,
        message: "Cancelling your reservation...",
        error: null,
        success: false
      });

      await api.delete(`/reservations/${reservationId}`);

      setActionStatus({
        loading: false,
        message: "Reservation cancelled successfully!",
        error: null,
        success: true
      });

      fetchReservations();
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setActionStatus({
        loading: false,
        error: err.message || "Failed to cancel reservation. Please try again.",
        message: "",
        success: false
      });
    }
  };

  // Handle payment
  const handlePayReservation = async (reservationId) => {
    if (!reservationId) return;

    try {
      setActionStatus({
        loading: true,
        message: "Generating payment link...",
        error: null,
        success: false
      });

      const response = await api.get(`/get-payment-link/${reservationId}`);
      
      let paymentUrl = null;
      if (response && response.data) {
        if (response.data.data && response.data.data.url) {
          paymentUrl = response.data.data.url;
        } else if (response.data.url) {
          paymentUrl = response.data.url;
        }
      }

      if (!paymentUrl) {
        throw new Error("Failed to generate payment link. Please try again.");
      }

      setActionStatus({
        loading: false,
        message: "Redirecting to payment gateway...",
        error: null,
        success: true
      });

      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Error processing payment:", err);
      setActionStatus({
        loading: false,
        error: err.message || "Failed to process payment. Please try again.",
        message: "",
        success: false
      });
    }
  };

  // Handle update reservation
  const handleUpdateReservation = async (reservationId) => {
    if (!reservationId || !updateDates.start || !updateDates.end) {
      setActionStatus({
        loading: false,
        error: "Please select both start and end dates.",
        message: "",
        success: false
      });
      return;
    }

    try {
      setActionStatus({
        loading: true,
        message: "Updating your reservation...",
        error: null,
        success: false
      });

      const payload = {
        start_datetime: updateDates.start,
        end_datetime: updateDates.end
      };

      await api.put(`/reservations/${reservationId}`, payload);

      setActionStatus({
        loading: false,
        message: "Reservation updated successfully!",
        error: null,
        success: true
      });

      setShowUpdateForm(false);
      fetchReservations();
    } catch (err) {
      console.error("Error updating reservation:", err);
      setActionStatus({
        loading: false,
        error: err.message || "Failed to update reservation. Please try again.",
        message: "",
        success: false
      });
    }
  };

  // Handle review submission
  const handleSubmitReview = async (reservationId, bikeId, bikeInventoryId) => {
    if (!reservationId || !bikeId || !bikeInventoryId) {
      setActionStatus({
        loading: false,
        error: "Missing required information for review.",
        message: "",
        success: false
      });
      return;
    }

    if (!reviewData.title || !reviewData.comment) {
      setActionStatus({
        loading: false,
        error: "Please provide both a title and comment for your review.",
        message: "",
        success: false
      });
      return;
    }

    try {
      setActionStatus({
        loading: true,
        message: "Submitting your review...",
        error: null,
        success: false
      });

      const payload = {
        reservation_id: reservationId,
        bike_id: bikeId,
        bike_inventory_id: bikeInventoryId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment
      };

      await api.post('/reviews', payload);

      setActionStatus({
        loading: false,
        message: "Review submitted successfully!",
        error: null,
        success: true
      });

      setReviewData({
        rating: 5,
        title: "",
        comment: ""
      });
      setShowReviewForm(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      setActionStatus({
        loading: false,
        error: err.message || "Failed to submit review. Please try again.",
        message: "",
        success: false
      });
    }
  };

  // Completely revamped file handling
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validate files are images
      const validFiles = filesArray.filter(file => 
        file.type.startsWith('image/jpeg') || 
        file.type.startsWith('image/png') || 
        file.type.startsWith('image/jpg') ||
        file.type.startsWith('image/gif')
      );
      
      if (validFiles.length !== filesArray.length) {
        alert("Only JPG, JPEG, PNG and GIF files are allowed!");
        return;
      }
      
      // Store files for upload
      setUploadedImages(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));
      
      setImagePreview(prev => [...prev, ...newPreviews]);
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index) => {
    // Remove the file from upload queue
    setUploadedImages(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    // Remove the preview
    setImagePreview(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url); // Clean up the URL object
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Handle damage report submission
  const handleSubmitDamageReport = async (reservationId, bikeInventoryId) => {
    if (!reservationId || !bikeInventoryId) {
      setActionStatus({
        loading: false,
        error: "Missing required information for damage report.",
        message: "",
        success: false
      });
      return;
    }

    if (!damageData.description) {
      setActionStatus({
        loading: false,
        error: "Please provide a description of the damage.",
        message: "",
        success: false
      });
      return;
    }
    
    if (uploadedImages.length === 0) {
      setActionStatus({
        loading: false,
        error: "Please upload at least one image of the damage.",
        message: "",
        success: false
      });
      return;
    }

    try {
      setActionStatus({
        loading: true,
        message: "Submitting damage report...",
        error: null,
        success: false
      });

      // Create FormData object - Postman compatible version
      const formData = new FormData();
      formData.append('reservation_id', reservationId.toString());  // Convert to string like Postman
      formData.append('bike_inventory_id', bikeInventoryId.toString()); // Convert to string like Postman
      formData.append('description', damageData.description);
      formData.append('severity', damageData.severity);

      // Use the exact Postman approach for files
      console.log("Adding files to FormData using Postman approach...");
      uploadedImages.forEach(file => {
        console.log(`Adding file as images[]: ${file.name}`);
        formData.append('images[]', file);
      });

      // Debug the FormData contents
      console.log("FormData contents:");
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File: ${pair[1].name} (${pair[1].size} bytes, type: ${pair[1].type})`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Directly use axios instead of our api utility
      // This ensures the Content-Type is set correctly for FormData
      console.log("Submitting damage report...");
      
      // Import axios directly for this specific request
      const axios = await import('axios');
      
      // Construct the full URL
      const apiUrl = 'http://127.0.0.1:8000/api/damages';
      console.log("Using URL:", apiUrl);

      try {
        // Get the token for authentication
        const token = localStorage.getItem('authToken');
        
        // Make the request directly with axios
        const response = await axios.default.post(apiUrl, formData, {
          headers: {
            // Don't set Content-Type - let the browser set it with the boundary
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Success! Response:", response.data);
        
        setActionStatus({
          loading: false,
          message: "Damage report submitted successfully!",
          error: null,
          success: true
        });
        
        // Reset form and close it
        setDamageData({
          description: "",
          severity: "minor"
        });
        setUploadedImages([]);
        setImagePreview([]);
        setShowDamageForm(false);
      } catch (err) {
        console.error("Error submitting damage report:", err);
        
        let errorMessage = "Failed to submit damage report. Please try again.";
        
        // Extract error message from response if available
        if (err.response && err.response.data) {
          console.error("Error response data:", err.response.data);
          
          if (err.response.data.errors) {
            const errors = err.response.data.errors;
            const errorMessages = [];
            
            Object.keys(errors).forEach(key => {
              if (Array.isArray(errors[key])) {
                errorMessages.push(...errors[key]);
              } else {
                errorMessages.push(errors[key]);
              }
            });
            
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join(", ");
            }
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
        
        setActionStatus({
          loading: false,
          error: errorMessage,
          message: "",
          success: false
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      console.error("Error details:", err.message);
      console.error("Error name:", err.name);
      console.error("Error stack:", err.stack);
      
      setActionStatus({
        loading: false,
        error: `Unexpected error: ${err.message}`,
        message: "",
        success: false
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={14} className="mr-1" />;
      case "confirmed":
        return <Tag size={14} className="mr-1" />;
      case "completed":
        return <Award size={14} className="mr-1" />;
      case "cancelled":
        return <X size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://source.unsplash.com/800x600/?bike";
    
    if (image.startsWith('http')) {
      return image;
    }
    
    return `http://localhost:8000/storage/${image}`;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openUpdateForm = (reservation) => {
    setSelectedReservation(reservation);
    setUpdateDates({
      start: reservation.start_datetime.slice(0, 19).replace('T', ' '),
      end: reservation.end_datetime.slice(0, 19).replace('T', ' ')
    });
    setShowUpdateForm(true);
    setShowReviewForm(false);
  };

  const openReviewForm = (reservation) => {
    setSelectedReservation(reservation);
    setShowReviewForm(true);
    setShowUpdateForm(false);
  };

  const openDamageForm = (reservation) => {
    setSelectedReservation(reservation);
    setShowDamageForm(true);
    setShowUpdateForm(false);
    setShowReviewForm(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          <p className="text-gray-600 mt-2">Manage your bike reservations and bookings</p>
        </header>

        {/* Status Messages */}
        {actionStatus.message && !actionStatus.error && (
          <div className={`p-4 mb-6 rounded-lg border ${actionStatus.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'} flex items-center`}>
            <div className="mr-3">
              {actionStatus.success ? (
                <div className="rounded-full bg-green-100 p-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="rounded-full bg-blue-100 p-1">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            <p>{actionStatus.message}</p>
          </div>
        )}

        {actionStatus.error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center">
            <div className="rounded-full bg-red-100 p-1 mr-3">
              <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p>{actionStatus.error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Filter Reservations</h2>
          <div className="flex flex-wrap gap-6">
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="appearance-none w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="relative">
                <select
                  name="sort_by"
                  value={filters.sort_by}
                  onChange={handleFilterChange}
                  className="appearance-none w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="start_datetime">Start Date</option>
                  <option value="end_datetime">End Date</option>
                  <option value="created_at">Creation Date</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
              <div className="relative">
                <select
                  name="sort_direction"
                  value={filters.sort_direction}
                  onChange={handleFilterChange}
                  className="appearance-none w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 animate-ping"></div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && reservations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Truck size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No reservations found</h3>
            <p className="text-gray-500 max-w-md mx-auto">You don't have any reservations yet. Try changing your filters or book a bike to get started.</p>
            <button className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Browse Bikes
            </button>
          </div>
        )}

        {/* Reservations list */}
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-0">
                {/* Left section - Bike Image */}
                <div className="md:col-span-2 h-60 md:h-auto relative overflow-hidden">
                  <img 
                    src={reservation.bike_inventory?.bike?.images?.[0] 
                      ? getImageUrl(reservation.bike_inventory.bike.images[0]) 
                      : "https://source.unsplash.com/800x600/?bike"}
                    alt={`${reservation.bike_inventory?.bike?.brand || ''} ${reservation.bike_inventory?.bike?.model || ''}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-0 left-0 m-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      {reservation.status}
                    </span>
                  </div>
                </div>
                
                {/* Middle section - Reservation Details */}
                <div className="p-6 md:col-span-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {reservation.bike_inventory?.bike?.brand} {reservation.bike_inventory?.bike?.model}
                    </h3>
                    
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs font-medium mb-4">
                      <Truck size={14} className="mr-1" />
                      {reservation.bike_inventory?.plate_number}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        <div>
                          <span className="text-xs text-gray-500">Start</span>
                          <p className="text-sm font-medium">{formatDate(reservation.start_datetime)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        <div>
                          <span className="text-xs text-gray-500">End</span>
                          <p className="text-sm font-medium">{formatDate(reservation.end_datetime)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <DollarSign size={16} className="mr-2 text-green-500" />
                        <div>
                          <span className="text-xs text-gray-500">Amount</span>
                          <p className="text-sm font-medium">₹{reservation.pay_amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Reserved on {formatDate(reservation.created_at)}
                    </p>
                  </div>
                </div>
                
                {/* Right section - Actions */}
                <div className="p-6 md:col-span-2 bg-gray-50 flex flex-col justify-center">
                  <div className="space-y-3">
                    {/* Action buttons based on status */}
                    {reservation.status === "pending" && (
                      <>
                        <button
                          onClick={() => handlePayReservation(reservation.id)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium shadow hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <DollarSign size={18} className="mr-1" />
                          Confirm & Pay
                        </button>
                        
                        <button
                          onClick={() => openUpdateForm(reservation)}
                          className="w-full py-2.5 px-4 bg-white border border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <Edit size={18} className="mr-1" />
                          Update
                        </button>
                        
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="w-full py-2.5 px-4 bg-white border border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <X size={18} className="mr-1" />
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {reservation.status === "confirmed" && (
                      <>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <X size={18} className="mr-1" />
                          Cancel
                        </button>
                        
                        <button
                          onClick={() => openReviewForm(reservation)}
                          className="w-full py-2.5 px-4 bg-white border border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <MessageSquare size={18} className="mr-1" />
                          Write Review
                        </button>
                        
                        <button
                          onClick={() => openDamageForm(reservation)}
                          className="w-full py-2.5 px-4 bg-white border border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <AlertTriangle size={18} className="mr-1" />
                          Report Damage
                        </button>
                      </>
                    )}
                    
                    {reservation.status === "completed" && (
                      <>
                        <button
                          onClick={() => openReviewForm(reservation)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium shadow hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <Star size={18} className="mr-1" />
                          Write Review
                        </button>
                        
                        <button
                          onClick={() => openDamageForm(reservation)}
                          className="w-full py-2.5 px-4 bg-white border border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                          disabled={actionStatus.loading}
                        >
                          <AlertTriangle size={18} className="mr-1" />
                          Report Damage
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Reservation Modal */}
      {showUpdateForm && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Update Reservation</h3>
              <button 
                onClick={() => setShowUpdateForm(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {actionStatus.message && !actionStatus.error && (
                <div className="p-3 mb-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{actionStatus.message}</p>
                </div>
              )}
              
              {actionStatus.error && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{actionStatus.error}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="datetime-local"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={updateDates.start.replace(' ', 'T')}
                      onChange={(e) => setUpdateDates(prev => ({ ...prev, start: e.target.value.replace('T', ' ') }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="datetime-local"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={updateDates.end.replace(' ', 'T')}
                      onChange={(e) => setUpdateDates(prev => ({ ...prev, end: e.target.value.replace('T', ' ') }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpdateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => handleUpdateReservation(selectedReservation.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={actionStatus.loading}
                >
                  {actionStatus.loading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : 'Update Reservation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Write a Review</h3>
              <button 
                onClick={() => setShowReviewForm(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {actionStatus.message && !actionStatus.error && (
                <div className="p-3 mb-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{actionStatus.message}</p>
                </div>
              )}
              
              {actionStatus.error && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{actionStatus.error}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <svg 
                          className={`w-8 h-8 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {reviewData.rating === 1 && "Poor"}
                    {reviewData.rating === 2 && "Fair"}
                    {reviewData.rating === 3 && "Average"}
                    {reviewData.rating === 4 && "Good"}
                    {reviewData.rating === 5 && "Excellent"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={reviewData.title}
                    onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Sum up your experience in a few words"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this bike in detail"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => handleSubmitReview(
                    selectedReservation.id,
                    selectedReservation.bike_inventory?.bike_id,
                    selectedReservation.bike_inventory?.id
                  )}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  disabled={actionStatus.loading}
                >
                  {actionStatus.loading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Damage Report Modal */}
      {showDamageForm && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Report Damage</h3>
              <button 
                onClick={() => setShowDamageForm(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {actionStatus.message && !actionStatus.error && (
                <div className="p-3 mb-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{actionStatus.message}</p>
                </div>
              )}
              
              {actionStatus.error && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{actionStatus.error}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value="minor"
                        checked={damageData.severity === "minor"}
                        onChange={() => setDamageData(prev => ({ ...prev, severity: "minor" }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Minor</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value="moderate"
                        checked={damageData.severity === "moderate"}
                        onChange={() => setDamageData(prev => ({ ...prev, severity: "moderate" }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Moderate</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value="severe"
                        checked={damageData.severity === "severe"}
                        onChange={() => setDamageData(prev => ({ ...prev, severity: "severe" }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Severe</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 h-32 resize-none"
                    value={damageData.description}
                    onChange={(e) => setDamageData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the damage in detail"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload files</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                            ref={fileInputRef}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                </div>
                
                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Previews ({imagePreview.length} files)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreview.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {image.name}
                          </div>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removeImage(index)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDamageForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => handleSubmitDamageReport(
                    selectedReservation.id,
                    selectedReservation.bike_inventory?.id
                  )}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  disabled={actionStatus.loading}
                >
                  {actionStatus.loading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animated success toast notification */}
      {actionStatus.success && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border-l-4 border-green-500 px-4 py-3 flex items-center max-w-sm animate-fade-in-up">
          <div className="mr-3 bg-green-100 p-2 rounded-full">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-800">Success</p>
            <p className="text-sm text-gray-600">{actionStatus.message}</p>
          </div>
          <button 
            onClick={() => setActionStatus(prev => ({ ...prev, success: false, message: "" }))}
            className="ml-auto text-gray-400 hover:text-gray-500"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservation;