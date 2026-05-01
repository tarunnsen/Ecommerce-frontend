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
      // ✅ Token localStorage mein save karo
      localStorage.setItem("userToken", token);

      // ✅ Token se user info nikalo
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        _id: payload.id,
        email: payload.email,
        name: payload.name,
      });

      // ✅ Sahi page pe bhejo
      navigate(decodeURIComponent(redirect), { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "80px", fontSize: "18px" }}>
      Logging you in...
    </div>
  );
}