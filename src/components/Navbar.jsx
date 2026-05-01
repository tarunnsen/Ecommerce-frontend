import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] || "";

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/users/signin");
  };

  return (
    <>
      <header className="flex items-center justify-between border-b px-4 md:px-10 py-3">

        {/* LOGO */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 className="text-lg font-bold text-[#0e121b] whitespace-nowrap">TechFocus</h2>
        </Link>

        {/* DESKTOP NAV — sirf laptop pe dikhega */}
        <div className="hidden md:flex items-center gap-9">
          <a href="#" className="text-sm font-medium text-[#0e121b]">Women</a>
          <a href="#" className="text-sm font-medium text-[#0e121b]">Men</a>
          <Link to="/" className="text-sm font-medium text-[#0e121b]" style={{ textDecoration: "none" }}>Home</Link>
          <a href="#" className="text-sm font-medium text-[#0e121b]">Beauty</a>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-2 items-center">

          {/* ✅ Auth buttons — sirf desktop pe — mobile pe nahi */}
          {user ? (
            <>
              <span className="text-sm font-medium text-[#0e121b] hidden md:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="hidden md:flex h-9 px-3 rounded-xl bg-[#e7ebf3] text-sm font-bold items-center whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/users/signin"
              className="hidden md:flex h-9 px-3 rounded-xl bg-[#e7ebf3] text-sm font-bold items-center whitespace-nowrap"
              style={{ textDecoration: "none" }}
            >
              Sign in
            </Link>
          )}

          {/* Cart — hamesha dikhega */}
          <button
            onClick={() => setCartOpen(true)}
            className="h-9 px-2.5 rounded-xl bg-[#e7ebf3] text-sm font-bold flex items-center"
          >
            🛍️
          </button>

          {/* Hamburger — sirf mobile pe */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-600 focus:outline-none text-xl ml-1"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN — sirf mobile pe */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col items-center bg-white border-b py-2 shadow-md">
          <a href="#" className="text-sm font-medium py-2">Women</a>
          <a href="#" className="text-sm font-medium py-2">Men</a>
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium py-2"
            style={{ textDecoration: "none" }}
          >
            Home
          </Link>
          <a href="#" className="text-sm font-medium py-2">Beauty</a>

          {/* ✅ Mobile mein naam + logout */}
          {user ? (
            <>
              <span className="text-sm font-medium py-1 text-gray-500">
                Hi, {firstName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium py-2 text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/users/signin"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium py-2"
            >
              Sign in
            </Link>
          )}
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}