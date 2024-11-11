import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizManagement from "./pages/QuizManagement";
import QuizResponse from "./pages/QuizResponse";
import AddQuiz from "./pages/AddQuiz";
import QrView from "./pages/QrView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { QuizProvider } from "./context/QuizContext";

const App = () => {
  return (
    <QuizProvider>
      <Router>
        <div className="app-container">
          <Header />
          <hr />
          <Routes>
            <Route path="/add-quiz" element={<AddQuiz />} />
            <Route path="/manage" element={<QuizManagement />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/respond" element={<QuizResponse />} />
            <Route path="/qrview" element={<QrView />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  );
};

const Home = () => (
  <div className="home-container">
    <h1>Bem-vindo ao Sistema de Quiz</h1>
    <p>Use a navegação acima para gerenciar ou responder quizzes.</p>
  </div>
);

export default App;

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <nav style={{ flex: 1 }}>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li style={{ margin: "0 10px" }}>
            <Link
              to="/manage"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Gerenciar Quizzes
            </Link>
          </li>
          <li style={{ margin: "0 10px" }}>
            <Link
              to="/respond"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Responder Quiz
            </Link>
          </li>
        </ul>
      </nav>
      <div
        onClick={toggleDropdown}
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaUserCircle size={30} style={{ color: "#333" }} />
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              width: "150px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <button
              style={{
                backgroundColor: "#f44336",
                color: "white", 
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              encerrar sessão
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
