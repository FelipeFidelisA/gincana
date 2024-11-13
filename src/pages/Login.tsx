import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";

interface Credentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate("/manage");
    } catch (error: any) {
      setError("Email ou senha incorretos. Tente novamente.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-content">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
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
            <p className="forgot-password">
              <a href="#">Esqueceu a senha?</a>
            </p>

            <div className="button-container">
              <button type="submit">Login</button>
            </div>
          </form>

          <p className="register-link">
            Não tem uma conta?
            <span onClick={() => navigate("/register")} className="link-text">
              Registre-se
            </span>
          </p>
        </div>
        <div className="image-section" aria-hidden="true"></div>
      </div>
      <footer>
        &copy; 2024 Produzido por Sistemas de Informação
      </footer>
    </div>
  );
};

export default Login;
