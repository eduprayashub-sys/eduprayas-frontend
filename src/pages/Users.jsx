import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  // ✅ Fetch Users (Admin Only)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users. Admin access only.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ✅ Toggle Role
  const handleToggleRole = async (id, currentRole) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/users/toggle-role/${id}`,
        { role: currentRole === "admin" ? "student" : "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Role updated successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/users/reset-password/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🔐 Password reset email sent to user!");
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  // ✅ Search Filter
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const start = (page - 1) * perPage;
  const paginatedUsers = filteredUsers.slice(start, start + perPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        👥 Manage Users (Admin)
      </h2>

      {/* Search */}
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3 focus:outline-blue-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : paginatedUsers.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Role</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleToggleRole(user._id, user.role)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleResetPassword(user._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
