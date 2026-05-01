// src/pages/CheckoutPage.jsx

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Buy Now → ?productId=xxx, Cart → no param
  const productId = searchParams.get("productId");
  const checkoutId = productId || "cart";

  // ✅ Form state
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Checkout data fetch
  const { data, isLoading, isError } = useQuery({
    queryKey: ["checkout", checkoutId],
    queryFn: async () => {
      const res = await paymentService.getCheckout(checkoutId);
      return res.data.data; // { user, cart, product }
    },
  });

  // ✅ Create Razorpay Order
  const { mutate: createOrder } = useMutation({
    mutationFn: (orderData) => paymentService.createOrder(orderData),
    onSuccess: (res) => {
      const { orderId, amount } = res.data;
      openRazorpay(orderId, amount);
    },
    onError: () => {
      alert("Failed to initiate payment. Try again!");
      setIsProcessing(false);
    },
  });

  // ✅ Razorpay window open karna
  const openRazorpay = (orderId, amount) => {
    const options = {
      key: "rzp_test_sGIEiXT78mGZgu",
      amount: amount,
      currency: "INR",
      name: "TechFocus",
      description: "Test Transaction",
      order_id: orderId,
      handler: async function (paymentResponse) {
        try {
          const verifyRes = await paymentService.verifyPayment({
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            signature: paymentResponse.razorpay_signature,
          });
          // ✅ Backend redirectUrl pe navigate karo
          const redirectUrl = verifyRes.data.redirectUrl;
          navigate(redirectUrl.replace("http://localhost:3000", ""));
        } catch {
          alert("Payment verification failed!");
          setIsProcessing(false);
        }
      },
      prefill: {
        name: data?.user?.name || "",
        email: data?.user?.email || "",
        contact: phone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setIsProcessing(false);
  };

  // ✅ Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!phone || !street || !city || !state || !zip || !country) {
      alert("Please fill all address fields!");
      return;
    }

    setIsProcessing(true);

    // ✅ Items aur total calculate karo
    const items = data.cart.products.filter((item) => item.productId !== null);

    const products = items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.discountPrice || item.productId.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + (item.productId.discountPrice || item.productId.price) * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      alert("Total amount must be greater than 0!");
      setIsProcessing(false);
      return;
    }

    const orderData = {
      name: data.user.name,
      email: data.user.email,
      phone,
      address: { street, city, state, zip, country },
      products,
      totalAmount,
    };

    createOrder(orderData);
  };

  // ✅ Loading / Error states
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "red" }}>Something went wrong. Please try again.</p>
      </div>
    );
  }

  const items = (data?.cart?.products || []).filter((item) => item.productId !== null);
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + (item.productId.discountPrice || item.productId.price) * item.quantity,
    0
  );

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "768px" }}>
        
        <h2 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "24px" }}>
          Checkout
        </h2>

        <form onSubmit={handleSubmit}>

          {/* ✅ User Details — readonly */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={data?.user?.name || ""}
                readOnly
                style={{ ...inputStyle, background: "#e5e7eb" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={data?.user?.email || ""}
                readOnly
                style={{ ...inputStyle, background: "#e5e7eb" }}
              />
            </div>
          </div>

          {/* ✅ Phone */}
          <div style={{ marginTop: "16px" }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]{10}"
              required
              style={inputStyle}
            />
          </div>

          {/* ✅ Address Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
            <div>
              <label style={labelStyle}>Street Address</label>
              <input type="text" placeholder="House No, Street Name" value={street}
                onChange={(e) => setStreet(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input type="text" placeholder="City Name" value={city}
                onChange={(e) => setCity(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input type="text" placeholder="State Name" value={state}
                onChange={(e) => setState(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ZIP Code</label>
              <input type="text" placeholder="ZIP Code" value={zip}
                onChange={(e) => setZip(e.target.value)} pattern="[0-9]{6}" required style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Country</label>
              <input type="text" placeholder="Country" value={country}
                onChange={(e) => setCountry(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          {/* ✅ Cart Summary */}
          <div style={{ marginTop: "24px", background: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Your Cart</h3>
            <div>
              {items.map((item) => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "8px" }}>
                  <div>
                    <p style={{ fontWeight: "500", margin: 0 }}>{item.productId.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0 0" }}>
                      Qty: {item.quantity} | ₹{item.productId.discountPrice || item.productId.price}
                    </p>
                  </div>
                  <p style={{ fontWeight: "600", margin: 0 }}>
                    ₹{(item.productId.discountPrice || item.productId.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", marginTop: "12px" }}>
              <span>Total:</span>
              <span style={{ color: "#16a34a" }}>₹{totalPrice}</span>
            </div>
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            style={{
              marginTop: "24px", width: "100%", padding: "14px",
              background: isProcessing ? "#93c5fd" : "#3b82f6",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "16px", fontWeight: "600", cursor: isProcessing ? "not-allowed" : "pointer",
            }}
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </button>

        </form>
      </div>
    </div>
  );
}

// ✅ Reusable styles
const labelStyle = {
  display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px"
};

const inputStyle = {
  border: "1px solid #d1d5db", padding: "8px 12px",
  width: "100%", borderRadius: "6px", fontSize: "14px",
  boxSizing: "border-box", outline: "none",
};