import api from "./api";

export const orderService = {
  getById: (orderId) => api.get(`/order/${orderId}`),
  createOrder: (data) => api.post("/payment/create/orderId", data),
  verifyPayment: (data) => api.post("/payment/api/payment/verify", data),
  downloadInvoice: (orderId) => `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/payment/download-invoice/${orderId}`,
};