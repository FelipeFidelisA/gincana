// Register.tsx
import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FormComponent from "../components/FormComponent";

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
    if (credentials.password !== credentials.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    try {
      await register(credentials);
      navigate("/login");
    } catch (error: any) {
      setError(error.message || "Erro ao registrar. Tente novamente.");
    }
  };

  const fields = [
    {
      label: "Nome:",
      type: "text",
      name: "name",
      placeholder: "Digite seu nome",
    },
    {
      label: "Email:",
      type: "email",
      name: "email",
      placeholder: "Digite seu email",
    },
    {
      label: "Senha:",
      type: "password",
      name: "password",
      placeholder: "Digite sua senha",
    },
    {
      label: "Confirmar Senha:",
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirme sua senha",
    },
  ];

  const [isFormHovered, setIsFormHovered] = useState(false);
  console.log(isFormHovered);

  return (
    <div style={styles.container}>
      {/* Estilos para animações e media queries */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from {
              transform: translateX(-50px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        style={styles.formContainer}
        onMouseEnter={() => setIsFormHovered(true)}
        onMouseLeave={() => setIsFormHovered(false)}
      >
        <div style={{ flex: 1 }}>
          <FormComponent
            credentials={credentials}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            navigate={navigate}
            fields={fields}
            title="Criar Conta"
            submitButtonText="Registrar"
            footerText="Já tem uma conta? Faça"
            footerLinkText="Login"
            footerLinkPath="/login"
          />
        </div>
        <div style={styles.imageSection} aria-hidden="true"></div>
      </div>
      <footer style={styles.footer}>
        &copy; 2024 Produzido por Sistemas de Informação
      </footer>
    </div>
  );
};

// Definindo os estilos inline para o componente Register
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column" | "row",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    animation: "fadeIn 1s ease-in-out",
  },
  formContainer: {
    display: "flex",
    flexDirection: "row" as "column" | "row", // Ajustado dinamicamente dentro do FormComponent
    width: "70%",
    maxWidth: "1200px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    margin: "2rem auto",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  imageSection: {
    flex: 1,
    backgroundImage: 'url("/public/loginIMG.svg")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    transition: "transform 0.3s ease",
    display: "block", // Ajuste conforme necessário
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.8rem",
    color: "#aaa",
    textAlign: "center" as const,
  },
  isFormHovered: false,
};

export default Register;
