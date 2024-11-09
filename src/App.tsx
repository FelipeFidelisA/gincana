import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuizManagement from "./pages/QuizManagement";
import QuizResponse from "./pages/QuizResponse";
import { QuizProvider } from "./context/QuizContext";

const App = () => {
  return (
    <QuizProvider>
      <Router>
        <div style={{ padding: "20px" }}>
          <nav>
            <ul style={{ listStyle: "none", display: "flex", gap: "10px" }}>
              <li>
                <Link to="/manage">Gerenciar Quizzes</Link>
              </li>
              <li>
                <Link to="/respond">Responder Quiz</Link>
              </li>
            </ul>
          </nav>
          <hr />
          <Routes>
            <Route path="/manage" element={<QuizManagement />} />
            <Route path="/respond" element={<QuizResponse />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  );
};

// Componente Home
const Home = () => (
  <div>
    <h1>Bem-vindo ao Sistema de Quiz</h1>
    <p>Use a navegação acima para gerenciar ou responder quizzes.</p>
  </div>
);

export default App;
