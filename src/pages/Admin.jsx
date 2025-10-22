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
import Messages from "./Messages";
import api from "../api/axios";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Check authentication token
  const token = localStorage.getItem("token");

  useEffect(() => {
    // If no token → redirect immediately
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 👑 Admin email check
        if (res.data.email !== "eduprayashub@gmail.com") {
          alert("🚫 Access denied — Admins only.");
          navigate("/");
        }
      } catch (err) {
        console.error("❌ Admin verification failed:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-blue-600">
        🔄 Verifying Admin Access...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 📘 Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* 📗 Main Content Area */}
      <div className="flex flex-col flex-1">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

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
