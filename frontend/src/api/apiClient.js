import axios from "axios";

/**
 * Единая точка настройки axios.
 * Бэкенд слушает порт 3000: http://localhost:3000
 * Базовый префикс API: /api
 */
export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const rfToken = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:3000/api/auth/refresh", {
          refreshToken: rfToken,
        });

        const { accessToken, refreshToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.reload();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  },
);
