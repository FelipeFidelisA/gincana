import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

interface Credentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(credentials);
      navigate("/quiz");
    } catch (error: any) {
      setError(error.message || "Erro ao registrar. Tente novamente.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-content">
          <h2>Criar Conta</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="nome">Nome:</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={credentials.name}
                onChange={handleChange}
                required
                placeholder="Digite seu nome"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="Digite seu email"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha:</label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Digite sua senha"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="button-container">
              <button type="submit">Registrar</button>
            </div>
          </form>

          <p className="register-link">
            Já tem uma conta? Faça
            <span onClick={() => navigate("/login")} className="link-text">
              Login
            </span>
          </p>
        </div>
        <div className="image-section" aria-hidden="true"></div>
      </div>
      <footer>&copy; 2024 Produzido por Sistemas de Informação</footer>
    </div>
  );
};

export default Register;
