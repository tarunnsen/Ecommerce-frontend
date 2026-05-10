import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import { Link } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartService.getCart();
      return res.data.data;
    },
    enabled: isOpen,
  });

  const { mutate: increase } = useMutation({
    mutationFn: (id) => cartService.addToCart(id),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["cart"]);
      const previous = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.map((item) =>
            item.productId._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries(["cart"]),
  });

  const { mutate: decrease } = useMutation({
    mutationFn: (id) => cartService.decrease(id),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["cart"]);
      const previous = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products
            .map((item) =>
              item.productId._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        };
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries(["cart"]),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id) => cartService.remove(id),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["cart"]);
      const previous = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.filter(
            (item) => item.productId._id !== productId
          ),
        };
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries(["cart"]),
  });

  const items = (data?.products || []).filter((item) => item.productId !== null);

  const totalPrice = items.reduce((acc, item) => {
    const price = item.productId?.discountPrice || item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
        />
      )}

      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "384px",
          background: "white", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out", zIndex: 50, overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Your Cart</h2>
          <button
            onClick={onClose}
            style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, padding: "16px" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
          ) : items.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>Cart is empty</p>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f3f4f6" }}
              >
                <img
                  src={item.productId?.images?.[0] || "/images/default.jpg"}
                  alt={item.productId?.name}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                />

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
                    {item.productId?.name}
                  </p>
                  <p style={{ color: "#16a34a", fontSize: "14px", marginBottom: "8px" }}>
                    ₹{item.productId?.discountPrice || item.productId?.price}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => decrease(item.productId?._id)}
                      style={{ width: "28px", height: "28px", border: "1px solid #d1d5db", borderRadius: "4px", background: "white", cursor: "pointer", fontSize: "16px" }}
                    >
                      −
                    </button>

                    <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increase(item.productId?._id)}
                      style={{ width: "28px", height: "28px", border: "1px solid #d1d5db", borderRadius: "4px", background: "white", cursor: "pointer", fontSize: "16px" }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => remove(item.productId?._id)}
                      style={{ padding: "4px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb", background: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontWeight: "600" }}>Total:</span>
              <span style={{ fontWeight: "700", color: "#16a34a" }}>₹{totalPrice}</span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              style={{
                display: "block", textAlign: "center", padding: "12px",
                background: "#16a34a", color: "white", borderRadius: "8px",
                textDecoration: "none", fontWeight: "600",
              }}
            >
              Proceed to Pay
            </Link>
          </div>
        )}
      </div>
    </>
  );
}