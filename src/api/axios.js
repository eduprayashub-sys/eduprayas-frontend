import axios from "axios";

// Create a reusable axios instance for the entire app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5002", // Backend URL
    withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors (for auth tokens, error handling, etc.)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // If using JWT login
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
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
