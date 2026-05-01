import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId) => api.get(`/cart/add/${productId}`),
  decrease: (productId) => api.get(`/cart/decrease/${productId}`),
  remove: (productId) => api.get(`/cart/remove/${productId}`),
};