import axios from "axios";

// 🌐 Create a reusable axios instance for the entire app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002", // Backend base URL
  withCredentials: false, // Change to true only if backend needs cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Add interceptors for attaching token & handling errors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
