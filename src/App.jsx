import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tests from "./pages/Tests";
import AttemptTest from "./pages/AttemptTest";
import Questions from "./pages/Questions";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";




const App = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      ) : (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Topbar />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="p-6 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/users" element={<Users />} />
                  <Route
                    path="/tests"
                    element={
                      <ProtectedRoute>
                        <Tests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test/:id"
                    element={
                      <ProtectedRoute>
                        <AttemptTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/questions" element={<Questions />} />
                  <Route
                    path="/results"
                    element={
                      <ProtectedRoute>
                        <Results />
                      </ProtectedRoute>
                    }
                  />
                   {/* 👤 Profile Page */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
