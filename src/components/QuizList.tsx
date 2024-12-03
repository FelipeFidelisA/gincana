import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEllipsisVertical } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react";

const QuizList = ({
  quizzes,
  onOpenGuestModal,
  onOpenRankingModal,
  onOpenAddQuestionModal,
}: any) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState<number | null>(null);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}>
        Available Quizzes
      </h2>
      <ul
        style={{
          listStyleType: "none",
          padding: "0",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {quizzes.map((quiz: any) => (
          <li
            key={quiz.id}
            style={{
              width: "250px",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#f4f4f4",
              position: "relative",
            }}
          >
            {/* QR Code */}
            <div
              style={{ position: "relative", width: "150px", height: "150px" }}
            >
              <QRCodeCanvas
                value={`${window.location.origin}/respond?code=${quiz.code}`}
                size={150}
              />
            </div>

            {/* Opções */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <IoEllipsisVertical
                size={20}
                color="black"
                onClick={() =>
                  setShowOptions(showOptions === quiz.id ? null : quiz.id)
                }
                style={{
                  cursor: "pointer",
                  color: "#333",
                  transition: "color 0.3s ease",
                  padding: "5px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              />
              {showOptions === quiz.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    right: "0",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    padding: "10px",
                    zIndex: 10,
                    minWidth: "200px",
                  }}
                >
                  <button
                    onClick={() => onOpenGuestModal(quiz.id, quiz.code)}
                    style={optionButtonStyle}
                  >
                    Manage Guests
                  </button>
                  <button
                    onClick={() => onOpenRankingModal(quiz.id)}
                    style={optionButtonStyle}
                  >
                    View Rankings
                  </button>
                  <button
                    onClick={() => onOpenAddQuestionModal(quiz.id)}
                    style={optionButtonStyle}
                  >
                    Manage Questions
                  </button>
                  <button
                    onClick={() => navigate(`/respond?code=${quiz.code}`)}
                    style={optionButtonStyle}
                  >
                    Responder Quiz
                  </button>
                </div>
              )}
            </div>

            {/* Informações do Quiz */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                {quiz.title}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

import { CSSProperties } from "react";

const optionButtonStyle: CSSProperties = {
  backgroundColor: "#02A09D",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "5px",
  width: "100%",
  textAlign: "left",
  transition: "background-color 0.3s ease",
};

export default QuizList;
