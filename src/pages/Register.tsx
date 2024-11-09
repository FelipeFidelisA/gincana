import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (!userInfo.termsAccepted) {
      alert("Você deve aceitar os Termos de Uso!");
      return;
    }
    await register(userInfo);
    navigate("/quiz");
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Registro</h2>
        <p>
          Pronto para provar o quanto você sabe? Cadastre-se e mergulhe em
          quizzes cheios de desafios e diversão!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário:</label>
            <input
              type="text"
              value={userInfo.username}
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>E-mail:</label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Senha:</label>
            <input
              type="password"
              value={userInfo.confirmPassword}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              checked={userInfo.termsAccepted}
              onChange={(e) =>
                setUserInfo({
                  ...userInfo,
                  termsAccepted: e.target.checked,
                })
              }
              required
            />
            <label>
              Eu concordo com os <span className="terms-link">Termos de Uso</span>
            </label>
          </div>
          <button className="register-button" type="submit">
            Criar minha conta!
          </button>
        </form>
        <p className="login-link">
          Já tem uma conta?{" "}
          <span
            onClick={() => {
              navigate("/login");
            }}
          >
            Eu já tenho uma conta!
          </span>
        </p>
      </div>
      <div className="register-image">
        {/* Aqui você pode adicionar a imagem de fundo */}
      </div>
    </div>
  );
};

export default Register;
