// src/services/api.js — FULL FILE

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);

  // ✅ FIX: Admin routes pe SIRF adminToken lagao
  const isAdminRoute = config.url?.startsWith("/admin");

  if (isAdminRoute) {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
    }
  } else {
    // ✅ Baaki sab routes pe SIRF userToken lagao
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      config.headers["Authorization"] = `Bearer ${userToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;