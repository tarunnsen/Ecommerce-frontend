import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, loading, loginWithGoogle, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      sessionStorage.setItem("redirectAfterLogin", redirect);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const redirectTo = sessionStorage.getItem("redirectAfterLogin"); // ✅ no fallback "/"
      sessionStorage.removeItem("redirectAfterLogin");
      if (redirectTo) {
        navigate(redirectTo, { replace: true }); // ✅ sirf tab navigate jab redirect ho
      }
      // ✅ redirect nahi → page pe hi raho
    }
  }, [user, loading, navigate]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fc 0%, #e8edf7 100%)", display: "flex", flexDirection: "column", fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 40px", borderBottom: "1px solid #e7ebf3", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: "20px", height: "20px", color: "#0e121b" }}>
            <svg viewBox="0 0 48 48" fill="currentColor">
              <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" />
            </svg>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0e121b", margin: 0 }}>TechFocus</h2>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "white", borderRadius: "20px", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", padding: "40px 36px", display: "flex", flexDirection: "column", gap: "24px" }}>

          <div style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #306de8, #5b8ef0)", borderRadius: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 4px 16px rgba(48,109,232,0.3)" }}>
              <svg width="32" height="32" fill="white" viewBox="0 0 256 256">
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z" />
              </svg>
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0e121b", margin: "0 0 6px 0" }}>Welcome back</h1>
            <p style={{ fontSize: "14px", color: "#4e6797", margin: 0 }}>Sign in to continue shopping</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "1px", background: "#e7ebf3" }} />
            <span style={{ fontSize: "13px", color: "#4e6797", whiteSpace: "nowrap" }}>Sign in with</span>
            <div style={{ flex: 1, height: "1px", background: "#e7ebf3" }} />
          </div>

          <button
            onClick={() => loginWithGoogle()}
            style={{ width: "100%", height: "52px", background: "white", border: "2px solid #e7ebf3", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "700", color: "#0e121b", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f9fc"; e.currentTarget.style.borderColor = "#306de8"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(48,109,232,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e7ebf3"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
          >
            <svg width="22" height="22" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            Continue with Google
          </button>

          <p style={{ fontSize: "12px", color: "#4e6797", textAlign: "center", margin: 0, lineHeight: "1.5" }}>
            Protected by Google reCAPTCHA.{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span> applies.
          </p>
        </div>
      </main>
    </div>
  );
}