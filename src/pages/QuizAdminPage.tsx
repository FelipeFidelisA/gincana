import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import { api } from "../api";
import "../styles/QuizAdminPage.css";
import { QRCodeCanvas } from "qrcode.react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

interface Quiz {
  id: number;
  title: string;
  code: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  guests: Guest[];
  questions: Question[];
  status: string;
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

const QuizAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizCode: string | null = queryParams.get("code");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [removingGuestId, setRemovingGuestId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  const fetchQuizData = async () => {
    if (!quizCode) {
      setError("Código do quiz não fornecido na URL.");
      return;
    }

    try {
      const response = await api.get<Quiz>(`/quiz/code/${quizCode}`);
      setQuiz(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados do quiz:", err);
      setError("Erro ao buscar dados do quiz. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    fetchQuizData();

    const interval = setInterval(() => {
      fetchQuizData();
    }, 500);

    return () => clearInterval(interval);
  }, [quizCode]);

  const handleStartQuiz = async () => {
    if (!quiz) return;

    setIsStarting(true);
    try {
      const response = await api.put(
        `/quiz`,
        {
          id: quiz.id,
          title: quiz.title,
          status: "IN_PROGRESS",
        },
        { headers: getAuthHeaders() }
      );
      const updatedQuiz = response.data;
      setQuiz(updatedQuiz);
      alert("Quiz iniciado com sucesso!");
    } catch (error) {
      console.error("Erro ao iniciar o quiz:", error);
      alert("Ocorreu um erro ao iniciar o quiz. Por favor, tente novamente.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleRemoveGuest = async (guestId: number) => {
    const confirmRemove = window.confirm(
      "Tem certeza de que deseja remover este convidado?"
    );
    if (!confirmRemove) return;

    setRemovingGuestId(guestId);
    try {
      await api.delete(`/quiz/guest`, {
        headers: getAuthHeaders(),
        data: {
          guestId: guestId,
          quizCode: quizCode,
        },
      });
      alert("Convidado removido com sucesso.");

      setQuiz((prevQuiz) =>
        prevQuiz
          ? {
              ...prevQuiz,
              guests: prevQuiz.guests.filter((guest) => guest.id !== guestId),
            }
          : prevQuiz
      );
    } catch (error) {
      console.error("Erro ao remover o convidado:", error);
      alert(
        "Ocorreu um erro ao remover o convidado. Por favor, tente novamente."
      );
    } finally {
      setRemovingGuestId(null);
    }
  };

  const sortedGuests = React.useMemo(() => {
    if (!quiz) return [];
    return quiz.guests.slice().sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (a.ip < b.ip) return -1;
      if (a.ip > b.ip) return 1;
      return 0;
    });
  }, [quiz]);

  const topGuests = sortedGuests.slice(0, 5);
  const remainingGuests = sortedGuests.slice(5);

  const generateQuizURL = (quiz: any) =>
    `${window.location.origin}/respond?code=${quiz.code}`;

  const qrCodeStyles: React.CSSProperties = {
    marginBottom: "1.5rem",
  };

  const chartData = {
    labels: topGuests.map((guest) => guest.name + "#" + guest.ip.slice(-4)),
    datasets: [
      {
        label: "Pontuação",
        data: topGuests.map((guest) => guest.score),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="admin-background">
      <div className="admin-container">
        {error && <p className="error-message">{error}</p>}
        {!error && !quiz && <p className="loading-message">Carregando...</p>}
        {quiz && (
          <>
            <h1 className="admin-title">{quiz.title}</h1>
            <div className="main-content">
              <div className="top-section">
                <div className="qr-code-section">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: "1rem",
                      width: "100%",
                      backgroundColor: "transparent",
                    }}
                  >
                    <button
                      style={{
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: 600,
                        alignSelf: "end",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        transition:
                          "background-color 0.3s ease, transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "rgba(0, 0, 0, 0.4)";
                        (e.target as HTMLElement).style.transform =
                          "translateY(-5px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "rgba(0, 0, 0, 0.2)";
                        (e.target as HTMLElement).style.transform =
                          "translateY(0)";
                      }}
                      onClick={() => navigate("/manage")}
                    >
                      Voltar ao menu
                    </button>
                  </div>

                  <QRCodeCanvas
                    value={generateQuizURL(quiz)}
                    size={300}
                    style={qrCodeStyles}
                  />
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "1rem",
                      textShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Número de participantes: {quiz.guests.length}
                  </p>
                  <button
                    className={`start-quiz-button ${
                      isStarting || quiz.status !== "WAITING_GUESTS"
                        ? "disabled"
                        : ""
                    }`}
                    onClick={handleStartQuiz}
                    disabled={isStarting || quiz.status !== "WAITING_GUESTS"}
                  >
                    {isStarting
                      ? "Iniciando..."
                      : quiz.status === "IN_PROGRESS" || quiz.status === "END"
                      ? "Quiz já iniciado"
                      : "Iniciar Quiz"}
                  </button>
                </div>
                <div className="chart-section">
                  <h2 className="chart-title">Top 5 Participantes</h2>
                  <div style={{ height: "400px", width: "100%" }}>
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
                <div className="remaining-guests-section">
                  <h2 className="remaining-guests-title">
                    Outros Participantes
                  </h2>
                  <div className="remaining-guests-list">
                    {remainingGuests.length > 0 ? (
                      remainingGuests.map((guest) => (
                        <div key={guest.id} className="remaining-guest-item">
                          <img
                            src={guest.profileUrl}
                            alt={guest.name}
                            className="remaining-guest-image"
                          />
                          <p className="remaining-guest-name">
                            {guest.name} #{guest.ip.slice(-4)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "1.2rem",
                          color: "#fff",
                          fontWeight: 600,
                          textShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        Nenhum outro participante.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="guest-list-section">
                <h2 className="guest-list-title">Participantes</h2>
                <div className="guests-grid">
                  {sortedGuests.length > 0 ? (
                    sortedGuests.map((guest) => (
                      <div key={guest.id} className="guest-card">
                        <img
                          src={guest.profileUrl}
                          alt={guest.name + "#" + guest.ip.slice(-4)}
                          className="guest-image"
                        />
                        <p
                          style={{
                            color: "black",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            textShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {guest.name} #{guest.ip.slice(-4)}
                        </p>
                        <button
                          className="remove-button"
                          onClick={() => handleRemoveGuest(guest.id)}
                          disabled={removingGuestId === guest.id}
                          title="Remover Convidado"
                        >
                          {removingGuestId === guest.id ? (
                            "Removendo..."
                          ) : (
                            <IconContext.Provider
                              value={{ color: "#e74c3c", size: "1.2em" }}
                            >
                              <FaTrashAlt />
                            </IconContext.Provider>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        color: "#fff",
                        fontWeight: 600,
                        textShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Nenhum participante no momento.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAdminPage;
