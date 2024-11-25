import { useEffect, useState } from "react";
import Modal from "react-modal";
import QuizList from "./QuizList";
import GuestManagement from "./GuestManagement";
import QuizRanking from "./QuizRanking";
import AddQuizForm from "./AddQuizForm";
import QuestionList from "./QuestionList";
import { useQuizApi } from "../context/QuizApiContext";

// Define the app element for Modal to manage accessibility
Modal.setAppElement("#root");

const QuizManagement = () => {
  // State hooks
  const { quizzes } = useQuizApi();
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  useEffect(() => {
    quizzes;
  }, []);
  // Modal management functions
  const openGuestModal = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsGuestModalOpen(true);
  };

  const openRankingModal = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsRankingModalOpen(true);
  };

  const openAddQuizModal = () => {
    setIsAddQuizModalOpen(true);
  };

  const openAddQuestionModal = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsAddQuestionModalOpen(true);
  };

  const closeModal = () => {
    setIsGuestModalOpen(false);
    setIsRankingModalOpen(false);
    setIsAddQuizModalOpen(false);
    setIsAddQuestionModalOpen(false);
  };

  const addQuiz = (quizName: string) => {
    console.log("Adding quiz:", quizName);
  };

  return (
    <div className="quiz-management-container">
      <div className="header">
        <h2>Meus Quizzes</h2>
        <button
          onClick={() => navigate("/add-quiz")}
          className="add-quiz-button"
        >
          Adicionar Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <p>Nenhum quiz adicionado ainda.</p>
      ) : (
        <div className="quiz-cards">
          {quizzes.map((quiz, index) => (
            <div key={index} className="quiz-card">
              <h3>{quiz.nome}</h3>
              <QRCodeCanvas value={generateQuizURL(quiz)} size={128} />
              <div className="card-buttons">
                <button onClick={() => openModal(quiz)}>Ver Respostas</button>
                <button
                  onClick={() =>
                    navigate(
                      `/respond?data=${encodeURIComponent(
                        JSON.stringify(quiz)
                      )}`
                    )
                  }
                >
                  Responder
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Você tem certeza que deseja remover este quiz?"
                      )
                    ) {
                      removeQuiz(index);
                    }
                  }}
                  className="remove-button"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalData.isOpen && modalData.quiz && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Respostas para: {modalData.quiz.nome}</h3>
            {modalData.quiz.respostas.length === 0 ? (
              <p>Nenhum usuário respondeu a este quiz ainda.</p>
            ) : (
              <ul>
                {modalData.quiz.respostas.map((resp: any, respIndex: any) => (
                  <li key={respIndex} className="response-item">
                    <strong>Nome:</strong> {resp.nome}
                    <br />
                    <strong>Data:</strong>{" "}
                    {new Date(resp.data).toLocaleString()}
                    <br />
                    <strong>Respostas:</strong>
                    <ul>
                      {resp.respostas.map((resposta: any, qIndex: any) => (
                        <li key={qIndex}>
                          Pergunta {qIndex + 1}:{" "}
                          {modalData.quiz.perguntas[qIndex].opcoes[resposta]} -{" "}
                          {resposta ===
                          modalData.quiz.perguntas[qIndex].respostaCerta
                            ? "✅ Correta"
                            : "❌ Incorreta"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={closeModal} className="close-modal-button">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
