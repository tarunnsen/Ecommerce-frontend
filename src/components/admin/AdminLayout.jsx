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
      localStorage.removeItem("adminToken");
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
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ✅ NAVBAR */}
      <header className="bg-[#0e121b] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">

          {/* Logo — same style as user Navbar */}
          <Link to="/admin/products" style={{ textDecoration: "none" }}>
            <h2 className="text-lg font-bold text-white whitespace-nowrap">
              TechFocus Admin
            </h2>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{ textDecoration: "none" }}
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                  isActive(link.to)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider + Admin + Logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
              <span className="text-sm text-gray-400 hidden md:inline">Admin</span>
              <button
                onClick={() => logout()}
                className="h-9 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center whitespace-nowrap transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* HAMBURGER — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 focus:outline-none text-xl ml-1"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-[#111827] border-b border-gray-700 py-2 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{ textDecoration: "none" }}
              className={`text-sm font-medium py-2 w-full text-center border-b border-gray-700 ${
                isActive(link.to)
                  ? "text-blue-400 bg-gray-800"
                  : "text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin label + Logout */}
          <span className="text-sm font-medium py-1 text-gray-500 mt-1">
            Admin
          </span>
          <button
            onClick={() => logout()}
            className="text-sm font-medium py-2 text-red-400"
          >
            Logout
          </button>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-10 py-8">
        {children}
      </main>

    </div>
  );
}