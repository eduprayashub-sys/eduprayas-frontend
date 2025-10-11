import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // ✅ Handle Password Update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("❌ New passwords do not match!");
      return;
    }

    try {
      await api.put(
        "/auth/update-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Password updated successfully!");
      setError("");
      setTimeout(() => setShowModal(false), 1500);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("❌ Error updating password:", err);
      setError("❌ Failed to update password. Check current password.");
      setMessage("");
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">My Profile</h2>

      <div className="space-y-4">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          {user.email === "eduprayashub@gmail.com" ? "Admin" : "Student"}
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Change Password
      </button>

      {/* 🔐 Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
              Update Password
            </h3>

            {message && <p className="text-green-600 text-center mb-2">{message}</p>}
            {error && <p className="text-red-600 text-center mb-2">{error}</p>}

            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-blue-600"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
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
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
