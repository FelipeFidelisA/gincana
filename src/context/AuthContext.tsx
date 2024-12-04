import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../api";

interface AuthContextProps {
  authToken: string | null;
  isAuthenticated: boolean;
  register: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Promise<any>;
  login: (credentials: { username: string; password: string }) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsAuthenticated(true);
  }, []);

  const register = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      return await api.post("/user/new", { name, email, password });
    } catch (error: any) {
      throw error.response?.data.message;
    }
  };

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await api.post("/login", { username, password });
      if (response.status === 200) {
        const { authToken, refreshToken } = response.data;
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
        setAuthToken(authToken);
      }
      return response;
    } catch (error: any) {
      throw error.response?.data.message;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ authToken, isAuthenticated, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
