import React, { useEffect, useState } from "react";
import api from "../api/axios";

const TestApi = () => {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await api.get("/auth/test"); // temporary test route
        setStatus(`✅ API Connected: ${res.data.message || "Success"}`);
      } catch (err) {
        console.error("API Error:", err);
        setStatus("❌ API connection failed. Check backend URL or CORS.");
      }
    };
    checkApi();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg p-8 rounded-md text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-3">
          Eduprayas API Test
        </h2>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default TestApi;
