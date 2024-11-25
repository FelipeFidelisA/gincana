import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Roomcode.css";

const RoomPage = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event : any) => {
    setRoomCode(event.target.value);
  };

  const handleEnterRoom = () => {
    if (roomCode.trim()) {
      alert(`Entrando na sala com o código: ${roomCode}`);
    } else {
      alert("Por favor, insira um código de sala válido.");
    }
  };

  const handleLogin = () => {
    navigate("/login"); 
  };

  return (
    <div className="container">
      <h1 className="title">DataRush</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Código da sala"
          value={roomCode}
          onChange={handleInputChange}
          className="input"
        />
        <button onClick={handleEnterRoom} className="button enter-button">
          ENTRAR
        </button>
        <button onClick={handleLogin} className="button login-button">
          FAZER LOGIN
        </button>
      </div>
      <footer className="footer">
        Copyright ©2024 | Powered by Sistemas de Informações
      </footer>
    </div>
  );
};

export default RoomPage;
