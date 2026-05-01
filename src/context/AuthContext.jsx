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
    // ✅ Cross-domain cookie ke liye retry logic
    // Render → Vercel alag domains hain, cookie set hone mein
    // 1-2 requests lag jaati hain, isliye 3 baar try karo
    const tryCheck = async (attemptsLeft) => {
      try {
        const res = await api.get("/cart/auth-check");
        if (res.data.authenticated) {
          const userRes = await api.get("/payment/user/details");
          setUser(userRes.data);
        } else if (attemptsLeft > 0) {
          // ✅ 600ms ruko, phir dobara try karo
          await new Promise((r) => setTimeout(r, 600));
          return tryCheck(attemptsLeft - 1);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (attemptsLeft > 0) {
          await new Promise((r) => setTimeout(r, 600));
          return tryCheck(attemptsLeft - 1);
        }
        setUser(null);
      }
    };

    await tryCheck(3);
    setLoading(false); // ✅ Sirf ek baar — sab attempts ke baad
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
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