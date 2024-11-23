import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/FormComponent";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ name: "marceline", email: "marceline@mail.com", password: "2308" });
  const [error, setError] = useState<string | null>(null);


  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await register(credentials);
      if (response.status === 201) {
        navigate("/login")
      }
      if (response?.data.message) {
        setError("Usuário com este email já existe.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error: any) {
      setError(error);
      setTimeout(() => setError(null), 3000);
    }
  };

  const fields = [
    { label: "Nome:", type: "text", name: "name", placeholder: "Digite seu nome" },
    { label: "Email:", type: "text", name: "email", placeholder: "Digite seu email" },
    { label: "Senha:", type: "password", name: "password", placeholder: "Digite sua senha" },
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
            title="Registro"
            submitButtonText="Registrar"
            footerText="Já tem uma conta?"
            footerLinkText="Faça login"
            footerLinkPath="/login"
            navigate={navigate}
          />
        </div>
        <div className="image-section" aria-hidden="true">
        </div>
      </div>
      <footer className="footer">© 2024 Produzido por Sistemas de Informação</footer>
    </div>
  );
};

export default Register;
