import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check if the user is authenticated
  if (!token) {
    return <Navigate to="/" />;
  }

  // Check if the user is authorized to access the admin dashboard
  if (role.toLowerCase() !== "admin" && window.location.pathname === "/admin-dashboard") {
    return <Navigate to="/home" />;
  }

  return children;
};

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
  
  );
}

export default App;
