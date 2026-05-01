import api from "./api";

export const paymentService = {
  // Buy Now → productId pass karo
  // Cart checkout → "cart" pass karo  
  getCheckout: (id) => api.get(`/payment/checkout/${id}`),
  
  createOrder: (orderData) => api.post("/payment/create/orderId", orderData),
  
  verifyPayment: (paymentData) => api.post("/payment/api/payment/verify", paymentData),
};