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
    try {
      const res = await api.get("/cart/auth-check");
      if (res.data.authenticated) {
        const userRes = await api.get("/payment/user/details");
        setUser(userRes.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ✅ FIX: Redirect URL directly backend ko pass karo via query param
  const loginWithGoogle = (redirectPath = null) => {
    const savePath = redirectPath || (window.location.pathname + window.location.search);

    const finalPath = (savePath !== "/login" && savePath !== "/users/signin")
      ? savePath
      : "/";

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google?redirect=${encodeURIComponent(finalPath)}`;
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