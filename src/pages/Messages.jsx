// src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/contact/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessage("❌ Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/contact/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== id));
      setMessage("🗑️ Message deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Failed to delete message.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading messages...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📨 Contact Messages</h2>

      {message && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded">{message}</div>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-600">No messages found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{msg.name}</td>
                  <td className="px-4 py-2">{msg.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {msg.message.length > 80
                      ? msg.message.slice(0, 80) + "..."
                      : msg.message}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
    </div>
  );
};

export default Messages;
