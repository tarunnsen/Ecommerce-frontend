import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminService } from "../../services/adminService";

export default function ProtectedAdminRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    adminService
      .verifyAdmin()
      .then(() => setStatus("auth"))
      .catch(() => setStatus("unauth"));
  }, []);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <p style={{ color: "#6b7280" }}>Verifying admin access...</p>
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}