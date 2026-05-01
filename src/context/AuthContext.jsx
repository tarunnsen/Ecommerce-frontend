import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("userToken");
    console.log("🔑 [checkAuth] userToken:", token ? "EXISTS" : "NULL"); // ← LOG 1

    if (!token) {
      console.log("❌ [checkAuth] No token — user = null");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("📦 [checkAuth] payload:", payload); // ← LOG 2

      if (payload.exp * 1000 < Date.now()) {
        console.log("⏰ [checkAuth] Token expired!");
        localStorage.removeItem("userToken");
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = {
        _id: payload.id,
        email: payload.email,
        name: payload.name,
      };
      console.log("✅ [checkAuth] User set:", userData); // ← LOG 3
      setUser(userData);

    } catch (err) {
      console.log("💥 [checkAuth] Error:", err.message); // ← LOG 4
      localStorage.removeItem("userToken");
      setUser(null);
    }

    setLoading(false);
  };

  const logout = async () => {
    console.log("🚪 [logout] called"); // ← LOG 5
    try {
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("userToken"); // ✅ logout pe token bhi hatao
      setUser(null);
    }
  };

  const loginWithGoogle = () => {
    const savedPath = sessionStorage.getItem("redirectAfterLogin") || "/";
    console.log("🔗 [loginWithGoogle] redirecting with savedPath:", savedPath); // ← LOG 6
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google?redirect=${encodeURIComponent(savedPath)}`;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, loginWithGoogle, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}