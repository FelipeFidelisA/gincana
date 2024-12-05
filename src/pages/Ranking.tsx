// Ranking.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import "../styles/Ranking.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
        const response = await api.get<Quiz>(`/quiz/code/${quizCode}`);
        setQuiz(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Erro ao buscar ranking:", err);
        setError("Ocorreu um erro ao buscar o ranking.");
        setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      fetchRanking();
    }, 1000); // Atualiza a cada 3 segundos

    fetchRanking();

    return () => clearInterval(intervalId);
  }, [quizCode, navigate]);

  if (loading) {
    return (
      <div className="ranking-container">
        <h2>Carregando ranking...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-container">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")} className="back-button">
          Voltar para Home
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="ranking-container">
        <h2>Quiz não encontrado.</h2>
        <button onClick={() => navigate("/")} className="back-button">
          Voltar para Home
        </button>
      </div>
    );
  }

  const sortedGuests = [...quiz.guests].sort((a, b) => b.score - a.score);
  const topGuests = sortedGuests.slice(0, 5);
  const otherGuests = sortedGuests.slice(5);

  // Preparação dos dados para o gráfico (apenas Top 5)
  const chartData = {
    labels: topGuests.map((guest) => guest.name),
    datasets: [
      {
        label: "Pontuação",
        data: topGuests.map((guest) => guest.score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
          font: {
            size: 14,
            family: "Poppins, sans-serif",
            weight: 600,
          },
        },
        grid: {
          color: "#fff",
        },
      },
      x: {
        ticks: {
          color: "#fff",
          font: {
            size: 14,
            family: "Poppins, sans-serif",
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="ranking-container">
      <h1>Ranking - {quiz.title}</h1>
      <div className="ranking-content">
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="others-container">
          <h2>Top 5 Melhores</h2>
          <ul className="others-list">
            {topGuests.map((guest) => (
              <li key={guest.id}>
                <img
                  src={guest.profileUrl}
                  alt={`${guest.name} Perfil`}
                  className="profile-image"
                />
                <span className="guest-name">{guest.name}</span>
                <span className="guest-score">{guest.score} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {otherGuests.length > 0 && (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              Outros Participantes
            </h2>
          </div>
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
              {otherGuests.map((guest, index) => (
                <tr key={guest.id}>
                  <td>{index + 6}</td>{" "}
                  {/* Ajusta a posição considerando os top 5 */}
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
        </div>
      )}
      <button onClick={() => navigate("/")} className="back-button">
        Voltar para Home
      </button>
    </div>
  );
};

export default Ranking;
