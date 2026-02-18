import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";
import Applayout from "./Applayout";
import BikeDetails from './components/BikeDetails';
import Reservation from './pages/Reservations';
import Profile from './pages/Profile';

const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Applayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/reservations" element={<Reservation/>} />
          <Route path="/bikes/:id" element={<BikeDetails />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more protected routes here */}
        </Route>
      </Route>

      {/* Redirect to home if path doesn't match */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={browserRouter} />
    </Provider>
  );
}

export default App;
