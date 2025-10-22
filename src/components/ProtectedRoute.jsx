import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  // 🚫 No token found → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 🔍 Decode JWT
    const decoded = jwtDecode(token);

    // 🕒 Token expiration check
    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      alert("⚠️ Session expired. Please login again.");
      return <Navigate to="/login" replace />;
    }

    // 👑 Admin route protection
    const adminEmail = "eduprayashub@gmail.com"; // ✅ from your setup
    if (adminOnly && decoded.email !== adminEmail) {
      alert("🚫 Access denied — Admins only.");
      return <Navigate to="/" replace />;
    }

    // ✅ Token valid — allow access
    return children;
  } catch (err) {
    console.error("❌ Invalid token format:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
