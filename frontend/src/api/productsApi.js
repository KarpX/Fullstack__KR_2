import { api } from "./apiClient";

/**
 * TODO (Практика 4):
 * Реализуйте функции работы с API.
 * Подсказка: используйте api.get/post/patch/delete и возвращайте data.
 */

export async function getProducts() {
  const response = await api.get("/products");
  return response.data;
}

export async function createProduct(payload) {
  const response = await api.post("/products/", payload);
  return response.data;
}

export async function updateProduct(id, patch) {
  const response = await api.patch(`/products/${id}`, patch);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}

// export async function deleteProductByName(name) {
//   const response = await api.delete(`/api/products/name/${name}`);
//   return response.data;
// }

// export async function getProductsByCategory(category) {
//   const response = await api.get(`/api/products/category/${category}`);
//   return response.data;
// }

// export async function getProductsByPrice(price) {
//   const response = await api.get(`/api/products/price/${price}`);
//   return response.data;
// }

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}
