import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useQuizApi } from "../../context/QuizApiContext";
import Modal from "react-modal";
import QuizCard from "./QuizCard";
import QuizModal from "./QuizModal";
import QuestionList from "../QuestionList";

Modal.setAppElement("#root");

const QuizManagement: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    // chama navigate sempre que token mudar ou estiver ausente
  }, [token, navigate]);

  const { quizzes, listQuizzes, listQuestions } = useQuizApi();
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (quizzes.length > 0) {
        return;
      }
      // Chama listQuizzes até que quizzes não seja mais um array vazio
      while (quizzes.length > 0) {
        await listQuizzes();
        // Para cada quiz, chama listQuestions
        for (const quiz of quizzes) {
          await listQuestions(quiz.id);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Espera 1.5s antes de chamar novamente
      }
    };
    fetchQuizzes();
  }, [quizzes, listQuizzes]);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    quiz: any;
    type: string;
  }>({
    isOpen: false,
    quiz: null,
    type: "",
  });

  const openModal = (quiz: any, type: string) => {
    setModalData({ isOpen: true, quiz, type });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, quiz: null, type: "" });
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#fff", fontWeight: "bold" }}>
          Meus Quizzes
        </h2>
        <button
          onClick={() => navigate("/add-quiz")}
          style={{
            backgroundColor: "#02A09D",
            color: "#fff",
            border: "2px solid #028C8A",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s, transform 0.3s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#028C8A";
            (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#02A09D";
            (e.target as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          <FaPlus />
          Adicionar Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
          Nenhum quiz adicionado ainda.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {quizzes.map((quiz: any) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              openModal={(quiz: any, type: any) => openModal(quiz, type)}
            />
          ))}
        </div>
      )}

      <QuizModal modalData={modalData} closeModal={closeModal} />

      <Modal
        isOpen={modalData.isOpen && modalData.type === "addQuestion"}
        onRequestClose={closeModal}
        contentLabel="Add Question"
        style={{
          content: {
            color: "#333",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "500px",
            margin: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        {modalData.quiz && (
          <QuestionList quizId={modalData.quiz.id} onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default QuizManagement;
