import { api } from "./apiClient";

/**
 * adminApi.js — запросы для админских операций (Практика 11: RBAC).
 * Все запросы требуют accessToken (Authorization подставит interceptor).
 */

export async function getUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function setUserRole(userId, role) {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
}
