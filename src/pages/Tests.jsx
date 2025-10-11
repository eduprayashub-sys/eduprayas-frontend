import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    duration: "",
    totalMarks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch all tests
  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/tests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data);
    } catch (err) {
      console.error("❌ Error fetching tests:", err);
      setMessage("❌ Failed to load tests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add / Update test
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await api.put(`/tests/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Test updated successfully!");
      } else {
        await api.post("/tests", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ New test added successfully!");
      }

      setForm({ title: "", category: "", duration: "", totalMarks: "" });
      setEditingId(null);
      setShowModal(false);
      fetchTests();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error saving test:", err);
      setMessage("❌ Failed to save test.");
    }
  };

  // ✅ Edit Test
  const handleEdit = (test) => {
    setEditingId(test._id);
    setForm({
      title: test.title,
      category: test.category,
      duration: test.duration,
      totalMarks: test.totalMarks,
    });
    setShowModal(true);
  };

  // ✅ Delete Test
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Test deleted successfully!");
      fetchTests();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting test:", err);
      setMessage("❌ Failed to delete test.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">🧾 Tests Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Test
        </button>
      </div>

      {message && (
        <div className="mb-4 text-center text-white bg-blue-500 py-2 rounded-md shadow">
          {message}
        </div>
      )}

      {/* ✅ Table Display */}
      {loading ? (
        <p className="text-gray-600">Loading tests...</p>
      ) : tests.length === 0 ? (
        <p className="text-gray-600">No tests found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4 text-center">Marks</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr
                  key={test._id}
                  className="border-t hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="py-3 px-4">{test.title}</td>
                  <td className="py-3 px-4">{test.category}</td>
                  <td className="py-3 px-4 text-center">{test.duration} min</td>
                  <td className="py-3 px-4 text-center">{test.totalMarks}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
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

      {/* ✅ Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              {editingId ? "✏️ Edit Test" : "➕ Add New Test"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Test Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-blue-400"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-blue-400"
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (in minutes)"
                value={form.duration}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-blue-400"
                required
              />
              <input
                type="number"
                name="totalMarks"
                placeholder="Total Marks"
                value={form.totalMarks}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-blue-400"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setForm({
                      title: "",
                      category: "",
                      duration: "",
                      totalMarks: "",
                    });
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
