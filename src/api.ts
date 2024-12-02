import axios from "axios";

export const api = axios.create({
  baseURL: "https://postgresql-16-adada.5lsiua.easypanel.host",
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});
/* 
api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Alterado para localStorage
        const { data } = await api.post("/refresh-token", { refreshToken });
        const { authToken } = data;
        localStorage.setItem("authToken", authToken); // Alterado para localStorage
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
 */