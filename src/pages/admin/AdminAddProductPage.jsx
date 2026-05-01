// src/pages/admin/AdminAddProductPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Navy", "Olive", "Gray"];
const MATERIALS = ["100% Cotton", "Cotton Terry", "Cotton Blend"];
const CATEGORIES = ["Men", "Women", "Beauty", "Unisex"];

export default function AdminAddProductPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: (formData) => adminService.createProduct(formData),
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Product create karne mein error aaya");
    },
  });

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const formData = new FormData(form);

    // ✅ Sizes aur Colors manually append karo
    selectedSizes.forEach((s) => formData.append("sizes", s));
    selectedColors.forEach((c) => formData.append("colors", c));

    createProduct(formData);
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>Add New Product</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Fill in the details to add a new product</p>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", color: "#16a34a", fontWeight: "600" }}>
            Product successfully added! Redirecting...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", color: "#dc2626" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Basic Info */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  Basic Information
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Product Name *</label>
                    <input name="productName" required placeholder="e.g. Classic Cotton T-Shirt" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>SKU *</label>
                    <input name="sku" required placeholder="e.g. TCF-001" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select name="category" required style={inputStyle}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Description</label>
                    <textarea name="description" rows={3} placeholder="Product description..." style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  Pricing & Stock
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Price (₹) *</label>
                    <input name="price" type="number" required min="1" placeholder="499" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Discount Price (₹)</label>
                    <input name="discountPrice" type="number" min="0" placeholder="399" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Stock Quantity *</label>
                    <input name="stockQuantity" type="number" required min="1" placeholder="100" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  Sizes & Colors
                </h3>

                <label style={labelStyle}>Available Sizes *</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: "8px 20px", borderRadius: "6px", border: "2px solid",
                        borderColor: selectedSizes.includes(size) ? "#3b82f6" : "#e5e7eb",
                        background: selectedSizes.includes(size) ? "#eff6ff" : "white",
                        color: selectedSizes.includes(size) ? "#3b82f6" : "#374151",
                        fontWeight: "600", cursor: "pointer", fontSize: "14px",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <label style={labelStyle}>Colors *</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      style={{
                        padding: "8px 16px", borderRadius: "6px", border: "2px solid",
                        borderColor: selectedColors.includes(color) ? "#3b82f6" : "#e5e7eb",
                        background: selectedColors.includes(color) ? "#eff6ff" : "white",
                        color: selectedColors.includes(color) ? "#3b82f6" : "#374151",
                        fontWeight: "500", cursor: "pointer", fontSize: "14px",
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  Material & Fabric
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Material *</label>
                    <select name="material" required style={inputStyle}>
                      <option value="">Select Material</option>
                      {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>GSM *</label>
                    <input name="gsm" type="number" required min="100" placeholder="180" style={inputStyle} />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Image Upload */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  Product Images
                </h3>
                <div style={{ border: "2px dashed #d1d5db", borderRadius: "8px", padding: "32px 16px", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📸</div>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 12px" }}>Upload up to 8 images</p>
                  <input
                    type="file"
                    name="productImages"
                    multiple
                    accept="image/*"
                    style={{ fontSize: "13px", color: "#374151" }}
                  />
                </div>
              </div>

              {/* Submit */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{ width: "100%", padding: "14px", background: isPending ? "#93c5fd" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: isPending ? "not-allowed" : "pointer" }}
                >
                  {isPending ? "Adding Product..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  style={{ width: "100%", marginTop: "10px", padding: "12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", outline: "none", color: "#111827" };