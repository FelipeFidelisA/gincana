import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [roomCode, setRoomCode] = useState("");
  const [buttonHover, setButtonHover] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value) && value.length <= 10) {
      setRoomCode(value.toUpperCase());
    }
  };

  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/respond?code=" + roomCode);
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: "url('https://i.imgur.com/NniFL09.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    textAlign: "center",
    flexDirection: "column",
    padding: "1rem",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "20px",
    padding: "2rem",
    width: "80vw",
    maxWidth: "500px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontFamily: "Poppins, sans-serif",
    textTransform: "uppercase",
    transition: "all 0.3s ease-in-out",
    outline: "none",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2575fc",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: "#6a11cb",
  };

  const footerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "10px",
    fontSize: "0.8rem",
    color: "#fff",
    textDecoration: "none",
    opacity: 0.7,
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Insira o Código da Sala para Iniciar</h3>
      <div style={cardStyle}>
        <input
          type="text"
          placeholder="Código da sala"
          value={roomCode.toUpperCase()}
          onChange={handleInputChange}
          style={inputStyle}
          autoFocus
          maxLength={10}
        />
        <button
          style={{ ...buttonStyle, ...(buttonHover ? buttonHoverStyle : {}) }}
          onClick={handleSubmit}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          Iniciar Quiz
        </button>
      </div>
      <a href="/login" style={footerStyle}>
        Login
      </a>
    </div>
  );
};

export default Home;
