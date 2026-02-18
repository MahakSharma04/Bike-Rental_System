import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Bike, 
  Package, 
  AlertTriangle, 
  Wrench, 
  Calendar, 
  CreditCard,
  ChevronRight,
  LogOut,
  UserCircle
} from "lucide-react";

const SideBar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    // { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Bikes", path: "/bikes", icon: <Bike size={20} /> },
    { name: "Bike Inventory", path: "/bike-inventory", icon: <Package size={20} /> },
    { name: "Damage Reports", path: "/damage-reports", icon: <AlertTriangle size={20} /> },
    { name: "Maintenance", path: "/maintenance", icon: <Wrench size={20} /> },
    { name: "Reservations", path: "/reservations", icon: <Calendar size={20} /> },
    { name: "Payments", path: "/payments", icon: <CreditCard size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/adminLogin";
  };

  return (
    <div 
      className={`h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold">Bike Rental</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded hover:bg-gray-700"
        >
          <ChevronRight 
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`} 
            size={20} 
          />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="flex items-center justify-center min-w-8">
                  {item.icon}
                </span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/profile"
          className={`flex items-center p-2 rounded-lg mb-2 ${
            location.pathname === "/profile"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="flex items-center justify-center min-w-8">
            <UserCircle size={20} />
          </span>
          {!collapsed && <span className="ml-3">Profile</span>}
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center p-2 rounded-lg w-full hover:bg-gray-700"
        >
          <span className="flex items-center justify-center min-w-8">
            <LogOut size={20} />
          </span>
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SideBar;


