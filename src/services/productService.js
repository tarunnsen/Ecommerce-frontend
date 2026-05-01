import api from "./api";

export const productService = {
  getHome: () => api.get("/"),
  getAll: () => api.get("/product"),
  getById: (id) => api.get(`/product/${id}`),
};