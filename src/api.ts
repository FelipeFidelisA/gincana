import axios from "axios";

export const api = axios.create({
  baseURL: "https://postgresql-16-adada.5lsiua.easypanel.host",
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});