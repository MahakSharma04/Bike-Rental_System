import React, { useState, useEffect } from 'react';
import BikeCard from './BikeCard';
import api from '../utils/api';

// Dummy data matching the API response format
const dummyBikes = [
  {
    id: 1,
    model: "Mountain Explorer",
    brand: "Trek",
    type: "Mountain",
    description: "Robust mountain bike for rough terrain with advanced suspension system and all-terrain tires. Perfect for adventure seekers.",
    hourly_rate: "10.00",
    daily_rate: "50.00",
    images: [
      "bikes/mountain_bike1.jpg",
      "bikes/mountain_bike2.jpg"
    ],
    available_inventory: [
      {
        id: 3,
        bike_id: 1,
        plate_number: "MTB-123",
        serial_number: "TK12345678",
        status: "available",
        last_maintenance_date: "2024-03-15"
      }
    ],
    available_count: 3
  },
  {
    id: 2,
    model: "City Cruiser",
    brand: "Giant",
    type: "City",
    description: "Comfortable city bike with upright riding position and low-maintenance components. Includes basket and lights.",
    hourly_rate: "8.00",
    daily_rate: "40.00",
    images: [
      "bikes/city_bike1.jpg",
      "bikes/city_bike2.jpg"
    ],
    available_inventory: [
      {
        id: 4,
        bike_id: 2,
        plate_number: "CTY-456",
        serial_number: "GN98765432",
        status: "available",
        last_maintenance_date: "2024-03-10"
      }
    ],
    available_count: 2
  },
  {
    id: 3,
    model: "Road Master",
    brand: "Specialized",
    type: "Road",
    description: "High-performance road bike with carbon frame and aerodynamic design. Perfect for speed enthusiasts and long rides.",
    hourly_rate: "12.00",
    daily_rate: "60.00",
    images: [
      "bikes/road_bike1.jpg",
      "bikes/road_bike2.jpg"
    ],
    available_inventory: [
      {
        id: 5,
        bike_id: 3,
        plate_number: "RD-789",
        serial_number: "SP45678901",
        status: "available",
        last_maintenance_date: "2024-03-20"
      }
    ],
    available_count: 1
  },
  {
    id: 4,
    model: "Adventure Pro",
    brand: "Cannondale",
    type: "Mountain",
    description: "Premium mountain bike with full suspension and hydraulic disc brakes. Built for challenging trails.",
    hourly_rate: "15.00",
    daily_rate: "75.00",
    images: [
      "bikes/adventure_bike1.jpg",
      "bikes/adventure_bike2.jpg"
    ],
    available_inventory: [
      {
        id: 6,
        bike_id: 4,
        plate_number: "ADV-101",
        serial_number: "CN11223344",
        status: "available",
        last_maintenance_date: "2024-03-18"
      }
    ],
    available_count: 2
  },
  {
    id: 5,
    model: "Urban Commuter",
    brand: "Scott",
    type: "City",
    description: "Practical hybrid bike perfect for daily commuting. Features integrated rack and fenders.",
    hourly_rate: "9.00",
    daily_rate: "45.00",
    images: [
      "bikes/urban_bike1.jpg",
      "bikes/urban_bike2.jpg"
    ],
    available_inventory: [
      {
        id: 7,
        bike_id: 5,
        plate_number: "URB-202",
        serial_number: "SC55667788",
        status: "available",
        last_maintenance_date: "2024-03-12"
      }
    ],
    available_count: 4
  },
  {
    id: 6,
    model: "Speed Elite",
    brand: "BMC",
    type: "Road",
    description: "Professional-grade road bike with electronic shifting and carbon wheels. Built for racing and performance.",
    hourly_rate: "18.00",
    daily_rate: "90.00",
    images: [
      "bikes/speed_bike1.jpg",
      "bikes/speed_bike2.jpg"
    ],
    available_inventory: [
      {
        id: 8,
        bike_id: 6,
        plate_number: "SPD-303",
        serial_number: "BM99887766",
        status: "available",
        last_maintenance_date: "2024-03-22"
      }
    ],
    available_count: 1
  }
];

