import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    await register(userInfo);
    navigate("/quiz");
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            required
          />
        </div>
        <div>
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
        <div>
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
        <button type="submit">Registrar</button>
      </form>
      <p>
        Já tem uma conta?
        <span
          onClick={() => {
            navigate("/login");
          }}
        >
          Fazer login
        </span>
      </p>
    </div>
  );
};

export default Register;
