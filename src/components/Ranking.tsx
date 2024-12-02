// src/components/Ranking.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api"; 
import "../styles/Ranking.css"; 

interface Quiz {
  id: number;
  title: string;
  code: string;
  user: User;
  guests: Guest[];
  questions: Question[];
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  // Adicione outros campos se necessário
}

interface Guest {
  id: number;
  name: string;
  ip: string;
  score: number;
  profileUrl: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  quizId: number;
}

const Ranking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizCode: string | null = queryParams.get("code");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!quizCode) {
      alert("Código do quiz não fornecido.");
      navigate("/");
      return;
    }

    const fetchRanking = async () => {
      try {
        const response = await api.get<Quiz>(`/quiz/ranking/${quizCode}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setQuiz(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Erro ao buscar ranking:", err);
        setError("Ocorreu um erro ao buscar o ranking.");
        setLoading(false);
      }
    };

    // Função para buscar o ranking a cada 0.3 segundos
    const intervalId = setInterval(() => {
      fetchRanking();
    }, 300); // 300ms

    // Busca imediata ao montar o componente
    fetchRanking();

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [quizCode, navigate]);

  if (loading) {
    return (
      <div className="ranking-container">
        <h2>Carregando ranking...</h2>
        {/* Você pode adicionar um spinner ou algum indicador de carregamento */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-container">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Voltar para Home</button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="ranking-container">
        <h2>Quiz não encontrado.</h2>
        <button onClick={() => navigate("/")}>Voltar para Home</button>
      </div>
    );
  }

  // Ordenar os guests pelo score em ordem decrescente
  const sortedGuests = [...quiz.guests].sort((a, b) => b.score - a.score);

  return (
    <div className="ranking-container">
      <h1>Ranking - {quiz.title}</h1>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Posição</th>
            <th>Perfil</th>
            <th>Nome</th>
            <th>Pontuação</th>
          </tr>
        </thead>
        <tbody>
          {sortedGuests.map((guest, index) => (
            <tr key={guest.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={guest.profileUrl}
                  alt={`${guest.name} Perfil`}
                  className="profile-image"
                />
              </td>
              <td>{guest.name}</td>
              <td>{guest.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/")} className="back-button">
        Voltar para Home
      </button>
    </div>
  );
};

export default Ranking;
