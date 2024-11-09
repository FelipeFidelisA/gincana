import { createContext, useState, ReactNode, FC } from "react";

interface AuthContextType {
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  register: (userInfo: UserInfo) => Promise<void>;
  logout: () => void;
}

interface Credentials {
  email: string;
  password: string;
}

interface UserInfo {
  email: string;
  password: string;
  confirmPassword: string;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// const exampleUrl = "https://example.com/api";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (credentials: Credentials) => {
    console.log(credentials);
    const fakeToken = "123456";
    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
  };

  const register = async (userInfo: UserInfo) => {
    console.log(userInfo);
    const fakeToken = "654321";
    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
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
