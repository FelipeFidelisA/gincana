import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/QrView.css";

const QrView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { quizData } = location.state || {};

  if (!quizData) {
    alert("Dados do quiz ausentes.");
    navigate("/");
    return null;
  }

  const quizURL = `${
    window.location.origin
  }/quizresponse?data=${encodeURIComponent(JSON.stringify(quizData))}`;

  return (
    <div className="qrview-container">
      <h2>Seu Quiz foi Criado!</h2>
      <div className="qr-code">
        <QRCodeCanvas value={quizURL} size={256} includeMargin={true} />
      </div>
      <p>Escaneie o QR Code acima para acessar o quiz.</p>
      <button
        onClick={() =>
          navigate(
            `/respond?data=${encodeURIComponent(JSON.stringify(quizData))}`
          )
        }
        className="home-button"
      >
        responda
      </button>
      <button onClick={() => navigate("/")} className="home-button">
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default QrView;
