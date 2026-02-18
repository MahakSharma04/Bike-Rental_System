import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

const BikeDetailsModal = ({ bike, onClose }) => {
  if (!bike) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] flex items-center justify-center" style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, marginLeft: 0, marginRight: 0 }}>
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full max-w-3xl mx-auto shadow-xl z-10 overflow-hidden" style={{ width: "85%", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Bike Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bike images */}
            <div>
              {bike.images && bike.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={bike.images[0].startsWith('http') ? bike.images[0] : `http://localhost:8000/storage/${bike.images[0]}`} 
                      alt={bike.model} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  {bike.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {bike.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image.startsWith('http') ? image : `http://localhost:8000/storage/${image}`} 
                            alt={`${bike.model} ${index + 2}`} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto" />
                    <p className="mt-2">No images available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bike details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{bike.model}</h2>
                <p className="text-sm text-gray-500">{bike.brand} • {bike.type}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                    <p className="text-lg font-semibold text-gray-900">₹{parseFloat(bike.hourly_rate).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Daily Rate</p>
                    <p className="text-lg font-semibold text-gray-900">₹{parseFloat(bike.daily_rate).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {bike.description || 'No description available.'}
                </p>
              </div>
              
              {/* Show inventory items if available */}
              {bike.inventoryItems && bike.inventoryItems.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Inventory Items</p>
                  <div className="bg-gray-50 rounded-md p-2 max-h-48 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate #</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial #</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bike.inventoryItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{item.plate_number}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{item.serial_number}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                                  item.status === 'rented' ? 'bg-blue-100 text-blue-800' : 
                                  item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Added on</p>
                    <p className="text-sm text-gray-700">
                      {new Date(bike.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {bike.updated_at && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-700">
                        {new Date(bike.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BikeDetailsModal; 