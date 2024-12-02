import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/FormComponent";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  /* const [credentials, setCredentials] = useState({
    username: "marceline@mail.com",
    password: "2308",
  }); */
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(credentials);
      if (response.status === 200) {
        navigate("/manage");
      }
    } catch (error: any) {
      setError(error);
    }
  };

  const fields = [
    {
      label: "Email:",
      type: "text",
      name: "username",
      placeholder: "Digite seu username",
    },
    {
      label: "Senha:",
      type: "password",
      name: "password",
      placeholder: "Digite sua senha",
    },
  ];

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ flex: 1 }}>
          <FormComponent
            credentials={credentials}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            fields={fields}
            title="Login"
            submitButtonText="Entrar"
            footerText="Não tem uma conta?"
            footerLinkText="Registre-se"
            footerLinkPath="/register"
            navigate={navigate}
          />
        </div>
        <div className="image-section" aria-hidden="true"></div>
      </div>
      <footer className="footer">
        © 2024 Produzido por Sistemas de Informação
      </footer>
    </div>
  );
};

export default Login;