// Dummy bike types for fallback
const dummyBikeTypes = ["Mountain", "Road", "Hybrid", "City", "Electric"];

const BikeList = () => {
  const [allBikes, setAllBikes] = useState([]); // Master copy of all bikes
  const [displayedBikes, setDisplayedBikes] = useState([]); // Filtered/sorted bikes for display
  const [bikeTypes, setBikeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [sortOrder, setSortOrder] = useState('price-low'); // Default to low to high
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBikeTypes();
    fetchBikes();
  }, []);

  useEffect(() => {
    // Apply filters, search, and sorting whenever any filter changes
    const filtered = filterAndSortBikes(allBikes, selectedType, sortOrder, searchQuery);
    setDisplayedBikes(filtered);
  }, [selectedType, sortOrder, searchQuery, allBikes]);

  const fetchBikeTypes = async () => {
    try {
      const response = await api.get('/bikes/types');
      setBikeTypes(response.data || []);
    } catch (err) {
      console.log('Using dummy bike types due to API error:', err);
      setBikeTypes(dummyBikeTypes);
    }
  };

  const fetchBikes = async () => {
    try {
      setLoading(true);

      // Get current date and time
      const startDate = new Date();
      // Add 2 days to current date for end date
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);

      // Format dates to required format (YYYY-MM-DD HH:MM:SS)
      const formatDate = (date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const params = {
        start_datetime: formatDate(startDate),
        end_datetime: formatDate(endDate)
      };

      const response = await api.get('/bikes/available?' + new URLSearchParams(params));
      setAllBikes(response.data);
      const initialBikes = filterAndSortBikes(response.data, selectedType, sortOrder, searchQuery);
      setDisplayedBikes(initialBikes);
    } catch (err) {
      console.log('Using dummy data due to API error:', err);
      setAllBikes(dummyBikes);
      const initialBikes = filterAndSortBikes(dummyBikes, selectedType, sortOrder, searchQuery);
      setDisplayedBikes(initialBikes);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBikes = (bikes, type, order, query) => {
    if (!bikes) return [];
    
    // First filter by type and search query
    let processedBikes = bikes;

    if (type) {
      processedBikes = processedBikes.filter(bike => bike.type === type);
    }

    if (query) {
      const searchTerm = query.toLowerCase();
      processedBikes = processedBikes.filter(bike => 
        bike.brand.toLowerCase().includes(searchTerm) ||
        bike.model.toLowerCase().includes(searchTerm) ||
        bike.description.toLowerCase().includes(searchTerm)
      );
    }

    // Then sort by daily rate
    return [...processedBikes].sort((a, b) => {
      const rateA = parseFloat(a.daily_rate);
      const rateB = parseFloat(b.daily_rate);
      return order === 'price-low' ? rateA - rateB : rateB - rateA;
    });
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with title and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Available Bikes</h2>
          <div className="flex items-center gap-4 flex-wrap justify-center w-full sm:w-auto pl-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 min-w-[300px]">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search bikes..."
                  className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 text-sm pr-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Type Filter */}
            <select 
              id="type-filter"
              className="px-4 py-2 border rounded-md bg-white text-gray-700 text-sm min-w-[150px]"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="">All Types</option>
              {bikeTypes.map((type) => (
                <option key={type} value={type}>
                  {type} Bikes
                </option>
              ))}
            </select>
            
            {/* Price Sort */}
            <select
              id="sort-filter"
              className="px-4 py-2 border rounded-md bg-white text-gray-700 text-sm min-w-[150px]"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="price-low">Low to High</option>
              <option value="price-high">High to Low</option>
            </select>
          </div>
        </div>

        {/* Bike Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBikes.map((bike) => (
            <BikeCard
              key={bike.id}
              id={bike.id}
              image={bike.images[0]}
              name={`${bike.brand} ${bike.model}`}
              price={bike.daily_rate}
              description={bike.description}
              category={bike.type}
              inventory={bike.available_count}
            />
          ))}
        </div>

        {displayedBikes.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            No bikes available for the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeList; 