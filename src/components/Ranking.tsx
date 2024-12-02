// src/components/Ranking.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import "../styles/Ranking.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import CountUp from "react-countup";

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
        const response = await api.get<Quiz>(`/quiz/code/${quizCode}`, {
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
  let sortedGuests = [...quiz.guests].sort((a, b) => b.score - a.score);

  // Excluir os guests com score 0
  sortedGuests = sortedGuests.filter((guest) => guest.score > 0);

  // Aumentar a precisão do score para evitar empates
  sortedGuests = sortedGuests.map((guest) => ({
    ...guest,
    score: parseFloat(guest.score.toFixed(2)),
  }));

  // Pegar os top 10
  const topGuests = sortedGuests.slice(0, 10);

  // Preparar os dados para o gráfico
  const data = topGuests.map((guest) => ({
    name: guest.name,
    score: guest.score,
    profileUrl: guest.profileUrl,
    id: guest.id,
  }));

  // Definir cores para as barras (opcional)
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c"];

  return (
    <div className="ranking-container">
      <h1>Ranking - {quiz.title}</h1>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <XAxis dataKey="name" tick={{ fill: "#333", fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" animationDuration={1500}>
              {data.map((index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="score"
                position="top"
                content={({ x, y, value }) => (
                  <text x={x} y={y} dy={-10} fill="#333" textAnchor="middle">
                    <CountUp
                      end={typeof value === "number" ? value : 0}
                      duration={1.5}
                      decimals={2}
                    />
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Listar os demais participantes */}
      {sortedGuests.length > 10 && (
        <div className="other-participants">
          <h2>Outros Participantes</h2>
          <ul>
            {sortedGuests.slice(10).map((guest, index) => (
              <li key={guest.id}>
                {index + 11}. {guest.name} - {guest.score}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/")} className="back-button">
        Voltar para Home
      </button>
    </div>
  );
};

export default Ranking;
