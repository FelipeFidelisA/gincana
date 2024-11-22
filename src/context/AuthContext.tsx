import { createContext, useState, ReactNode, FC } from "react";
import api from "../api";

interface AuthContextType {
  token: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userInfo: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (credentials: { username: string; password: string }) => {
    const userData = {
        username: credentials.username,
        password: credentials.password,
      };

    console.log("responseString");
    console.log("responseString");
    console.log("responseString");
    console.log("responseString");
    const response = await api.post("/login", userData);
      setToken("token");
      localStorage.setItem("token", "token");
      const responseString = JSON.stringify(response.data);
      console.log(responseString);
  };

  const register = async (userInfo: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("Registrando usuário:", userInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
