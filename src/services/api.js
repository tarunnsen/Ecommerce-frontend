// src/services/api.js — FULL FILE

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
  
  // ✅ NAYA LOG ADD KARO
  const userToken = localStorage.getItem("userToken");
  console.log("🔑 userToken in interceptor:", userToken ? "EXISTS: " + userToken.substring(0, 20) : "NULL ❌");

  const isAdminRoute = config.url?.startsWith("/admin");

  if (isAdminRoute) {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
    }
  } else {
    if (userToken) {
      config.headers["Authorization"] = `Bearer ${userToken}`;
    }
  }

  console.log("📤 Auth header:", config.headers["Authorization"] ? "SET ✅" : "NOT SET ❌");

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;