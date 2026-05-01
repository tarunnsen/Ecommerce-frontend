// src/pages/ThankYouPage.jsx

import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await orderService.getById(orderId); // ✅ getById use kiya
      return res.data.data;
    },
    enabled: !!orderId,
  });

  const order = data?.order || data; // ✅ dono cases handle — .order ya seedha data

  // ✅ Estimated delivery — aaj se 5 din baad
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryStr = estimatedDelivery.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>

      {/* ✅ Main Card */}
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", width: "100%", maxWidth: "560px", overflow: "hidden" }}>

        {/* ✅ Green Header */}
        <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", padding: "40px 24px", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "3px solid white",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "36px", color: "white", fontWeight: "700"
          }}>
            ✓
          </div>
          <h1 style={{ color: "white", fontSize: "26px", fontWeight: "700", margin: "0 0 8px" }}>
            Order Confirmed!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", margin: 0 }}>
            Thank you for shopping with TechFocus
          </p>
        </div>

        {/* ✅ Body */}
        <div style={{ padding: "24px" }}>

          {/* Order ID + Status + Amount + Delivery */}
          <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Order ID</span>
              <span style={{ fontWeight: "600", fontSize: "13px", color: "#111827", fontFamily: "monospace" }}>
                {orderId ? orderId.slice(-12).toUpperCase() : "—"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Status</span>
              <span style={{ background: "#dcfce7", color: "#16a34a", padding: "2px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                Payment Successful
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Amount Paid</span>
              <span style={{ fontWeight: "700", color: "#16a34a", fontSize: "15px" }}>
                ₹{order?.amount || "—"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Estimated Delivery</span>
              <span style={{ fontWeight: "600", fontSize: "13px", color: "#111827" }}>
                {deliveryStr}
              </span>
            </div>

          </div>

          {/* ✅ Products List */}
          {order?.products?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>
                Items Ordered
              </h3>
              {order.products.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                      {item.name}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b7280" }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#111827" }}>
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Delivery Address */}
          {order?.address && (
            <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0 0 6px" }}>
                Delivery Address
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                {order.address.street}, {order.address.city},<br />
                {order.address.state} — {order.address.zip},<br />
                {order.address.country}
              </p>
            </div>
          )}

          {/* ✅ Email Note */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "#eff6ff", borderRadius: "8px", padding: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "18px" }}>📧</span>
            <p style={{ margin: 0, fontSize: "13px", color: "#1d4ed8", lineHeight: "1.5" }}>
              Order confirmation sent to <strong>{order?.email || "your email"}</strong>
            </p>
          </div>

          {/* ✅ Buttons */}
          <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>

            {/* ✅ Download Invoice — orderService se URL lo */}
            
              <a href={orderService.downloadInvoice(orderId)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block", textAlign: "center", padding: "13px",
                background: "#1d4ed8", color: "white", borderRadius: "8px",
                textDecoration: "none", fontWeight: "600", fontSize: "15px",
              }}
            >
              📄 Download Invoice
            </a>

            {/* Continue Shopping */}
            <Link
              to="/"
              style={{
                display: "block", textAlign: "center", padding: "13px",
                background: "#f3f4f6", color: "#374151", borderRadius: "8px",
                textDecoration: "none", fontWeight: "600", fontSize: "15px",
              }}
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </div>

      {/* Bottom note */}
      <p style={{ marginTop: "24px", color: "#9ca3af", fontSize: "13px", textAlign: "center" }}>
        Need help? Contact us at support@techfocus.com
      </p>

    </div>
  );
}