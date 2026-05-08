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

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("userToken");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        _id: payload.id,
        email: payload.email,
        name: payload.name,
      });
    } catch (err) {
      localStorage.removeItem("userToken");
      setUser(null);
    }

    setLoading(false);
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("userToken");
      setUser(null);
    }
  };

  const loginWithGoogle = () => {
    const savedPath = sessionStorage.getItem("redirectAfterLogin") || "/";
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