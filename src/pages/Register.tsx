import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials]: any = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await register(credentials);
    navigate("/quiz");
  };
  return (
    <div className="container">
      <div className="form-container">
        <div className="form-content">
          <h2>Criar conta</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nome:</label>
              <input
                type="text"
                value={credentials.nome}
                onChange={(e) =>
                  setCredentials({ ...credentials, nome: e.target.value })
                }
                required
              />
            </div>
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

            <div className="button-container">
              <button type="submit">Registrar</button>
            </div>
          </form>

          <p className="register-link">
            já tem uma conta? faça 
            <span onClick={() => navigate("/login")} className="link-text">
              Login
            </span>
          </p>
        </div>
        <div className="image-section"></div>
      </div>
      <footer>Copyright ©2024 Produced by Sistemas de Informação</footer>
    </div>
  );
};

export default Register;
