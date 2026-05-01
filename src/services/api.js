import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// ✅ Har request mein token header mein add karo
api.interceptors.request.use((config) => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);

  // ✅ Admin token
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    config.headers["Authorization"] = `Bearer ${adminToken}`;
    return config;
  }

  // ✅ User token — naya
  const userToken = localStorage.getItem("userToken");
  if (userToken) {
    config.headers["Authorization"] = `Bearer ${userToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;