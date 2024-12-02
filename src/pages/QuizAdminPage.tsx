import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import { api } from "../api";
import "../styles/QuizAdminPage.css";

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizCode: string | null = queryParams.get("code");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [removingGuestId, setRemovingGuestId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para obter headers de autenticação
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  // Função para buscar os dados do quiz
  const fetchQuizData = async () => {
    if (!quizCode) {
      setError("Código do quiz não fornecido na URL.");
      return;
    }

    try {
      const response = await api.get<Quiz>(`/quiz/code/${quizCode}`, {
        headers: getAuthHeaders(),
      });
      setQuiz(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados do quiz:", err);
      setError("Erro ao buscar dados do quiz. Tente novamente mais tarde.");
    }
  };

  // useEffect para buscar dados do quiz ao montar o componente e configurar polling
  useEffect(() => {
    fetchQuizData();

    // Configurar polling a cada 500ms
    const interval = setInterval(() => {
      fetchQuizData();
    }, 500);

    // Limpar intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, [quizCode]);

  // Função para iniciar o quiz
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
      navigate(`/ranking?code=${quiz.code}`);
    } catch (error) {
      console.error("Erro ao iniciar o quiz:", error);
      alert("Ocorreu um erro ao iniciar o quiz. Por favor, tente novamente.");
    } finally {
      setIsStarting(false);
    }
  };

  // Função para remover um convidado
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

      // Atualizar o estado local removendo o convidado
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

  // Ordenar os participantes com base no guest.ip e depois em ordem alfabética pelo nome
  const sortedGuests = React.useMemo(() => {
    if (!quiz) return [];
    return quiz.guests
      .slice()
      .sort((a, b) => a.ip.localeCompare(b.ip))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [quiz]);

  // Renderização condicional com base no estado do quiz
  return (
    <div className="admin-background">
      <div className="admin-container">
        {error && <p className="error-message">{error}</p>}
        {!error && !quiz && <p className="loading-message">Carregando...</p>}

        {quiz && (
          <>
            <h1 className="admin-title">{quiz.title}</h1>
            <p className="admin-count">
              Número de participantes: {quiz.guests.length}
            </p>

            <div className="guests-grid">
              {sortedGuests.length > 0 ? (
                sortedGuests.map((guest) => (
                  <div key={guest.id} className="guest-card">
                    <img
                      src={guest.profileUrl}
                      alt={guest.name}
                      className="guest-image"
                    />
                    <p className="guest-name">{guest.name}</p>
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
                <p>Nenhum participante no momento.</p>
              )}
            </div>

            <button
              className={`start-quiz-button ${isStarting ? "disabled" : ""}`}
              onClick={handleStartQuiz}
              disabled={isStarting}
            >
              {isStarting ? "Iniciando..." : "Iniciar Quiz"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAdminPage;
