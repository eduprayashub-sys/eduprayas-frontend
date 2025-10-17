import axios from "axios";

// 🌍 Create a reusable axios instance for all API requests
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://eduprayas-backend.onrender.com/api",
  withCredentials: false, // ✅ Keep false unless backend uses cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Request Interceptor — Add JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor — Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);

    // Optional auto-logout on token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
