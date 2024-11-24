import { useNavigate } from "react-router-dom";

const QuizList = ({
  quizzes,
  onOpenGuestModal,
  onOpenRankingModal,
  onOpenAddQuestionModal,
}: any) => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}>
        Available Quizzes
      </h2>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {quizzes.map((quiz: any) => (
          <li
            key={quiz.id}
            style={{
              backgroundColor: "#f4f4f4",
              marginBottom: "10px",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "bold" }}>{quiz.id}</span>
              <span>{quiz.code}</span>
              <span style={{ fontStyle: "italic" }}>{quiz.title}</span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* Manage Guests Button */}
              <button
                onClick={() => onOpenGuestModal(quiz.id)}
                style={{
                  backgroundColor: "#02A09D",
                  color: "#fff",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Manage Guests
              </button>

              {/* View Rankings Button */}
              <button
                onClick={() => onOpenRankingModal(quiz.id)}
                style={{
                  backgroundColor: "#DF5C0F",
                  color: "#fff",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                View Rankings
              </button>

              {/* Add Question Button */}
              <button
                onClick={() => onOpenAddQuestionModal(quiz.id)}
                style={{
                  backgroundColor: "#035F9B",
                  color: "#fff",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Manage Questions
              </button>

              <button onClick={() => navigate(`/respond?code=${quiz.code}`)}>
                responder quiz
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
