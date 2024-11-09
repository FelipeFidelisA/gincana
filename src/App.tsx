import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import AdmQuiz from './pages/AdmQuiz';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
            <Route path="/admquiz" element={<PrivateRoute admin><AdmQuiz /></PrivateRoute>} />
          </Routes>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
};

interface PrivateRouteProps {
  children: JSX.Element;
  admin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = React.useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
