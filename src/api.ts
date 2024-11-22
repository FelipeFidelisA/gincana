import axios from "axios";

const api = axios.create({
  baseURL: "https://api-teste-a.5lsiua.easypanel.host",
});

api.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;
