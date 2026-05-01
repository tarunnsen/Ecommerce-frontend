// src/pages/admin/AdminProductDetailPage.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  processing: { bg: "#dbeafe", color: "#1e40af" },
  shipped: { bg: "#e0f2fe", color: "#0369a1" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

export default function AdminProductDetailPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminProduct", id],
    queryFn: async () => {
      const res = await adminService.getProductById(id);
      return res.data.data; // { product, orders }
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
          Loading product details...
        </div>
      </AdminLayout>
    );
  }

  if (isError || !data?.product) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px", color: "#dc2626" }}>
          Product not found.
        </div>
      </AdminLayout>
    );
  }

  const { product, orders } = data;

  // Total revenue calculate karo sirf is product ke liye
  const totalRevenue = orders.reduce((sum, order) => {
    const item = order.products?.find(
      (p) => p.productId?.toString() === product._id?.toString()
    );
    return sum + (item ? item.price * item.quantity : 0);
  }, 0);

  const totalQtySold = orders.reduce((sum, order) => {
    const item = order.products?.find(
      (p) => p.productId?.toString() === product._id?.toString()
    );
    return sum + (item ? item.quantity : 0);
  }, 0);

  return (
    <AdminLayout>

      {/* ✅ Product Overview Card */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", alignItems: "start" }}>

          {/* Image */}
          <img
            src={product.images?.[0] || "/images/default.jpg"}
            alt={product.name}
            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
          />

          {/* Info */}
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
              {product.name}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 16px" }}>
              {product.description || "No description"}
            </p>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              {product.discountPrice ? (
                <>
                  <span style={{ fontSize: "22px", fontWeight: "700", color: "#16a34a" }}>₹{product.discountPrice}</span>
                  <span style={{ fontSize: "16px", color: "#9ca3af", textDecoration: "line-through" }}>₹{product.price}</span>
                </>
              ) : (
                <span style={{ fontSize: "22px", fontWeight: "700", color: "#111827" }}>₹{product.price}</span>
              )}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                Stock: {product.stock}
              </span>
              <span style={{ background: "#f3f4f6", color: "#374151", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                SKU: {product.sku}
              </span>
              <span style={{ background: "#f3f4f6", color: "#374151", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                {product.material}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Orders", value: orders.length, bg: "#eff6ff", color: "#3b82f6" },
          { label: "Units Sold", value: totalQtySold, bg: "#f0fdf4", color: "#16a34a" },
          { label: "Total Revenue", value: `₹${totalRevenue}`, bg: "#fef9c3", color: "#854d0e" },
          { label: "Current Stock", value: product.stock, bg: "#faf5ff", color: "#7c3aed" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px" }}>{stat.label}</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ✅ Orders Table */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 20px" }}>
          Customer Orders
        </h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>📦</p>
            <p>Is product ka abhi koi order nahi hai.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                  {["Order ID", "Customer", "Email", "Phone", "Address", "Qty", "Amount", "Date", "Status"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#374151", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const item = order.products?.find(
                    (p) => p.productId?.toString() === product._id?.toString()
                  );
                  if (!item) return null;

                  const statusStyle = STATUS_COLORS[order.status] || { bg: "#f3f4f6", color: "#374151" };

                  return (
                    <tr key={order._id} style={{ borderBottom: "1px solid #f3f4f6" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                    >
                      <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "12px", color: "#374151", whiteSpace: "nowrap" }}>
                        {order.orderId?.slice(-10).toUpperCase()}
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap" }}>
                        {order.customerName}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                        {order.email}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {order.phone}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>
                        {order.address?.street}, {order.address?.city}, {order.address?.state} — {order.address?.zip}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: "600", color: "#111827" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: "700", color: "#16a34a", whiteSpace: "nowrap" }}>
                        ₹{item.price * item.quantity}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize", whiteSpace: "nowrap" }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </AdminLayout>
  );
}