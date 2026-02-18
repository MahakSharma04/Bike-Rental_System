import React from 'react';
import { useNavigate } from 'react-router-dom';

const BikeCard = ({ id, image, name, price, description, category, inventory }) => {
  const navigate = useNavigate();
  
  // Use placeholder images for dummy data
  const imageUrl = `http://localhost:8000/storage/${image}`;

  const handleClick = () => {
    navigate(`/bikes/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48">
        <img 
          src={imageUrl}
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <span className="inline-block px-2 py-1 text-sm text-white bg-blue-500 rounded-full">
            {category}
          </span>
          <span className="inline-block px-2 py-1 text-sm text-white bg-green-500 rounded-full">
            {inventory} available
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-600">INR{price}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bikes/${id}/rent`);
          }}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default BikeCard; 