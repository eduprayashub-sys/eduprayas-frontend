import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("❌ New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        "/auth/update-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Password updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Error updating password:", err);
      setError("❌ Failed to update password. Check your current password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          🔐 Update Password
        </h2>

        {message && (
          <p className="text-green-600 text-center mb-2 font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-2 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-600"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-600"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
