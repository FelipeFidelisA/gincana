import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa"; // Ícone do menu
import { useQuizApi } from "../../context/QuizApiContext";

const QuizCard = ({ quiz, openModal }: any) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setQuizSelected } = useQuizApi();
  // Função para gerar URL do quiz
  const generateQuizURL = (quiz: any) => `https://example.com/quiz/${quiz.id}`;

  // Função para remover o quiz
  // Estilos globais
  const cardStyles: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    margin: "1rem auto",
    width: "100%",
    maxWidth: "280px", // Reduzido para diminuir o tamanho do card
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    fontFamily: "'Poppins', sans-serif", // Fonte Poppins
  };

  const headerStyles: React.CSSProperties = {
    fontSize: "1.3rem", // Fonte do título um pouco menor
    fontWeight: 600,
    marginTop: "1rem", // Distância do título do QR Code
    marginBottom: "0.8rem", // Distância reduzida
    color: "#333",
    textAlign: "center",
    wordWrap: "break-word",
  };

  const qrCodeStyles: React.CSSProperties = {
    marginBottom: "1.5rem",
  };

  const menuButtonStyles: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#02A09D",
    color: "white",
    border: "none",
    borderRadius: "50%",
    padding: "8px",
    cursor: "pointer",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const menuStyles: React.CSSProperties = {
    position: "absolute",
    top: "70px",
    right: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "10px",
    display: menuOpen ? "block" : "none",
    width: "200px", // Limita a largura do menu
  };

  const menuItemStyles: React.CSSProperties = {
    padding: "12px 20px",
    backgroundColor: "#02A09D",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginBottom: "10px",
    cursor: "pointer",
    textAlign: "center",
    width: "100%",
    transition: "background-color 0.3s ease",
    fontSize: "1rem",
    fontWeight: 500,
  };

  const removeButtonStyles: React.CSSProperties = {
    ...menuItemStyles,
    backgroundColor: "#DF5C0F",
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div style={cardStyles}>
      <h2 style={headerStyles}>{quiz.code}</h2>
      <QRCodeCanvas
        value={generateQuizURL(quiz)}
        size={150} // Aumentado o tamanho do QR Code
        style={qrCodeStyles}
      />
      <h3 style={headerStyles}>{quiz.title}</h3>
      <button style={menuButtonStyles} onClick={toggleMenu}>
        <FaEllipsisV />
      </button>
      <div style={menuStyles}>
        <button onClick={() => openModal(quiz)} style={menuItemStyles}>
          Ver Detalhes
        </button>
        <button
          onClick={() => {
            setQuizSelected(quiz);
            navigate(`/quizadm?codde=${quiz.code}`);
          }}
          style={menuItemStyles}
        >
          Iniciar
        </button>
        <button
          onClick={() => {
            if (
              window.confirm("Você tem certeza que deseja remover este quiz?")
            ) {
              console.log("Removendo quiz...");
            }
          }}
          style={removeButtonStyles}
        >
          Remover
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
