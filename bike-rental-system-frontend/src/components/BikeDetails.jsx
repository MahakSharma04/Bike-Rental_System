import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import b1 from "../assets/b1.jpg"
import b2 from "../assets/b2.jpeg"
import b3 from "../assets/b3.jpeg"
import b4 from "../assets/b4.jpg"

// Dummy data for fallback
const dummyBikeDetails = {
  id: 1,
  model: "Bullet 350",
  brand: "Royal Enfield",
  type: "Retro",
  description: "Royal Enfield offers a diverse range of models including the Classic 350 and Hunter 350, with options for the best mileage, premium pricing, and affordability. Upcoming models like the Royal Enfield Bullet 650 and Royal Enfield Continental GT 450 show Royal Enfield's continued innovation.",
  hourly_rate: "100.00",
  daily_rate: "1100.00",
  images: [
    b1,b2,b3,b4
  ],
  inventoryItems: [
    {
      id: 3,
      bike_id: 1,
      plate_number: "MTB-123",
      serial_number: "TK12345678",
      status: "available",
      last_maintenance_date: "2024-03-15"
    }
  ],
  average_rating: 4.5,
  review_count: 253
};

// Updated dummy reviews to match API response structure
const dummyReviews = {
  status: true,
  message: "Bike reviews retrieved successfully",
  data: {
    bike: {
      id: 1,
      model: "Bullet 350",
      brand: "Royal Enfield",
      type: "Retro",
      description: "Royal Enfield offers a diverse range of models including the Classic 350 and Hunter 350, with options for the best mileage, premium pricing, and affordability."
    },
    average_rating: 4.1,
    total_reviews: 4,
    reviews: [
      {
        id: 1,
        user_id: 2,
        bike_id: 1,
        bike_inventory_id: 3,
        reservation_id: 1,
        rating: 5,
        title: "Amazing ride experience",
        comment: "Perfect for any trail! The bike handled exceptionally well on rough terrain and the suspension system is top-notch.",
        created_at: "2024-03-20T10:00:00.000000Z",
        updated_at: "2024-03-20T10:00:00.000000Z",
        user: {
          id: 2,
          name: "John Doe",
          email: "john@example.com"
        },
        bike_inventory: {
          id: 3,
          bike_id: 1,
          plate_number: "MTB-123",
          serial_number: "TK12345678",
          status: "available",
          last_maintenance_date: "2024-03-15"
        }
      },
      {
        id: 2,
        user_id: 3,
        bike_id: 1,
        bike_inventory_id: 3,
        reservation_id: 2,
        rating: 4,
        title: "Very comfortable ride",
        comment: "Great bike overall, very comfortable for long rides. The only minor issue was the seat adjustment.",
        created_at: "2024-03-18T15:30:00.000000Z",
        updated_at: "2024-03-18T15:30:00.000000Z",
        user: {
          id: 3,
          name: "Sarah Smith",
          email: "sarah@example.com"
        },
        bike_inventory: {
          id: 3,
          bike_id: 1,
          plate_number: "MTB-123",
          serial_number: "TK12345678",
          status: "available",
          last_maintenance_date: "2024-03-15"
        }
      },
      {
        id: 3,
        user_id: 4,
        bike_id: 1,
        bike_inventory_id: 3,
        reservation_id: 3,
        rating: 4,
        title: "Good value",
        comment: "Great bike for the price, handles well on different terrains.",
        created_at: "2024-03-15T12:30:00.000000Z",
        updated_at: "2024-03-15T12:30:00.000000Z",
        user: {
          id: 4,
          name: "Mike Johnson",
          email: "mike@example.com"
        },
        bike_inventory: {
          id: 3,
          bike_id: 1,
          plate_number: "MTB-123",
          serial_number: "TK12345678",
          status: "available",
          last_maintenance_date: "2024-03-15"
        }
      },
      {
        id: 4,
        user_id: 5,
        bike_id: 1,
        bike_inventory_id: 3,
        reservation_id: 4,
        rating: 3,
        title: "Decent but needs improvement",
        comment: "The bike was okay but the brakes need adjustment. Otherwise good experience.",
        created_at: "2024-03-10T09:15:00.000000Z",
        updated_at: "2024-03-10T09:15:00.000000Z",
        user: {
          id: 5,
          name: "Emily Davis",
          email: "emily@example.com"
        },
        bike_inventory: {
          id: 3,
          bike_id: 1,
          plate_number: "MTB-123",
          serial_number: "TK12345678",
          status: "available",
          last_maintenance_date: "2024-03-15"
        }
      }
    ]
  }
};

