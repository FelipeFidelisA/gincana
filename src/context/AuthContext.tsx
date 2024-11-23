// context/AuthContext.tsx
import React, { createContext, useState, useContext } from "react";
import { api } from "../api";

interface AuthContextProps {
  isAuthenticated: boolean;
  register: (credentials: { name: string; email: string; password: string }) => Promise<void>;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const response: any = await api.post("/user/new", { name, email, password })
    if (response.status !== 200) {
      console.log("Erro ao registrar usuário");
    }
  }

  const login = async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      setIsAuthenticated(true);
      localStorage.setItem("token", response.data.token); // Salva o token
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
