import React, { useState, useEffect } from 'react';
import { useQuizApi } from '../context/QuizApiContext';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Modal que exibirá as respostas'
import { QRCodeCanvas } from 'qrcode.react';

Modal.setAppElement('#root'); // Acessibilidade do Modal

// Tipo de dados para o modal
interface ModalData {
  quizCode: string;
  quizTitle: string;
  ranking: any[];
}

const QuizManagement: React.FC = () => {
  const { quizzes, ranking, loading, error, fetchQuizzes, fetchRanking, removeQuiz } = useQuizApi();
  const navigate = useNavigate();

  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quizToRemove, setQuizToRemove] = useState<string | null>(null); // Código do quiz para remoção

  // Carregar quizzes ao montar o componente
  useEffect(() => {
    setTimeout(() => {
      //fetchQuizzes()
    }
      , 10000
    );

  }, [fetchQuizzes]);

  // Função para abrir o modal e buscar as respostas do quiz
  const openModal = async (quizCode: string, quizTitle: string) => {
    await fetchRanking(quizCode);
    setModalData({
      quizCode,
      quizTitle,
      ranking: ranking?.guestRanking || [],
    });
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // Função para remover o quiz
  const handleRemoveQuiz = async () => {
    if (quizToRemove) {
      await removeQuiz(quizToRemove);
      setQuizToRemove(null);
    }
  };

  // Gerar URL para responder o quiz
  const generateQuizUrl = (quizCode: string) => {
    return `/quiz/${quizCode}`;
  };

  // Navegar para a página de responder o quiz
  const handleNavigateToQuiz = (quizCode: string) => {
    navigate(generateQuizUrl(quizCode));
  };

  return (
    <div className="quiz-management">
      <h1>Gerenciamento de Quizzes</h1>

      {loading && <p>Carregando quizzes...</p>}
      {error && <p>{error}</p>}

      {quizzes.length === 0 ? (
        <p>Nenhum quiz foi adicionado. Adicione um novo quiz para começar.</p>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>Código: {quiz.code}</p>

              <div className="quiz-actions">
                {/* QR Code */}
                <div className="qr-code">
                  <QRCodeCanvas value={generateQuizUrl(quiz.code)} />
                </div>

                <button onClick={() => openModal(quiz.code, quiz.title)}>Ver Respostas</button>
                <button onClick={() => handleNavigateToQuiz(quiz.code)}>Responder</button>

                {/* Remover Quiz */}
                <button onClick={() => setQuizToRemove(quiz.code)}>Remover Quiz</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para exibir as respostas */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Respostas do Quiz"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>{modalData?.quizTitle}</h2>

        {modalData?.ranking && modalData.ranking.length > 0 ? (
          <div className="ranking-list">
            {modalData.ranking.map((guest, index) => (
              <div key={index} className="ranking-item">
                <p>{guest.guestName} - Pontuação: {guest.score}</p>
                <p>Respostas:</p>
                <ul>
                  {guest.responses.map((response: any, idx: any) => (
                    <li key={idx}>
                      Pergunta: {response.question} - Sua resposta: {response.answer}{' '}
                      {response.isRight ? '(Correto)' : '(Errado)'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Este quiz ainda não possui respostas.</p>
        )}

        <button onClick={closeModal}>Fechar</button>
      </Modal>

      {/* Confirmação de remoção */}
      {quizToRemove && (
        <div className="remove-quiz-confirmation">
          <p>Você tem certeza que deseja remover este quiz?</p>
          <button onClick={handleRemoveQuiz}>Sim</button>
          <button onClick={() => setQuizToRemove(null)}>Não</button>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
