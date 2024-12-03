import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useQuizApi } from "../../context/QuizApiContext";
import "../../styles/QuizCard.css";

const QuizCard = ({ quiz, openModal }: any) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setQuizSelected } = useQuizApi();

  const generateQuizURL = (quiz: any) =>
    `${window.location.origin}/respond?code=${quiz.code}`;

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleNavigateToQuizAdmin = () => {
    setQuizSelected(quiz);
    navigate(`/quizadm?code=${quiz.code}`);
  };

  return (
    <div className="quiz-card">
      <h2 className="quiz-card-code">{quiz.code}</h2>
      <QRCodeCanvas
        value={generateQuizURL(quiz)}
        size={150}
        className="quiz-card-qr-code"
      />
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <button className="menu-toggle-button" onClick={toggleMenu}>
        <FaEllipsisV />
      </button>
      {isMenuOpen && (
        <div className="menu">
          <button onClick={() => openModal(quiz)} className="menu-item">
            Ver Detalhes
          </button>
          <button onClick={handleNavigateToQuizAdmin} className="menu-item">
            Iniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
