// components/QuizManagement/QuizModal.tsx

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Quiz, Question, Option } from "../../context/QuizApiContext";
import { useQuizApi } from "../../context/QuizApiContext";

interface QuizModalProps {
  modalData: {
    isOpen: boolean;
    quiz: Quiz | null;
    type: string; // To determine the modal type
  };
  closeModal: () => void;
}

interface QuestionWithOptions extends Question {
  options: Option[];
}

const QuizModal: React.FC<QuizModalProps> = ({ modalData, closeModal }) => {
  const { isOpen, quiz } = modalData;
  const { fetchOptionsForQuestion } = useQuizApi();

  const [questionsWithOptions, setQuestionsWithOptions] = useState<
    QuestionWithOptions[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      if (quiz && quiz.questions.length > 0) {
        setLoading(true);
        setError(null);
        try {
          const promises = quiz.questions.map(async (question) => {
            const options = await fetchOptionsForQuestion(question.id);
            return { ...question, options };
          });
          const results = await Promise.all(promises);
          setQuestionsWithOptions(results);
        } catch (err) {
          console.error("Error loading options for questions:", err);
          setError("Failed to load options for some questions.");
        } finally {
          setLoading(false);
        }
      } else {
        setQuestionsWithOptions([]);
      }
    };

    if (isOpen && quiz) {
      loadOptions();
    }
  }, [isOpen, quiz, fetchOptionsForQuestion]);
  if (!quiz) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Detalhes do Quiz"
      style={{
        content: {
          maxWidth: "800px",
          margin: "auto",
          borderRadius: "10px",
          padding: "20px",
          overflow: "auto",
          zIndex: 300,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <div style={{ fontFamily: "Poppins, sans-serif", position: "relative" }}>
        <h2>Detalhes do Quiz</h2>
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <section style={{ marginBottom: "20px" }}>
          <h3>Informações Gerais</h3>
          <p>
            <strong>Título:</strong> {quiz.title}
          </p>
          <p>
            <strong>Código:</strong> {quiz.code}
          </p>
          <p>
            <strong>Status:</strong> {quiz.status}
          </p>
        </section>

        <section style={{ marginBottom: "20px" }}>
          <h3>Informações do Usuário</h3>
          <p>
            <strong>Nome:</strong> {quiz.user.name}
          </p>
          <p>
            <strong>Email:</strong> {quiz.user.email}
          </p>
        </section>

        <section style={{ marginBottom: "20px" }}>
          <h3>Convidados</h3>
          {quiz.guests.length === 0 ? (
            <p>Nenhum convidado adicionado.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Nome</th>
                  <th style={tableHeaderStyle}>IP</th>
                  <th style={tableHeaderStyle}>Pontuação</th>
                </tr>
              </thead>
              <tbody>
                {quiz.guests.map((guest: any) => (
                  <tr key={guest.id}>
                    <td style={tableCellStyle}>{guest.name}</td>
                    <td style={tableCellStyle}>{guest.ip}</td>
                    <td style={tableCellStyle}>{guest.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h3>Perguntas</h3>
          {loading && <p>Carregando opções das perguntas...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {questionsWithOptions.length > 0
            ? questionsWithOptions.map((question, qIndex) => (
                <div key={question.id} style={{ marginBottom: "15px" }}>
                  <h4>
                    {qIndex + 1}. {question.title}
                  </h4>
                  <p>{question.description}</p>
                  {question.options && question.options.length > 0 ? (
                    <ul>
                      {question.options.map((option) => (
                        <li key={option.id}>
                          {option.description}{" "}
                          {option.isRight && <strong>(Correta)</strong>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhuma opção adicionada para esta pergunta.</p>
                  )}
                </div>
              ))
            : !loading && <p>Nenhuma pergunta adicionada.</p>}
        </section>
      </div>
    </Modal>
  );
};

// Styles for table headers and cells
const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tableCellStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default QuizModal;
