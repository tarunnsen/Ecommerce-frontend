import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import CartDrawer from "./components/CartDrawer";

import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthCallback from "./pages/AuthCallback";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminAddProductPage from "./pages/admin/AdminAddProductPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductDetailPage from "./pages/admin/AdminProductDetailPage";

import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

function App() {
  const { loading } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage onCartOpen={() => setCartOpen(true)} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/checkout" element={<ProtectedUserRoute><CheckoutPage /></ProtectedUserRoute>} />
        <Route path="/thank-you" element={<ProtectedUserRoute><ThankYouPage /></ProtectedUserRoute>} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProductsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/products/add" element={<ProtectedAdminRoute><AdminAddProductPage /></ProtectedAdminRoute>} />
        <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrdersPage /></ProtectedAdminRoute>} />
        <Route path="/admin/product/:id" element={<ProtectedAdminRoute><AdminProductDetailPage /></ProtectedAdminRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default App;