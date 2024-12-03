import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Question, Option, Quiz, Guest } from "../../context/QuizApiContext";
import { useQuizApi } from "../../context/QuizApiContext";

interface QuizModalProps {
  modalData: {
    isOpen: boolean;
    quiz: Quiz | null;
  };
  closeModal: () => void;
}

interface QuestionWithOptions extends Question {
  options: Option[];
}

const COLORS = {
  primary: "#3498db",
  secondary: "#2ecc71",
  danger: "#e74c3c",
  warning: "#f1c40f",
  background: "#ffffff",
  lightGray: "#ecf0f1",
  darkGray: "#7f8c8d",
};

const customStyles: Modal.Styles = {
  content: {
    maxWidth: "900px",
    margin: "auto",
    borderRadius: "12px",
    padding: "40px",
    overflow: "auto",
    zIndex: 300,
    backgroundColor: COLORS.background,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    fontFamily: "'Roboto', sans-serif",
    overflowY: "scroll",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const containerStyle: React.CSSProperties = {
  position: "relative",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const headerTitleStyle: React.CSSProperties = {
  color: COLORS.primary,
  fontSize: "2rem",
  fontWeight: 700,
};

const closeButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  fontSize: "2rem",
  color: COLORS.danger,
  cursor: "pointer",
  transition: "color 0.3s",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "30px",
};

const sectionHeaderStyle: React.CSSProperties = {
  color: COLORS.secondary,
  borderBottom: `3px solid ${COLORS.secondary}`,
  paddingBottom: "8px",
  marginBottom: "20px",
  fontSize: "1.5rem",
  fontWeight: 600,
};

const infoTextStyle: React.CSSProperties = {
  color: COLORS.darkGray,
  fontSize: "1rem",
  marginBottom: "10px",
};

const statusStyle = (status: string): React.CSSProperties => {
  let color = COLORS.darkGray;
  switch (status.toLowerCase()) {
    case "ativo":
      color = COLORS.secondary;
      break;
    case "inativo":
      color = COLORS.danger;
      break;
    case "pendente":
      color = COLORS.warning;
      break;
    default:
      color = COLORS.darkGray;
  }
  return { color, fontWeight: 600 };
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const tableHeaderStyle: React.CSSProperties = {
  border: `2px solid ${COLORS.lightGray}`,
  padding: "12px",
  backgroundColor: COLORS.primary,
  color: COLORS.background,
  textAlign: "left",
};

const tableCellStyle: React.CSSProperties = {
  border: `1px solid ${COLORS.lightGray}`,
  padding: "12px",
  color: COLORS.darkGray,
};

const loadingStyle: React.CSSProperties = {
  color: COLORS.warning,
  fontWeight: 600,
};

const errorStyle: React.CSSProperties = {
  color: COLORS.danger,
  fontWeight: 600,
};

const questionContainerStyle: React.CSSProperties = {
  marginBottom: "25px",
  padding: "20px",
  border: `1px solid ${COLORS.lightGray}`,
  borderRadius: "8px",
  backgroundColor: "#f8f9fa",
};

const questionTitleStyle: React.CSSProperties = {
  color: COLORS.primary,
  fontSize: "1.25rem",
  marginBottom: "10px",
  fontWeight: 600,
};

const optionsListStyle: React.CSSProperties = {
  listStyleType: "circle",
  paddingLeft: "25px",
};

const optionItemStyle: React.CSSProperties = {
  marginBottom: "8px",
  color: COLORS.darkGray,
};

const correctOptionStyle: React.CSSProperties = {
  color: COLORS.secondary,
  fontWeight: 700,
};

const Header: React.FC<{ closeModal: () => void }> = ({ closeModal }) => (
  <div style={headerStyle}>
    <h2 style={headerTitleStyle}>Detalhes do Quiz</h2>
    <button
      onClick={closeModal}
      style={closeButtonStyle}
      aria-label="Fechar Modal"
      onMouseOver={(e) => (e.currentTarget.style.color = COLORS.primary)}
      onMouseOut={(e) => (e.currentTarget.style.color = COLORS.danger)}
    >
      &times;
    </button>
  </div>
);

const GeneralInfo: React.FC<{ quiz: Quiz }> = ({ quiz }) => (
  <section style={sectionStyle}>
    <h3 style={sectionHeaderStyle}>Informações Gerais</h3>
    <p style={infoTextStyle}>
      <strong>Título:</strong> {quiz.title}
    </p>
    <p style={infoTextStyle}>
      <strong>Código:</strong> {quiz.code}
    </p>
    <p style={infoTextStyle}>
      <strong>Status:</strong>{" "}
      <span style={statusStyle(quiz.status)}>{quiz.status}</span>
    </p>
  </section>
);

const GuestsSection: React.FC<{ guests: Guest[] }> = ({ guests }) => (
  <section style={sectionStyle}>
    <h3 style={sectionHeaderStyle}>Convidados</h3>
    {guests.length === 0 ? (
      <p style={infoTextStyle}>Nenhum convidado adicionado.</p>
    ) : (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Nome</th>
            <th style={tableHeaderStyle}>IP</th>
            <th style={tableHeaderStyle}>Pontuação</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest: any) => (
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
);

const QuestionsSection: React.FC<{
  questionsWithOptions: QuestionWithOptions[];
  loading: boolean;
  error: string | null;
}> = ({ questionsWithOptions, loading, error }) => (
  <section style={sectionStyle}>
    <h3 style={sectionHeaderStyle}>Perguntas</h3>
    {loading && <p style={loadingStyle}>Carregando opções das perguntas...</p>}
    {error && <p style={errorStyle}>{error}</p>}
    {!loading && !error && (
      <>
        {questionsWithOptions.length > 0 ? (
          questionsWithOptions.map((question, index) => (
            <div key={question.id} style={questionContainerStyle}>
              <h4 style={questionTitleStyle}>
                {index + 1}. {question.title}
              </h4>
              <p style={infoTextStyle}>{question.description}</p>
              {question.options && question.options.length > 0 ? (
                <ul style={optionsListStyle}>
                  {question.options.map((option) => (
                    <li key={option.id} style={optionItemStyle}>
                      {option.description}{" "}
                      {option.isRight && (
                        <strong style={correctOptionStyle}>(Correta)</strong>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={infoTextStyle}>
                  Nenhuma opção adicionada para esta pergunta.
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={infoTextStyle}>Nenhuma pergunta adicionada.</p>
        )}
      </>
    )}
  </section>
);

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
          console.error("Erro ao carregar opções para as perguntas:", err);
          setError("Falha ao carregar opções para algumas perguntas.");
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
      style={customStyles}
      ariaHideApp={false}
    >
      <div style={containerStyle}>
        <Header closeModal={closeModal} />
        <GeneralInfo quiz={quiz} />
        <GuestsSection guests={quiz.guests} />
        <QuestionsSection
          questionsWithOptions={questionsWithOptions}
          loading={loading}
          error={error}
        />
      </div>
    </Modal>
  );
};

export default QuizModal;
