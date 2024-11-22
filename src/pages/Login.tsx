// Login.tsx
import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FormComponent from "../components/FormComponent";
import api from "../api";

interface Credentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log(credentials);
      const userData = {
        username: credentials.username,
        password: credentials.password,
      };

      console.log("responseString");
      console.log("responseString");
      console.log("responseString");
      console.log("responseString");
      const response = await api.post("/login", userData);
      localStorage.setItem("token", "token");
      const responseString = JSON.stringify(response.data);
      console.log(responseString);
      //navigate("/manage");
    } catch (error: any) {
      setError("email ou senha incorretos. Tente novamente.");
    }
  };

  const fields = [
    {
      label: "email:",
      type: "username",
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
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={{ flex: 1 }}>
          <FormComponent
            credentials={credentials}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            navigate={navigate}
            fields={fields}
            title="Login"
            submitButtonText="Entrar"
            footerText="Não tem uma conta?"
            footerLinkText="Registre-se"
            footerLinkPath="/register"
          />
        </div>
        <div style={{ ...styles.imageSection }} aria-hidden="true">
          <img src="../public/loginIMG.png" />
        </div>
      </div>
      <footer style={styles.footer}>
        &copy; 2024 Produzido por Sistemas de Informação
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column" | "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    animation: "fadeIn 1s ease-in-out",
  },
  formContainer: {
    display: "flex",
    flexDirection: "row" as "column" | "row",
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
    backgroundImage: 'url("/public/loginIMG.png")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    transition: "transform 0.3s ease",
    display: "block",
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.8rem",
    color: "#aaa",
    textAlign: "center" as const,
  },
};

export default Login;
