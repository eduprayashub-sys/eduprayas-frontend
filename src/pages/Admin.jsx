import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Tests from "./Tests";
import Questions from "./Questions";
import Results from "./Results";
import Profile from "./Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import api from "../api/axios";
import Messages from "./Messages";


const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Check authentication token
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  // ✅ Verify admin role from backend
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.email !== "eduprayashub@gmail.com") {
          alert("Access denied! Admins only.");
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Admin verification failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyAdmin();
  }, [navigate, token]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 📘 Sidebar (Collapsible for mobile) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* 📗 Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Tests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Questions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Results />
                </ProtectedRoute>
              }
            />

            <Route
  path="/messages"
  element={
    <ProtectedRoute adminOnly={true}>
      <Messages />
    </ProtectedRoute>
  }
/>

            <Route path="/profile" element={<Profile />} />
            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
