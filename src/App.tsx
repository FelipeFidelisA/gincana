import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizManagement from "./pages/QuizManagement";
import QuizResponse from "./pages/QuizResponse";
import AddQuiz from "./pages/AddQuiz";
import QrView from "./pages/QrView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { QuizProvider } from "./context/QuizContext";
import { AuthProvider } from "./context/AuthContext";
import { QuizApiProvider } from "./context/QuizApiContext";
import Home from "./pages/Home";

const App = () => {
  return (
    <AuthProvider>
      <QuizApiProvider>
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
      </QuizApiProvider>
    </AuthProvider>
  );
};

export default App;
