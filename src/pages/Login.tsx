// src/pages/Login.tsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        email: credentials.email,
        password: credentials.password,
      });
      navigate("/admquiz");
    } catch (error) {
      console.error("Falha no login:", error);
      alert("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-content">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Campo para Email */}
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>

            {/* Campo para Senha */}
            <div className="input-group">
              <label>Senha:</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit">Login</button>
          </form>

          <p>
            Não tem uma conta?
            <span onClick={() => navigate("/register")} className="link-text">
              Registre-se
            </span>
          </p>
        </div>
        <div className="image-section"></div>
      </div>
      <footer>Copyright ©2024 Produced by Sistemas de Informação</footer>
    </div>
  );
};

export default Login;
