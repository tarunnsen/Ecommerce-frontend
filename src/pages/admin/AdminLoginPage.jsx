// src/pages/admin/AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate: login, isPending } = useMutation({
    mutationFn: adminService.login,
    onSuccess: () => navigate("/admin/products"),
    onError: (err) => {
      setError(err?.response?.data?.message || "Invalid credentials");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    login({ email, password });
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", background: "#3b82f6", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px", fontWeight: "700", color: "white" }}>
            T
          </div>
          <h1 style={{ color: "white", fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>TechFocus Admin</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techfocus.com"
                required
                style={{ width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              style={{ width: "100%", padding: "13px", background: isPending ? "#93c5fd" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: isPending ? "not-allowed" : "pointer", transition: "background 0.2s" }}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>

        <p style={{ textAlign: "center", color: "#64748b", fontSize: "13px", marginTop: "24px" }}>
          TechFocus Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}