const BikeDetails = () => {
  console.log("component mounted");

  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [cumulativeRating, setCumulativeRating] = useState({
    average: 0,
    count: 0
  });
  // Add state for inventory selection and reservation
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationDates, setReservationDates] = useState({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 1))
  });
  const [reservationStatus, setReservationStatus] = useState({
    loading: false,
    message: "",
    success: false
  });
  const [paymentStatus, setPaymentStatus] = useState({
    loading: false,
    message: "",
    error: null
  });

  // Use memoized values for dependency arrays
  const reviewsLength = useMemo(() => reviews.length, [reviews]);
  const imagesLength = useMemo(() => bike?.images?.length || 0, [bike?.images]);
  
  // Stabilize functions with useCallback
  const handleThumbnailClick = useCallback((index) => {
    setSelectedThumbnail(index);
    setCurrentImageIndex(index);
  }, []);

  const handleNextReview = useCallback(() => {
    setCurrentReviewIndex(prevIndex => 
      prevIndex === reviewsLength - 1 ? 0 : prevIndex + 1
    );
  }, [reviewsLength]);

  const handlePrevReview = useCallback(() => {
    setCurrentReviewIndex(prevIndex => 
      prevIndex === 0 ? reviewsLength - 1 : prevIndex - 1
    );
  }, [reviewsLength]);

  const nextImage = useCallback(() => {
    if (imagesLength <= 1) return;
    const newIndex = currentImageIndex === imagesLength - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedThumbnail(newIndex);
  }, [currentImageIndex, imagesLength]);

  const prevImage = useCallback(() => {
    if (imagesLength <= 1) return;
    const newIndex = currentImageIndex === 0 ? imagesLength - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedThumbnail(newIndex);
  }, [currentImageIndex, imagesLength]);

  // Debug log when component renders
  console.log("BikeDetails render", { 
    currentImageIndex, 
    selectedThumbnail, 
    imagesLength, 
    reviewsLength 
  });
  
  // Add new log to inspect structure
  useEffect(() => {
    if (bike) {
      console.log("Bike structure check:");
      console.log("- Has inventoryItems:", !!bike.inventoryItems);
      console.log("- Has available_inventory:", !!bike.available_inventory);
      console.log("- Available properties:", Object.keys(bike));
    }
  }, [bike]);

  // Only fetch data once
  useEffect(() => {
    console.log("Fetching data effect running for id:", id);
    fetchBikeDetails();
    fetchBikeReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Calculate cumulative rating whenever reviews change
  useEffect(() => {
    // Only calculate if we don't already have the data from the API and have reviews
    if (reviewsLength > 0 && (!cumulativeRating.count || cumulativeRating.count === 0)) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setCumulativeRating({
        average: (totalRating / reviewsLength).toFixed(1),
        count: reviewsLength
      });
    }
  }, [reviews, reviewsLength, cumulativeRating.count]);

  // Auto-slide reviews - use a ref for the interval to prevent it from affecting renders
  useEffect(() => {
    let reviewTimer;
    
    if (reviewsLength > 1) {
      console.log("Setting up review slider timer");
      reviewTimer = setInterval(() => {
        setCurrentReviewIndex(prevIndex => 
          prevIndex === reviewsLength - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (reviewTimer) {
        console.log("Clearing review slider timer");
        clearInterval(reviewTimer);
      }
    };
  }, [reviewsLength]);

  // Auto-slide images - use a ref for the interval
  useEffect(() => {
    let imageTimer;
    
    if (imagesLength > 1) {
      console.log("Setting up image slider timer");
      imageTimer = setInterval(() => {
        nextImage();
      }, 5000);
    }
    
    return () => {
      if (imageTimer) {
        console.log("Clearing image slider timer");
        clearInterval(imageTimer);
      }
    };
  }, [imagesLength, nextImage]);

  const fetchBikeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bikes/${id}`);
      console.log('API Response:', response);
      
      // Add detailed debug logging
      console.log('Response structure check:');
      console.log('- Has data:', !!response.data);
      console.log('- Has status:', !!response.status);
      if (response.data) {
        console.log('- Data keys:', Object.keys(response.data));
        if (response.data.data) {
          console.log('- Nested data keys:', Object.keys(response.data.data));
        }
      }
      
      // Updated response handling
      if (response && response.data) {
        if (response.data.status && response.data.data) {
          // New API format: { status: true, message: "...", data: { bike object } }
          console.log('Using response.data.data format');
          setBike(response.data.data);
        } else if (response.data.id) {
          // Direct bike object: { id: 1, model: "...", ... }
          console.log('Using direct response.data format');
          setBike(response.data);
        } else if (response.data.bike) {
          // Another possible format: { bike: { bike object } }
          console.log('Using response.data.bike format');
          setBike(response.data.bike);
        } else {
          console.error('Could not find bike data in response:', response);
          // Try using response directly as a last resort
          setBike(response);
        }
      } else {
        console.error('Unexpected API response structure:', response);
        setBike(dummyBikeDetails);
      }
    } catch (err) {
      console.log('Using dummy data due to API error:', err);
      setBike(dummyBikeDetails);
    } finally {
      setLoading(false);
    }
  };

  const fetchBikeReviews = async () => {
    try {
      const response = await api.get(`/reviews/bikes/${id}`);
      console.log('Reviews API Response:', response);
      
      if (response && response.data && response.data.reviews) {
        // Direct match with new API structure
        setReviews(response.data.reviews);
        
        // Also update cumulative rating from API if available
        if (response.data.average_rating !== undefined && response.data.total_reviews !== undefined) {
          setCumulativeRating({
            average: response.data.average_rating.toFixed(1),
            count: response.data.total_reviews
          });
        }
      } else if (response && response.status && response.data && response.data.reviews) {
        // Format matching the provided example
        setReviews(response.data.reviews);
        
        // Also update cumulative rating from API if available
        if (response.data.average_rating !== undefined && response.data.total_reviews !== undefined) {
          setCumulativeRating({
            average: response.data.average_rating.toFixed(1),
            count: response.data.total_reviews
          });
        }
      } else {
        console.error('Unexpected reviews API response structure:', response);
        setReviews(dummyReviews.data.reviews);
        setCumulativeRating({
          average: dummyReviews.data.average_rating.toFixed(1),
          count: dummyReviews.data.total_reviews
        });
      }
    } catch (err) {
      console.log('Using dummy reviews due to API error:', err);
      setReviews(dummyReviews.data.reviews);
      setCumulativeRating({
        average: dummyReviews.data.average_rating.toFixed(1),
        count: dummyReviews.data.total_reviews
      });
    }
  };

  // Memoize the getImageUrl function to prevent recreating it on every render
  const getImageUrl = useCallback((image) => {
    // Handle imported assets (dummy data)
    if (typeof image === 'object' || (image && (image.startsWith('data:') || image.includes('/assets/')))) {
      return image;
    }
    
    // Handle server images - prepend the storage URL
    if (image && typeof image === 'string' && !image.startsWith('http')) {
      return `http://localhost:8000/storage/${image}`;
    }
    
    // Handle existing URLs or fallback to placeholder
    return image || `https://source.unsplash.com/800x600/?${bike?.type?.toLowerCase() || 'bike'}-bike`;
  }, [bike?.type]);

  // Function to get available inventory items
  const getAvailableInventoryItems = useCallback(() => {
    if (!bike) return [];
    
    // Check for new API format (inventory_items)
    if (bike.inventory_items) {
      return bike.inventory_items.filter(item => item.status === 'available');
    }
    
    // Check for old format (inventoryItems)
    if (bike.inventoryItems) {
      return bike.inventoryItems.filter(item => item.status === 'available');
    }
    
    // Fallback for other formats
    if (bike.available_inventory) {
      return bike.available_inventory;
    }
    
    return [];
  }, [bike]);

  // Handle inventory selection
  const handleInventorySelect = (inventory) => {
    setSelectedInventory(inventory);
  };

  // Handle reservation submission
  const handleReservationSubmit = async () => {
    if (!selectedInventory) {
      setReservationStatus({
        loading: false,
        success: false,
        message: "Please select a bike first"
      });
      return;
    }

    try {
      setReservationStatus({
        loading: true,
        success: false,
        message: "Creating your reservation..."
      });

      // Format dates for API
      const formatDatetime = (date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const payload = {
        bike_inventory_id: selectedInventory.id,
        start_datetime: formatDatetime(reservationDates.start),
        end_datetime: formatDatetime(reservationDates.end)
      };

      const response = await api.post('/reservations', payload);
      
      setReservationStatus({
        loading: false,
        success: true,
        message: "Reservation created successfully!",
        data: response.data
      });
      
      // Hide the form after successful reservation
      setTimeout(() => {
        setShowReservationForm(false);
      }, 3000);
      
    } catch (err) {
      console.error('Reservation error:', err);
      setReservationStatus({
        loading: false,
        success: false,
        message: err.message || "Failed to create reservation. Please try again."
      });
    }
  };

  // Handle book and pay submission
  const handleBookAndPaySubmit = async () => {
    if (!selectedInventory) {
      setPaymentStatus({
        loading: false,
        error: "Please select a bike first",
        message: ""
      });
      return;
    }

    try {
      setPaymentStatus({
        loading: true,
        error: null,
        message: "Creating your reservation and preparing payment..."
      });

      // Format dates for API
      const formatDatetime = (date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const payload = {
        bike_inventory_id: selectedInventory.id,
        start_datetime: formatDatetime(reservationDates.start),
        end_datetime: formatDatetime(reservationDates.end)
      };

      // Step 1: Create reservation
      const reservationResponse = await api.post('/reservations', payload);
      
      // Log the actual response for debugging
      console.log('Reservation response:', reservationResponse);
      
      // Corrected validation to match the actual API response structure
      if (!reservationResponse || !reservationResponse.data || !reservationResponse.data.id) {
        // If data.id doesn't exist, check if data.data.id exists (alternative structure)
        if (
          !reservationResponse.data || 
          !reservationResponse.data.data || 
          !reservationResponse.data.data.id
        ) {
          throw new Error("Failed to create reservation. Invalid response from server.");
        }
      }
      
      // Extract reservation ID based on where it's found in the response
      const reservationId = reservationResponse.data.id || 
                          (reservationResponse.data.data && reservationResponse.data.data.id);
      
      setPaymentStatus({
        loading: true,
        error: null,
        message: "Reservation created! Generating payment link..."
      });
      
      // Step 2: Get payment link
      const paymentLinkResponse = await api.get(`/get-payment-link/${reservationId}`);
      
      console.log('Payment link response:', paymentLinkResponse);
      
      // More flexible validation for payment link response
      let paymentUrl = null;
      if (paymentLinkResponse && paymentLinkResponse.data) {
        if (paymentLinkResponse.data.data && paymentLinkResponse.data.data.url) {
          paymentUrl = paymentLinkResponse.data.data.url;
        } else if (paymentLinkResponse.data.url) {
          paymentUrl = paymentLinkResponse.data.url;
        }
      }
      
      if (!paymentUrl) {
        throw new Error("Failed to generate payment link. Invalid response from server.");
      }
      
      setPaymentStatus({
        loading: false,
        error: null,
        message: "Redirecting to payment gateway..."
      });
      
      // Step 3: Redirect to payment page
      window.location.href = paymentUrl;
      
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus({
        loading: false,
        error: err.message || "Failed to process payment. Please try again.",
        message: ""
      });
    }
  };

  // Add calculateTotalCost function
  const calculateTotalCost = useCallback(() => {
    if (!bike || !reservationDates.start || !reservationDates.end) {
      return 0;
    }

    // Calculate duration in milliseconds
    const startTime = reservationDates.start.getTime();
    const endTime = reservationDates.end.getTime();
    const durationMs = endTime - startTime;
    
    // Convert to hours and days
    const durationHours = durationMs / (1000 * 60 * 60);
    const durationDays = durationHours / 24;
    
    // Calculate cost - if more than a day, use daily rate
    let totalCost = 0;
    
    if (durationDays >= 1) {
      // Calculate full days
      const fullDays = Math.floor(durationDays);
      const remainingHours = durationHours - (fullDays * 24);
      
      // Daily rate for full days
      totalCost += fullDays * parseFloat(bike.daily_rate);
      
      // Hourly rate for remaining hours (up to one more day)
      const hourlyTotal = remainingHours * parseFloat(bike.hourly_rate);
      const oneMoreDayRate = parseFloat(bike.daily_rate);
      
      // Use whichever is cheaper, hourly rate or another day
      totalCost += Math.min(hourlyTotal, oneMoreDayRate);
    } else {
      // Less than a day, use hourly rate
      totalCost = durationHours * parseFloat(bike.hourly_rate);
      
      // If hourly cost exceeds daily rate, cap at daily rate
      if (totalCost > parseFloat(bike.daily_rate)) {
        totalCost = parseFloat(bike.daily_rate);
      }
    }
    
    return totalCost.toFixed(2);
  }, [bike, reservationDates.start, reservationDates.end]);

  // Update the handleDateChange function to include recalculation
  const handleDateChange = (type, event) => {
    const value = event.target.value;
    const newDate = new Date(value);
    
    setReservationDates(prev => ({
      ...prev,
      [type]: newDate
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add additional debug logging before checking bike
  console.log("Before bike check:", { 
    bikeIsNull: bike === null,
    bikeIsUndefined: typeof bike === 'undefined',
    bikeType: typeof bike,
    bikeKeys: bike ? Object.keys(bike) : 'N/A',
    bikeImages: bike?.images ? `${bike.images.length} images` : 'No images'
  });

  if (!bike || (typeof bike === 'object' && Object.keys(bike).length === 0)) {
    // Try using dummy data as a fallback instead of showing not found
    console.log("Bike data was empty, using dummy data as fallback");
    if (!dummyBikeDetails) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bike Not Found</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    } else {
      // Use dummy data as fallback
      console.log("Using dummy data as fallback");
      setBike(dummyBikeDetails);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  }

  return (
    <div className="p-4">
      <div className="lg:max-w-6xl max-w-xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Bikes
        </button>

        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8">
          {/* Left column - Images */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2 w-16 max-sm:w-14 shrink-0">
                {Array.isArray(bike.images) && bike.images.length > 0 ? (
                  bike.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${bike.brand} ${bike.model} - View ${index + 1}`}
                      className={`aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 ${
                        selectedThumbnail === index ? 'border-black' : 'border-transparent'
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))
                ) : (
                  <img
                    src={`https://source.unsplash.com/800x600/?${bike.type?.toLowerCase() || 'bike'}-bike`}
                    alt={`${bike.brand} ${bike.model}`}
                    className="aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 border-black"
                  />
                )}
              </div>
              <div className="flex-1 relative">
                <img
                  src={Array.isArray(bike.images) && bike.images.length > 0 
                    ? getImageUrl(bike.images[currentImageIndex])
                    : `https://source.unsplash.com/800x600/?${bike.type?.toLowerCase() || 'bike'}-bike`}
                  alt={`${bike.brand} ${bike.model}`}
                  className="w-full aspect-[548/712] object-cover"
                />
                
                {/* Image Navigation Arrows */}
                {Array.isArray(bike.images) && bike.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 rounded-full shadow-md"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 rounded-full shadow-md"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Dots Indicator */}
                {Array.isArray(bike.images) && bike.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {bike.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setSelectedThumbnail(index);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-blue-600' : 'bg-white/70'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="w-full">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{bike.brand} {bike.model}</h3>
              <p className="text-slate-500 mt-2 text-sm">{bike.description}</p>
              <div className="flex items-center flex-wrap gap-4 mt-6">
                <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">₹{bike.daily_rate}</h4>
                <p className="text-slate-500 text-lg">
                  <span className="text-sm ml-1.5">per day (₹{bike.hourly_rate}/hour)</span>
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-lg px-2.5 bg-green-600 text-white rounded-full">
                  <p>{cumulativeRating.average}</p>
                  <svg className="w-[13px] h-[13px] fill-white" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">{cumulativeRating.count} ratings and reviews</p>
              </div>
            </div>

            <hr className="my-6 border-slate-300" />

            {/* Availability Section - Updated */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Availability</h3>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-lg text-green-600 font-medium">
                  {getAvailableInventoryItems().length} bikes available
                </p>
                
                {/* Inventory selection boxes */}
                {getAvailableInventoryItems().length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Select a bike for reservation:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {getAvailableInventoryItems().map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleInventorySelect(item)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedInventory?.id === item.id 
                              ? 'bg-blue-50 border-blue-500' 
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{item.plate_number}</span>
                            {selectedInventory?.id === item.id && (
                              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Last maintained: {new Date(item.last_maintenance_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rent Button */}
            <button
              onClick={() => setShowReservationForm(!showReservationForm)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
              disabled={!selectedInventory}
            >
              {selectedInventory ? 'Rent This Bike' : 'Select a bike to rent'}
            </button>
            
            {/* Reservation Form */}
            {showReservationForm && (
              <div className="mt-4 bg-gray-50 p-5 rounded-lg border border-gray-200 transition-all duration-500 ease-in-out overflow-hidden">
                <h3 className="text-lg font-semibold mb-4">Make a Reservation</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={reservationDates.start.toISOString().slice(0, 16)}
                      onChange={(e) => handleDateChange('start', e)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={reservationDates.end.toISOString().slice(0, 16)}
                      onChange={(e) => handleDateChange('end', e)}
                      min={reservationDates.start.toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
                
                {/* Cost Estimation */}
                {bike && (
                  <div className="bg-white p-3 rounded-md mb-4 border border-gray-200">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Estimated Cost</h4>
                    <div className="flex justify-between text-sm">
                      <span>Hourly Rate:</span>
                      <span>₹{bike.hourly_rate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Daily Rate:</span>
                      <span>₹{bike.daily_rate}</span>
                    </div>
                    
                    {reservationDates.start && reservationDates.end && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Duration:</span>
                          <span>
                            {(() => {
                              const ms = reservationDates.end.getTime() - reservationDates.start.getTime();
                              const hours = Math.floor(ms / (1000 * 60 * 60));
                              const days = Math.floor(hours / 24);
                              const remainingHours = hours % 24;
                              
                              if (days > 0) {
                                return `${days} day${days > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;
                              } else {
                                return `${hours} hour${hours > 1 ? 's' : ''}`;
                              }
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-blue-700 mt-1">
                          <span>Total Cost:</span>
                          <span>₹{calculateTotalCost()}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Status message */}
                {reservationStatus.message && (
                  <div className={`p-3 rounded-md mb-4 ${
                    reservationStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {reservationStatus.message}
                  </div>
                )}
                
                {/* Payment status message */}
                {paymentStatus.message && (
                  <div className="p-3 rounded-md mb-4 bg-blue-50 text-blue-700">
                    {paymentStatus.message}
                  </div>
                )}
                
                {paymentStatus.error && (
                  <div className="p-3 rounded-md mb-4 bg-red-50 text-red-700">
                    {paymentStatus.error}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button 
                    onClick={() => setShowReservationForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    disabled={reservationStatus.loading || paymentStatus.loading}
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReservationSubmit}
                      disabled={reservationStatus.loading || paymentStatus.loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {reservationStatus.loading ? 'Processing...' : 'Book Reservation'}
                    </button>
                    <button
                      onClick={handleBookAndPaySubmit}
                      disabled={reservationStatus.loading || paymentStatus.loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {paymentStatus.loading ? 'Processing...' : 'Book & Pay Now'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <hr className="my-6 border-slate-300" />

            {/* Reviews Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Customer Reviews</h3>
              <div className="flex items-center gap-1.5 mt-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(cumulativeRating.average) ? 'fill-blue-600' : 'fill-[#CED5D8]'}`}
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                ))}
              </div>

              <div className="flex items-center flex-wrap gap-4 mt-4">
                <h4 className="text-2xl sm:text-3xl text-slate-900 font-semibold">
                  {cumulativeRating.average} / 5
                </h4>
                <p className="text-sm text-slate-500">Based on {cumulativeRating.count} ratings</p>
              </div>

              {/* Reviews Slider */}
              {reviews.length > 0 && (
                <div className="mt-6 relative">
                  <div className="overflow-hidden">
                    <div 
                      className="transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                    >
                      <div className="flex">
                        {reviews.map((review, index) => (
                          <div 
                            key={review.id} 
                            className="w-full flex-shrink-0 flex items-start p-4 bg-gray-50 rounded-lg"
                            style={{ minWidth: '100%' }}
                          >
                            <img
                              src={`https://ui-avatars.com/api/?name=${review.user.name}&background=random`}
                              className="w-12 h-12 rounded-full border-2 border-white"
                              alt={review.user.name}
                            />
                            <div className="ml-3">
                              <h4 className="text-slate-900 text-sm font-semibold">{review.user.name}</h4>
                              <div className="flex space-x-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-[14px] h-[14px] ${star <= review.rating ? 'fill-blue-600' : 'fill-[#CED5D8]'}`}
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                  </svg>
                                ))}
                                <p className="text-xs text-slate-500 !ml-2">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {review.title && (
                                <h5 className="text-sm font-medium text-slate-800 mt-2">{review.title}</h5>
                              )}
                              <p className="text-sm text-slate-500 mt-2">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentReviewIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        onClick={() => setCurrentReviewIndex(index)}
                      />
                    ))}
                  </div>

                  {/* Navigation arrows */}
                  {reviews.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevReview}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextReview}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetails; 