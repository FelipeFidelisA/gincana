// React e Bibliotecas Externas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas
import QuizResponse from "./pages/QuizResponse";
import AddQuiz from "./pages/AddQuiz";
import QrView from "./pages/QrView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import QuizAdminPage from "./pages/QuizAdminPage";
import Ranking from "./pages/Ranking";

// Componentes
import QuizManagement from "./components/QuizManagement";

// Contextos
import { AuthProvider } from "./context/AuthContext";
import { QuizApiProvider } from "./context/QuizApiContext";

const App = () => {
  return (
    <AuthProvider>
      <QuizApiProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/manage" element={<QuizManagement />} />
            <Route path="/add-quiz" element={<AddQuiz />} />
            <Route path="/qrview" element={<QrView />} />
            <Route path="/respond" element={<QuizResponse />} />
            <Route path="/quizadm" element={<QuizAdminPage />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </QuizApiProvider>
    </AuthProvider>
  );
};

export default App;
