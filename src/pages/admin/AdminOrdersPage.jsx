// src/pages/admin/AdminOrdersPage.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  processing: { bg: "#dbeafe", color: "#1e40af" },
  shipped: { bg: "#e0f2fe", color: "#0369a1" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await adminService.getOrders();
      return res.data.data;
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: (data) => adminService.updateOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminOrders"]);
      setUpdatingId(null);
    },
  });

  const handleStatusChange = (orderId, status) => {
    setUpdatingId(orderId);
    updateStatus({ orderId, status });
  };

  // Search filter
  const orders = (data || []).filter((order) => {
    const q = search.toLowerCase();
    return (
      order.orderId?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.email?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>Orders</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            Total: {data?.length || 0} orders
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by order ID, name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", width: "300px", outline: "none" }}
        />
      </div>

      {/* Stats Row */}
      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {STATUS_OPTIONS.map((status) => {
            const count = data.filter((o) => o.status === status).length;
            const colors = STATUS_COLORS[status];
            return (
              <div key={status} style={{ background: "white", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: colors.bg, color: colors.color, marginBottom: "8px", textTransform: "capitalize" }}>
                  {status}
                </span>
                <p style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>No orders found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: "white", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6" }}>

              {/* Order Top Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6b7280" }}>Order ID</p>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#111827", fontFamily: "monospace" }}>
                    {order.orderId?.slice(-14).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6b7280" }}>Customer</p>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#111827" }}>{order.customerName}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{order.email}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6b7280" }}>Amount</p>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "16px", color: "#16a34a" }}>₹{order.amount}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6b7280" }}>Date</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#6b7280" }}>Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    disabled={updatingId === order.orderId}
                    style={{
                      padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb",
                      fontSize: "13px", fontWeight: "600", cursor: "pointer",
                      background: STATUS_COLORS[order.status]?.bg || "#f9fafb",
                      color: STATUS_COLORS[order.status]?.color || "#374151",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products */}
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "14px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0 0 8px" }}>Items:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {order.products?.map((item, idx) => (
                    <span key={idx} style={{ background: "#f3f4f6", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "#374151" }}>
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Address */}
              {order.address && (
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                    {order.address.street}, {order.address.city}, {order.address.state} — {order.address.zip}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}