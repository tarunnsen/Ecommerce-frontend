// src/pages/NotFoundPage.jsx
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>

      {/* 404 Number */}
      <div style={{ fontSize: "120px", fontWeight: "800", color: "#e5e7eb", lineHeight: 1, marginBottom: "8px" }}>
        404
      </div>

      {/* Icon */}
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>

      {/* Text */}
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: "16px", color: "#6b7280", margin: "0 0 32px", maxWidth: "400px", lineHeight: "1.6" }}>
        Oops! Yeh page exist nahi karta. Shayad link galat hai ya page delete ho gaya hai.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: "12px 24px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
        >
          Go Back
        </button>
        <Link
          to="/"
          style={{ padding: "12px 24px", background: "#3b82f6", color: "white", borderRadius: "8px", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}
        >
          Back to Home
        </Link>
      </div>

    </div>
  );
}