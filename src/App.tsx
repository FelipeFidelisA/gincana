import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizManagement from "./pages/QuizManagement";
import QuizResponse from "./pages/QuizResponse";
import AddQuiz from "./pages/AddQuiz";
import QrView from "./pages/QrView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { QuizProvider } from "./context/QuizContext";
import React from "react";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <Routes>
            <Route path="/add-quiz" element={<AddQuiz />} />
            <Route path="/manage" element={<QuizManagement />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/respond" element={<QuizResponse />} />
            <Route path="/qrview" element={<QrView />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
};

const Home: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    padding: "2rem",
    textAlign: "center",
    color: "#fff",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    maxWidth: "600px",
    marginBottom: "2rem",
  };

  const linkStyle: React.CSSProperties = {
    display: "inline-block",
    margin: "0 1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "1.2rem",
    transition: "background-color 0.3s, transform 0.3s",
  };

  const linkHoverStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    transform: "scale(1.05)",
  };

  const [hoverLogin, setHoverLogin] = React.useState(false);
  const [hoverRegister, setHoverRegister] = React.useState(false);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Bem-vindo ao Sistema de Quiz</h1>
      <p style={paragraphStyle}>
        Teste seus conhecimentos e desafie seus amigos! Para começar, faça{" "}
        <Link
          to="/login"
          style={{
            ...linkStyle,
            ...(hoverLogin ? linkHoverStyle : {}),
          }}
          onMouseEnter={() => setHoverLogin(true)}
          onMouseLeave={() => setHoverLogin(false)}
        >
          Login
        </Link>{" "}
        ou{" "}
        <Link
          to="/register"
          style={{
            ...linkStyle,
            ...(hoverRegister ? linkHoverStyle : {}),
          }}
          onMouseEnter={() => setHoverRegister(true)}
          onMouseLeave={() => setHoverRegister(false)}
        >
          Registre-se
        </Link>
        .
      </p>
    </div>
  );
};

export default App;
