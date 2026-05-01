// src/components/admin/AdminLayout.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";

export default function AdminLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { mutate: logout } = useMutation({
        mutationFn: adminService.logout,
        onSuccess: () => {
            localStorage.removeItem("adminToken"); // ✅ Token clear karo
            navigate("/admin/login");
        },
    });

    const navLinks = [
        { to: "/admin/products", label: "Products" },
        { to: "/admin/orders", label: "Orders" },
        { to: "/admin/products/add", label: "+ Add Product" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", flexDirection: "column" }}>

            {/* ✅ Navbar */}
            <header style={{ background: "#111827", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

                    {/* Logo */}
                    <Link to="/admin/products" style={{ textDecoration: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "32px", height: "32px", background: "#3b82f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "16px" }}>
                                T
                            </div>
                            <span style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>TechFocus Admin</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hidden-mobile">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                style={{
                                    padding: "8px 16px", borderRadius: "6px", textDecoration: "none",
                                    fontSize: "14px", fontWeight: "500",
                                    background: isActive(link.to) ? "#3b82f6" : "transparent",
                                    color: isActive(link.to) ? "white" : "#d1d5db",
                                    transition: "all 0.2s",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Admin Avatar + Logout */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "16px", paddingLeft: "16px", borderLeft: "1px solid #374151" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>
                                    A
                                </div>
                                <span style={{ color: "#d1d5db", fontSize: "14px" }}>Admin</span>
                            </div>
                            <button
                                onClick={() => logout()}
                                style={{ padding: "6px 14px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
                            >
                                Logout
                            </button>
                        </div>
                    </nav>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "24px", display: "none" }}
                        className="show-mobile"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div style={{ background: "#1f2937", padding: "16px 24px", borderTop: "1px solid #374151" }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                style={{ display: "block", padding: "10px 0", color: "#d1d5db", textDecoration: "none", fontSize: "15px", borderBottom: "1px solid #374151" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => logout()}
                            style={{ marginTop: "12px", width: "100%", padding: "10px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main style={{ flex: 1, maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "32px 24px" }}>
                {children}
            </main>

        </div>
    );
}