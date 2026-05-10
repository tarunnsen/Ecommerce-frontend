import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId) => api.post(`/cart/add/${productId}`),
  decrease: (productId) => api.patch(`/cart/decrease/${productId}`),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
};