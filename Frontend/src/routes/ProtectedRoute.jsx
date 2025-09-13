// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; 
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
