import axios from "axios";

export const api = axios.create({
  baseURL: "https://postgresql-16-adada.5lsiua.easypanel.host",
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

api.interceptors.request.use(
  (config) => {
    const authToken = sessionStorage.getItem("authToken");
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
    // Verificar se o erro é relacionado ao token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Tentar renovar o token com o refreshToken
        const refreshToken = sessionStorage.getItem("refreshToken");
        const { data } = await api.post("/refresh-token", { refreshToken });

        // Atualizar os tokens no armazenamento
        const { authToken } = data;
        sessionStorage.setItem("authToken", authToken);
        // Atualizar o header da requisição original com o novo authToken
        originalRequest.headers.Authorization = `Bearer ${authToken}`;

        // Repetir a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, redirecionar para o login ou lidar com erro
        console.error("Token refresh failed", refreshError);
        // Aqui pode redirecionar o usuário para a página de login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
