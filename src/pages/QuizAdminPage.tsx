import React, { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaTrashAlt } from "react-icons/fa";
import { IconContext } from "react-icons";

const QuizAdminPage: React.FC = () => {
  const { quizSelected, listQuizzes, setQuizSelected } = useQuizApi();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [removingGuestId, setRemovingGuestId] = useState<number | null>(null);

  if (!quizSelected) {
    return (
      <div style={noQuizStyle}>
        <p style={noQuizTextStyle}>Nenhum quiz selecionado.</p>
      </div>
    );
  }

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  const handleStartQuiz = async () => {
    setIsStarting(true);
    try {
      const response = await api.put(
        `/quiz`,
        {
          id: quizSelected.id,
          title: quizSelected.title,
          status: "IN_PROGRESS",
        },
        { headers: getAuthHeaders() }
      );
      const updatedQuiz = response.data;
      console.log("🚀 ~ handleStartQuiz ~ updatedQuiz:", updatedQuiz);
      setQuizSelected(updatedQuiz);
      listQuizzes();
      navigate("/ranking?code=" + quizSelected.code);
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
    console.log(`Bearer ${localStorage.getItem("authToken")}`)
    console.log(`Bearer ${localStorage.getItem("authToken")}`)
    console.log(`Bearer ${localStorage.getItem("authToken")}`)
    console.log(`Bearer ${localStorage.getItem("authToken")}`)
    console.log(`Bearer ${localStorage.getItem("authToken")}`)
    console.log(`Bearer ${localStorage.getItem("authToken")}`)
    try {
      await api.delete(`https://api-teste-a.5lsiua.easypanel.host/quiz/guest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        data: {
          guestId: guestId,
          quizCode: quizSelected.code,
        },
      });
      alert("Convidado removido com sucesso.");

      setQuizSelected({
        ...quizSelected,
        guests: quizSelected.guests.filter(
          (guest: any) => guest.id !== guestId
        ),
      });
      listQuizzes();
    } catch (error) {
      console.error("Erro ao remover o convidado:", error);
      alert(
        "Ocorreu um erro ao remover o convidado. Por favor, tente novamente."
      );
    } finally {
      setRemovingGuestId(null);
    }
  };

  return (
    <div style={backgroundStyles}>
      <div style={containerStyles}>
        <h1 style={titleStyles}>{quizSelected.title}</h1>
        <p style={countStyles}>
          Número de participantes: {quizSelected.guests.length}
        </p>
        <div style={guestsContainerStyles}>
          {quizSelected.guests.map((guest: any) => (
            <div key={guest.id} style={guestCardStyles}>
              <img
                src={guest.profileUrl}
                alt={guest.name}
                style={guestImageStyles}
              />
              <p style={guestNameStyles}>{guest.name}</p>
              {/* <button
                style={removeButtonStyles}
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
              </button> */}
            </div>
          ))}
        </div>
        <button
          style={
            isStarting
              ? { ...buttonStyles, ...buttonDisabledStyles }
              : buttonStyles
          }
          onClick={handleStartQuiz}
          disabled={isStarting}
        >
          {isStarting ? "Iniciando..." : "Iniciar Quiz"}
        </button>
      </div>
    </div>
  );
};

const backgroundStyles: React.CSSProperties = {
  backgroundImage: 'url("https://example.com/background.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  boxSizing: "border-box",
};

const containerStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: "2rem",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  maxWidth: "900px",
  width: "100%",
};

const titleStyles: React.CSSProperties = {
  fontSize: "2.5rem",
  color: "#333",
  marginBottom: "1rem",
  fontFamily: "'Roboto', sans-serif",
};

const countStyles: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#555",
  marginBottom: "2rem",
  fontFamily: "'Roboto', sans-serif",
};

const guestsContainerStyles: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "1.5rem",
  marginBottom: "2rem",
};

const guestCardStyles: React.CSSProperties = {
  backgroundColor: "#f9f9f9",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  width: "180px",
  position: "relative",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "default",
};

const guestImageStyles: React.CSSProperties = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "0.5rem",
  border: "2px solid #02A09D",
};

const guestNameStyles: React.CSSProperties = {
  fontSize: "1rem",
  color: "#333",
  fontFamily: "'Roboto', sans-serif",
  marginBottom: "0.5rem",
};

const removeButtonStyles: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.2s",
};

const buttonStyles: React.CSSProperties = {
  padding: "0.8rem 2.5rem",
  fontSize: "1.2rem",
  backgroundColor: "#02A09D",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease, transform 0.2s",
  fontFamily: "'Roboto', sans-serif",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const buttonDisabledStyles: React.CSSProperties = {
  backgroundColor: "#a0a0a0",
  cursor: "not-allowed",
};

const noQuizStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f0f0f0",
};

const noQuizTextStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  color: "#666",
  fontFamily: "'Roboto', sans-serif",
};

export default QuizAdminPage;
