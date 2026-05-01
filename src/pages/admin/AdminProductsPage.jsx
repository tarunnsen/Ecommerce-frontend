// src/pages/admin/AdminProductsPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const res = await adminService.getProducts();
      return res.data.data; // { Men: [...], Women: [...] }
    },
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProducts"]);
      setDeletingId(null);
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" delete karna chahte ho?`)) {
      setDeletingId(id);
      deleteProduct(id);
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>Products</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/add"
          style={{ padding: "10px 20px", background: "#3b82f6", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}
        >
          + Add New Product
        </Link>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading products...</div>
      ) : !data || Object.keys(data).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>No products found.</div>
      ) : (
        Object.keys(data).map((category) => (
          <div key={category} style={{ marginBottom: "40px" }}>

            {/* Category Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: 0 }}>{category}</h2>
              <span style={{ background: "#e5e7eb", color: "#374151", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                {data[category].length} items
              </span>
            </div>

            {/* Products Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {data[category].map((product) => (
                <div
                  key={product._id}
                  style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden", border: "1px solid #f3f4f6", transition: "box-shadow 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"}
                >
                  {/* Product Image */}
                  <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#f9fafb" }}>
                    <img
                      src={product.images?.[0] || "/images/default.jpg"}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* Stock Badge */}
                    <div style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: product.stock > 0 ? "#dcfce7" : "#fee2e2",
                      color: product.stock > 0 ? "#16a34a" : "#dc2626",
                      padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600"
                    }}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {product.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      {product.discountPrice ? (
                        <>
                          <span style={{ fontSize: "16px", fontWeight: "700", color: "#16a34a" }}>₹{product.discountPrice}</span>
                          <span style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through" }}>₹{product.price}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>₹{product.price}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to={`/admin/product/${product._id}`}
                        style={{ flex: 1, textAlign: "center", padding: "8px", background: "#eff6ff", color: "#3b82f6", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}
                      >
                        View Orders
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deletingId === product._id}
                        style={{ flex: 1, padding: "8px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                      >
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}