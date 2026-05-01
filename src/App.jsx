// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminAddProductPage from "./pages/admin/AdminAddProductPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductDetailPage from "./pages/admin/AdminProductDetailPage";

// Protected Routes
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>

      {/* ✅ Public Routes — koi bhi access kar sakta hai */}
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ✅ Protected User Routes — login hona zaroori hai */}
      <Route
        path="/checkout"
        element={
          <ProtectedUserRoute>
            <CheckoutPage />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/thank-you"
        element={
          <ProtectedUserRoute>
            <ThankYouPage />
          </ProtectedUserRoute>
        }
      />

      {/* ✅ Admin Routes — JWT cookie zaroori hai */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin/products" replace />} />

      <Route
        path="/admin/products"
        element={
          <ProtectedAdminRoute>
            <AdminProductsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/products/add"
        element={
          <ProtectedAdminRoute>
            <AdminAddProductPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedAdminRoute>
            <AdminOrdersPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/product/:id"
        element={
          <ProtectedAdminRoute>
            <AdminProductDetailPage />
          </ProtectedAdminRoute>
        }
      />

      {/* ✅ 404 — Sabse last mein */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default App;