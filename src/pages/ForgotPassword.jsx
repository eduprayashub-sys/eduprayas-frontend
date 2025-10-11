import React, { useState } from "react";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // ✅ API request using your centralized axios instance
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "✅ Reset link sent successfully!");
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      setMessage("❌ Error sending reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email to receive a reset link.
        </p>

        {message && (
          <p className="text-center text-green-600 mb-4 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
