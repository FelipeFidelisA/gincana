import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useQuizApi } from "../../context/QuizApiContext";
import Modal from "react-modal";
import QuizCard from "./QuizCard";
import QuizModal from "./QuizModal";
import QuestionList from "../QuestionList";

Modal.setAppElement("#root"); 

const QuizManagement: React.FC = () => {
  const { quizzes } = useQuizApi();
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    quiz: any;
    type: string;
  }>({
    isOpen: false,
    quiz: null,
    type: "",
  });
  const navigate = useNavigate();

  const openModal = (quiz: any, type: string) => {
    setModalData({ isOpen: true, quiz, type });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, quiz: null, type: "" });
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#333" }}>Meus Quizzes</h2>
        <button
          onClick={() => navigate("/add-quiz")}
          style={{
            backgroundColor: "#02A09D",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaPlus />
          Adicionar Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <p>Nenhum quiz adicionado ainda.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
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
      >
        {modalData.quiz && (
          <QuestionList quizId={modalData.quiz.id} onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default QuizManagement;
