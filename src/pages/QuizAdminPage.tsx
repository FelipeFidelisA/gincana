// src/pages/QuizAdminPage.tsx

import React, { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Utilizando axios diretamente

const QuizAdminPage: React.FC = () => {
  const { quizSelected, listQuizzes, setQuizSelected } = useQuizApi();
  const [isStarting, setIsStarting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Se nenhum quiz estiver selecionado, exibe uma mensagem
  if (!quizSelected) {
    return (
      <div style={noQuizStyle}>
        <p>Nenhum quiz selecionado.</p>
      </div>
    );
  }

  // Função para iniciar o quiz
  const handleStartQuiz = async () => {
    if (window.confirm("Você tem certeza que deseja iniciar este quiz?")) {
      setIsStarting(true);
      setMessage(null);
      setError(null);
      try {
        // Endpoint correto: POST /quizzes/:quizId/start
        const response = await axios.post(
          `http://localhost:3000/quizzes/${quizSelected.id}/start`,
          {}
        );

        // Atualiza o quiz selecionado com os novos dados retornados pela API
        const updatedQuiz = response.data;
        setQuizSelected(updatedQuiz);
        listQuizzes();

        // Feedback de sucesso
        setMessage("Quiz iniciado com sucesso!");

        // Opcional: Redireciona para uma página de confirmação ou dashboard
        // navigate("/quizstarted"); // Descomente e ajuste conforme necessário
      } catch (err: any) {
        console.error("Erro ao iniciar o quiz:", err);
        setError(
          err.response?.data?.error ||
            "Ocorreu um erro ao iniciar o quiz. Por favor, tente novamente."
        );
      } finally {
        setIsStarting(false);
      }
    }
  };

  return (
    <div style={backgroundStyles}>
      <div style={containerStyles}>
        <h1 style={titleStyles}>{quizSelected.title}</h1>
        <p style={countStyles}>
          Número de participantes: {quizSelected.guests.length}
        </p>
        {message && <p style={successMessageStyle}>{message}</p>}
        {error && <p style={errorMessageStyle}>{error}</p>}
        <button
          style={buttonStyles}
          onClick={handleStartQuiz}
          disabled={isStarting}
        >
          {isStarting ? "Iniciando..." : "Iniciar Quiz"}
        </button>
      </div>
    </div>
  );
};

// Estilos Inline

const backgroundStyles: React.CSSProperties = {
  backgroundImage: 'url("https://example.com/background.jpg")', // Substitua pela URL da sua imagem ou pelo caminho local
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const containerStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "2rem 3rem",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
};

const titleStyles: React.CSSProperties = {
  fontSize: "2.5rem",
  color: "#333",
  marginBottom: "1.5rem",
};

const countStyles: React.CSSProperties = {
  fontSize: "1.5rem",
  color: "#555",
  marginBottom: "1rem",
};

const buttonStyles: React.CSSProperties = {
  padding: "0.8rem 2.5rem",
  fontSize: "1.2rem",
  backgroundColor: "#02A09D",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  marginTop: "1rem",
};

const noQuizStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "1.5rem",
  color: "#777",
};

const successMessageStyle: React.CSSProperties = {
  color: "green",
  marginTop: "1rem",
  marginBottom: "1rem",
  fontWeight: "bold",
};

const errorMessageStyle: React.CSSProperties = {
  color: "red",
  marginTop: "1rem",
  marginBottom: "1rem",
  fontWeight: "bold",
};

export default QuizAdminPage;
