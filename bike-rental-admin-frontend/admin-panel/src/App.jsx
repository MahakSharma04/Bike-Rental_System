import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/DashBoard";
import Bikes from "./pages/Bikes";
import BikeInventory from "./pages/BikeInventory";
import DamageReports from "./pages/DamageReports";
import Maintenance from "./pages/Maintenance";
import Reservations from "./pages/Reservations";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";


const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes */}
      <Route path="adminLogin" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/bike-inventory" element={<BikeInventory />} />
          <Route path="/damage-reports" element={<DamageReports />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Redirect to home page if path doesn't match */}
      <Route path="*" element={<Navigate to="/adminLogin" replace />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={browserRouter} />
  );
}

export default App;
