import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const redirect = params.get("redirect") || "/";

    if (token) {
      // ✅ Step 1 — Token save karo
      localStorage.setItem("userToken", token);

      // ✅ Step 2 — User set karo
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          _id: payload.id,
          email: payload.email,
          name: payload.name,
        });
        console.log("✅ Token saved, user set:", payload.name);
      } catch (err) {
        console.log("💥 Token parse error:", err.message);
        navigate("/login", { replace: true });
        return;
      }

      // ✅ Step 3 — 300ms wait karo phir navigate
      // Race condition fix — token save hone ka time dena zaroori hai
      setTimeout(() => {
        navigate(decodeURIComponent(redirect), { replace: true });
      }, 300);

    } else {
      console.log("❌ No token in URL");
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "80px", fontSize: "18px" }}>
      Logging you in...
    </div>
  );
}