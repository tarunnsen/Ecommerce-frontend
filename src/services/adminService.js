// src/services/adminService.js
import api from "./api";

export const adminService = {
    login: (data) => api.post("/admin/login", data),
    logout: () => api.get("/admin/logout"),
    verifyAdmin: () => api.get("/admin/dashboard"),
    getProducts: () => api.get("/admin/products"),
    getProductById: (id) => api.get(`/admin/product/${id}`),
    createProduct: (formData) => api.post("/admin/product", formData),
    deleteProduct: (id) => api.get(`/admin/product/${id}/delete`),
    getOrders: () => api.get("/admin/orders"),
    updateOrder: (data) => api.post("/admin/order/update", data),
};