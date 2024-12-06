import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useQuizApi } from "../../context/QuizApiContext";
import "../../styles/QuizCard.css";

const QuizCard = ({ quiz, openModal }: any) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shareButtonText, setShareButtonText] = useState("Compartilhar");
  const [isCopied, setIsCopied] = useState(false);
  const { setQuizSelected } = useQuizApi();
  const menuRef: any = useRef(null);
  const buttonRef: any = useRef(null);

  const generateQuizURL = (quiz: any) =>
    `${window.location.origin}/respond?code=${quiz.code}`;

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleNavigateToQuizAdmin = () => {
    setQuizSelected(quiz);
    navigate(`/quizadm?code=${quiz.code}`);
  };

  const handleOpenModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openModal(quiz);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const handleShareClick = () => {
    navigator.clipboard.writeText(generateQuizURL(quiz));
    setShareButtonText("Copiado!");
    setIsCopied(true);
    setTimeout(() => {
      setShareButtonText("Compartilhar");
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div onClick={handleNavigateToQuizAdmin} className="quiz-card">
      <div>
        <h2 className="quiz-card-code">{quiz.code}</h2>
        <QRCodeCanvas
          value={generateQuizURL(quiz)}
          size={150}
          className="quiz-card-qr-code"
        />
        <h3 className="quiz-card-title">{quiz.title}</h3>
      </div>
      <button
        className="menu-toggle-button"
        onClick={toggleMenu}
        ref={buttonRef}
        aria-label="Toggle menu"
      >
        <FaEllipsisV />
      </button>
      {isMenuOpen && (
        <>
          <div
            style={{
              zIndex: 1000,
            }}
            className="menu"
            ref={menuRef}
          >
            <button onClick={handleOpenModal} className="menu-item">
              Ver Detalhes
            </button>

            <button
              className={`menu-item ${isCopied ? "copied" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleShareClick();
              }}
            >
              {shareButtonText}
            </button>
            <button
              className="menu-item"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/respond?code=${quiz.code}`);
              }}
            >
              responder
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizCard;
