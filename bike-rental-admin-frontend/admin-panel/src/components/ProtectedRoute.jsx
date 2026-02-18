import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const authToken = localStorage?.getItem('authToken');
  
  
  if (authToken===null) {
    return <Navigate to="/adminLogin" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute; 