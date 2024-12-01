import { useState } from "react";
import Modal from "react-modal";
import { useQuizApi } from "../../context/QuizApiContext";
import { useNavigate } from "react-router-dom";
import QuizCard from "../QuizManagement/QuizCard";
import QuizModal from "../QuizManagement/QuizModal";
import GuestManagement from "../../pages/GuestManagement.tsx";
import QuizRanking from "../../pages/QuizRanking.tsx";
import AddQuizForm from "../../pages/AddQuizForm.tsx";
import QuestionList from "../../pages/QuestionList.tsx";
import { FaPlus } from "react-icons/fa"; // Ícone de adicionar quiz

Modal.setAppElement("#root");

const QuizManagement = () => {
  const { quizzes } = useQuizApi();
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [modalData, setModalData] = useState<any>({
    isOpen: false,
    quiz: null,
  });
  const navigate = useNavigate();

  const addQuiz = (newQuiz: any) => {
    // Add logic to handle adding a new quiz
    console.log("Quiz added:", newQuiz);
  };

  const openModal = (quiz: any) => {
    setModalData({ isOpen: true, quiz });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, quiz: null });
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
          {quizzes.map((quiz: any, index: number) => (
            <QuizCard key={index} quiz={quiz} openModal={openModal} />
          ))}
        </div>
      )}

      <QuizModal modalData={modalData} closeModal={closeModal} />

      <Modal
        isOpen={modalData.isOpen}
        onRequestClose={closeModal}
        contentLabel="Guest Management"
      >
        <GuestManagement quizId={selectedQuizId} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalData.isOpen}
        onRequestClose={closeModal}
        contentLabel="Quiz Ranking"
      >
        <QuizRanking quizId={selectedQuizId} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalData.isOpen}
        onRequestClose={closeModal}
        contentLabel="Add Quiz"
      >
        <AddQuizForm onAddQuiz={addQuiz} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={modalData.isOpen}
        onRequestClose={closeModal}
        contentLabel="Add Question"
      >
        <QuestionList quizId={selectedQuizId} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default QuizManagement;
