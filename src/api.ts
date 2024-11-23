import axios from "axios";

export const api = axios.create({
  baseURL: "https://postgresql-16-adada.5lsiua.easypanel.host",
});

/* api.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
); */

export const authReq = axios.create({
  baseURL: "https://postgresql-16-adada.5lsiua.easypanel.host",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

