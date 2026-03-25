import { api } from "./apiClient";

export async function register(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function login(payload) {
  console.log("logging...");
  const response = await api.post("/auth/login", payload);
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
  }
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}
