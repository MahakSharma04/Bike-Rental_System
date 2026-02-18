import React from "react";

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bike Rental Dashboard</h1>
                <div className="text-sm text-gray-500">Welcome, Admin</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Total Bikes</h2>
                    <p className="text-3xl font-bold text-blue-600">24</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Active Rentals</h2>
                    <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Pending Maintenance</h2>
                    <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Reservations</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">#1234</td>
                                <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                                <td className="px-6 py-4 whitespace-nowrap">Mountain Bike XL</td>
                                <td className="px-6 py-4 whitespace-nowrap">2023-05-15</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Active</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">#1235</td>
                                <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                                <td className="px-6 py-4 whitespace-nowrap">City Bike M</td>
                                <td className="px-6 py-4 whitespace-nowrap">2023-05-16</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Reserved</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;