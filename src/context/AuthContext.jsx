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
    const tryCheck = async (attemptsLeft) => {
      try {
        const res = await api.get("/cart/auth-check");
        if (res.data.authenticated) {
          const userRes = await api.get("/payment/user/details");
          setUser(userRes.data);
        } else if (attemptsLeft > 0) {
          await new Promise((r) => setTimeout(r, 1000)); // ✅ 600 → 1000ms
          return tryCheck(attemptsLeft - 1);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (attemptsLeft > 0) {
          await new Promise((r) => setTimeout(r, 1000)); // ✅ 600 → 1000ms
          return tryCheck(attemptsLeft - 1);
        }
        setUser(null);
      }
    };

    await tryCheck(5); // ✅ 3 → 5 attempts
    setLoading(false);
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
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