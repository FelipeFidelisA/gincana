import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(credentials);
    navigate("/quiz");
  };
  return (
    <div className="container">
      <div className="form-container">
        <div className="form-content">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
        <div className="image-section"></div>
      </div>
      <footer>Copyright ©2024 Produced by Sistemas de Informação</footer>
    </div>
  );
    
};

export default Login;
