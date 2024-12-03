import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useQuizApi } from "../../context/QuizApiContext";
import "../../styles/QuizCard.css";

const QuizCard = ({ quiz, openModal }: any) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setQuizSelected } = useQuizApi();
  const menuRef: any = useRef(null);
  const buttonRef: any = useRef(null);

  const generateQuizURL = (quiz: any) =>
    `${window.location.origin}/respond?code=${quiz.code}`;

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleNavigateToQuizAdmin = () => {
    setQuizSelected(quiz);
    navigate(`/quizadm?code=${quiz.code}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="quiz-card">
      <h2 className="quiz-card-code">{quiz.code}</h2>
      <QRCodeCanvas
        value={generateQuizURL(quiz)}
        size={150}
        className="quiz-card-qr-code"
        includeMargin={false}
      />
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <button
        className="menu-toggle-button"
        onClick={toggleMenu}
        ref={buttonRef}
        aria-label="Toggle menu"
      >
        <FaEllipsisV />
      </button>
      {isMenuOpen && (
        <div className="menu" ref={menuRef}>
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
