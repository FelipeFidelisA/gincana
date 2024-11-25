import { useState } from "react";
import "../styles/entry.css";

const RoomPage = () => {
  const [username, setUsername] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "public/character/galo1.jpg",
    "public/character/galo2.jpg",
    "public/character/rato1.jpg",
    "public/character/rato2.jpg",
    "public/character/urso1.jpg",
    "public/character/urso2.jpg",
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEnter = () => {
    if (username.trim()) {
      alert(`Bem-vindo, ${username}!`);
    } else {
      alert("Por favor, insira seu nome de usuário.");
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="background">
      <div className="login-container">
        <h1 className="title">DataRush</h1>
        <div className="carousel">
          <button className="carousel-button left" onClick={handlePreviousImage}>
            &#8249;
          </button>
          <div className="profile-picture">
            <img src={images[currentImageIndex]} alt="Foto de Perfil" />
          </div>
          <button className="carousel-button right" onClick={handleNextImage}>
            &#8250;
          </button>
        </div>
        <input
          type="text"
          placeholder="Nome de Usuário"
          value={username}
          onChange={handleInputChange}
          className="input-field"
        />
        <button onClick={handleEnter} className="login-button">
          ENTRAR
        </button>
      </div>
      <footer className="footer">
        Copyright ©2024 Produced by Sistemas de Informações
      </footer>
    </div>
  );
};

export default RoomPage;
