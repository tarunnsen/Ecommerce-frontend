import { useState, useEffect } from "react"; // ✅ useEffect add kiya
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "../components/CartDrawer";
import Navbar from "../components/Navbar";

const COLOR_MAP = {
  black: { background: "black" },
  red: { background: "#ef4444" },
  blue: { background: "#3b82f6" },
  green: { background: "#22c55e" },
  white: { background: "white", border: "1px solid #d1d5db" },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, checkAuth } = useAuth(); // ✅ checkAuth add kiya

  const [mainImage, setMainImage] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Page load pe fresh auth check — login ke baad redirect aane par
  useEffect(() => {
    checkAuth();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await productService.getById(id);
      return res.data.data;
    },
  });

  const { mutate: addToCart, isPending: addingToCart } = useMutation({
    mutationFn: () => cartService.addToCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCartOpen(true);
    },
    onError: () => {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
    },
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px", fontSize: "18px" }}>Loading...</div>
      </>
    );
  }

  if (isError || !data?.product) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px", fontSize: "18px", color: "red" }}>
          Product not found.
        </div>
      </>
    );
  }

  const { product, relatedProducts } = data;
  const displayImage = mainImage || product.images?.[0] || "/images/default.jpg";

  const goToLoginWithRedirect = (redirectPath) => {
    sessionStorage.setItem("redirectAfterLogin", redirectPath);
    navigate("/login");
  };

  return (
    <div style={{ background: "#f8f9fc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <Navbar />

      {/* PRODUCT SECTION */}
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}
      >
        {/* Left: Image Gallery */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={displayImage}
            alt={product.name}
            style={{
              width: "100%", maxWidth: "370px", height: "500px",
              objectFit: "cover", borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)", marginBottom: "16px",
            }}
          />
          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: "80px", height: "80px", objectFit: "cover",
                    borderRadius: "6px",
                    border: displayImage === img ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    cursor: "pointer", transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "700" }}>{product.name}</h1>

          {product.description && (
            <p style={{ color: "#4b5563" }}>{product.description}</p>
          )}

          {product.discountPrice ? (
            <div>
              <p style={{ color: "#9ca3af", textDecoration: "line-through", fontSize: "16px" }}>₹{product.price}</p>
              <p style={{ fontSize: "20px", fontWeight: "600", color: "#16a34a" }}>
                ₹{product.discountPrice}{" "}
                <span style={{ fontSize: "14px", color: "#6b7280" }}>(Discounted)</span>
              </p>
            </div>
          ) : (
            <p style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>₹{product.price}</p>
          )}

          {product.material && (
            <p style={{ fontSize: "14px", color: "#4b5563" }}>Material: {product.material}</p>
          )}

          {product.sizes?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>Size</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button key={size} style={{
                    border: "1px solid #d1d5db", padding: "8px 16px",
                    borderRadius: "6px", background: "white",
                    cursor: "pointer", fontSize: "14px",
                  }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>Color</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                {product.colors.map((color) => (
                  <div key={color} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    ...(COLOR_MAP[color.toLowerCase()] || { background: "#9ca3af" }),
                  }} />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
            <button
              onClick={() => {
                if (!user) {
                  goToLoginWithRedirect(window.location.pathname);
                  return;
                }
                addToCart();
              }}
              disabled={addingToCart}
              style={{
                padding: "12px 24px",
                background: addingToCart ? "#93c5fd" : "#2563eb",
                color: "white", border: "none", borderRadius: "8px",
                cursor: addingToCart ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: "500",
              }}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={() => {
                if (!user) {
                  goToLoginWithRedirect(`/checkout?productId=${product._id}`);
                  return;
                }
                navigate(`/checkout?productId=${product._id}`);
              }}
              style={{
                padding: "12px 24px",
                background: "#1f2937", color: "white",
                border: "none", borderRadius: "8px",
                cursor: "pointer", fontSize: "15px", fontWeight: "500",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts?.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Related Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {relatedProducts.map((related) => (
              <Link key={related._id} to={`/product/${related._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    background: "white", borderRadius: "8px", padding: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")}
                >
                  <div style={{ overflow: "hidden", borderRadius: "8px", marginBottom: "16px" }}>
                    <img
                      src={related.images?.[0] || "/images/default.jpg"}
                      alt={related.name}
                      style={{ width: "100%", height: "192px", objectFit: "cover", transition: "transform 0.3s" }}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{related.name}</h3>
                  <p style={{ color: "#4b5563" }}>₹{related.discountPrice || related.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#111827", color: "white", padding: "48px 0", marginTop: "auto" }}>
        <div className="container mx-auto px-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>TechFocus</h4>
              <p style={{ color: "#9ca3af" }}>Premium clothing for the modern individual.</p>
            </div>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Men's Collection</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Women's Collection</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>New Arrivals</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Customer Service</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Contact Us</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Shipping Policy</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Returns & Exchanges</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Newsletter</h4>
              <p style={{ color: "#9ca3af" }}>Subscribe to receive updates, access to exclusive deals, and more.</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #374151", marginTop: "32px", paddingTop: "32px", textAlign: "center", color: "#9ca3af" }}>
            <p>© 2025 TechFocus. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}