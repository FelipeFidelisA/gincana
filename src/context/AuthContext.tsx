import { createContext, useState, ReactNode, FC } from "react";

interface AuthContextType {
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userInfo: {
    email: string;
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

  const login = async (credentials: { email: string; password: string }) => {
    if (
      credentials.email === "admin@example.com" &&
      credentials.password === "password"
    ) {
      const fakeToken = "admin-token";
      localStorage.setItem("token", fakeToken);
      setToken(fakeToken);
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const register = async (userInfo: {
    email: string;
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
