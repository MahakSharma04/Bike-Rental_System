import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import Carousel from '../components/Carousel';
import BikeList from '../components/BikeList';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel />
      <BikeList />
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-50 p-6">
  //     <div className="max-w-7xl mx-auto">
  //       <div className="flex justify-between items-center mb-8">
  //         <h1 className="text-3xl font-bold text-gray-800">Bike Rental System</h1>
  //         <button
  //           onClick={handleLogout}
  //           className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
  //         >
  //           Logout
  //         </button>
  //       </div>
        
  //       <div className="bg-white p-6 rounded-lg shadow-md">
  //         <h2 className="text-2xl font-bold mb-4">Welcome to the Bike Rental System</h2>
  //         <p className="text-gray-700">
  //           This is a protected page that only authenticated users can see. You are now logged in!
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Home; 