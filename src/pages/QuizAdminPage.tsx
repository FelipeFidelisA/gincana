// src/pages/QuizAdminPage.tsx

import React, { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api"; // Certifique-se de que o caminho está correto

const QuizAdminPage: React.FC = () => {
  const { quizSelected, listQuizzes, setQuizSelected } = useQuizApi();
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  // Se nenhum quiz estiver selecionado, exibe uma mensagem
  if (!quizSelected) {
    return (
      <div style={noQuizStyle}>
        <p>Nenhum quiz selecionado.</p>
      </div>
    );
  }

  // Função para obter os headers de autenticação
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  // Função para iniciar o quiz
  const handleStartQuiz = async () => {
    if (window.confirm("Você tem certeza que deseja iniciar este quiz?")) {
      setIsStarting(true);
      try {
        // Supondo que o endpoint para iniciar o quiz seja PUT /quiz/{id}/start
        const response = await api.put(
          `/quiz/${quizSelected.id}/start`,
          {},
          { headers: getAuthHeaders() }
        );

        // Atualiza o quiz selecionado com os novos dados retornados pela API
        const updatedQuiz = response.data;
        setQuizSelected(updatedQuiz);
        listQuizzes();

        // Redireciona para uma página de confirmação ou para a página do quiz em andamento
        navigate("/quizstarted"); // Ajuste a rota conforme necessário
      } catch (error) {
        console.error("Erro ao iniciar o quiz:", error);
        alert("Ocorreu um erro ao iniciar o quiz. Por favor, tente novamente.");
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
  backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  marginBottom: "2rem",
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
};

const noQuizStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

export default QuizAdminPage;
