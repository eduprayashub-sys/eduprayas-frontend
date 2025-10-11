import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  // 🚫 If no token → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  try {
    // 🔍 Decode token
    const decoded = jwtDecode(token);

    // ⏰ Auto logout if token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");
      return <Navigate to="/login" replace />;
    }

    // 👑 Admin-only access check
    if (adminOnly && decoded.email !== "eduprayashub@gmail.com") {
      alert("🚫 Access denied — Admins only.");
      return <Navigate to="/" replace />;
    }

    // ✅ Token valid → render protected component
    return children;
  } catch (error) {
    console.error("❌ Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
