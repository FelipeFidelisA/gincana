import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuizManagement from "./pages/QuizManagement";
import QuizResponse from "./pages/QuizResponse";
import AddQuiz from "./pages/AddQuiz";
import { QuizProvider } from "./context/QuizContext";
import QrView from "./pages/QrView";

const App = () => {
  return (
    <QuizProvider>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <ul className="nav-links">
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
            <Route path="/add-quiz" element={<AddQuiz />} />{" "}
            {/* Adicione esta linha */}
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
