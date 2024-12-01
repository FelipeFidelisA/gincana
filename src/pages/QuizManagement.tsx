import { useState } from "react";
import Modal from "react-modal";
import GuestManagement from "./GuestManagement";
import QuizRanking from "./QuizRanking";
import AddQuizForm from "./AddQuizForm";
import QuestionList from "./QuestionList";
import { useQuizApi } from "../context/QuizApiContext";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const QuizManagement = () => {
  const { quizzes } = useQuizApi();
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [quizCode, setQuizCode] = useState<string>("");
  const [modalData, setModalData] = useState<any>({
    isOpen: false,
    quiz: null,
  });
  const navigate = useNavigate();

  console.log(setSelectedQuizId);
  console.log(setQuizCode);
  const openModal = (quiz: any) => {
    setModalData({ isOpen: true, quiz });
  };

  const closeModal = () => {
    setIsGuestModalOpen(false);
    setIsRankingModalOpen(false);
    setIsAddQuizModalOpen(false);
    setIsAddQuestionModalOpen(false);
    setModalData({ isOpen: false, quiz: null });
  };

  const removeQuiz = (index: number) => {
    console.log(`Removendo quiz no índice ${index}`);
  };

  const generateQuizURL = (quiz: any) => `https://example.com/quiz/${quiz.id}`;

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
          {quizzes.map((quiz: any, index) => (
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

      {/* Guest Management Modal */}
      <Modal
        isOpen={isGuestModalOpen}
        onRequestClose={closeModal}
        contentLabel="Guest Management"
      >
        <GuestManagement
          quizId={selectedQuizId}
          onClose={closeModal}
          quizCode={quizCode}
        />
      </Modal>

      {/* Quiz Ranking Modal */}
      <Modal
        isOpen={isRankingModalOpen}
        onRequestClose={closeModal}
        contentLabel="Quiz Ranking"
      >
        <QuizRanking quizId={selectedQuizId} onClose={closeModal} />
      </Modal>

      {/* Add Quiz Modal */}
      <Modal
        isOpen={isAddQuizModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Quiz"
      >
        <AddQuizForm onAddQuiz={addQuiz} onClose={closeModal} />
      </Modal>

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddQuestionModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Question"
      >
        <QuestionList quizId={selectedQuizId} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default QuizManagement;
