import { v4 as uuidv4 } from "uuid";
import { FaDice } from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/QuizResponse.css";
import { api } from "../api";

interface UsuarioResposta {
  nome: string;
  respostas: number[];
  data: string;
  personagem: string;
}

const characterOptions = [
  "https://imgur.com/x1byl5O",
  "https://imgur.com/eGGKCQk",
  "https://imgur.com/mhf5qhD",
  "https://imgur.com/UpkmJj7",
  "https://imgur.com/7Nv2wN9",
  "https://imgur.com/zF7LLvQ",
];

const QuizResponse: React.FC = () => {
  const { registerResponse } = useContext(QuizContext);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any | null>(null);
  const [respostasUsuario, setRespostasUsuario] = useState<number[]>([]);
  const [nome, setNome] = useState<string>("");
  const [tempoRestante, setTempoRestante] = useState<number>(60);
  const [tempoTotal, setTempoTotal] = useState<number>(60);
  const [step, setStep] = useState<"nome" | "quiz">("nome");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<number>(0);

  // Dados estáticos do quiz
  const quizData = {
    nome: "quiz de estatistica",
    code: "CW22ODH",
    perguntas: [
      { pergunta: "adadadsawda", opcoes: ["Opção 1", "Opção 2", "Opção 3"] },
      { pergunta: "quem descobriu", opcoes: ["Opção A", "Opção B", "Opção C"] },
      {
        pergunta: "quem é cezumario",
        opcoes: ["Opção X", "Opção Y", "Opção Z"],
      },
    ],
  };

  useEffect(() => {
    // Setando os dados estáticos
    setQuiz(quizData);
    setTempoTotal(60);
    setTempoRestante(60);
  }, []);

  useEffect(() => {
    if (step !== "quiz" || !quiz) return;

    if (tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [tempoRestante, step, quiz]);

  const handleOptionChange = (optionIndex: number) => {
    const novasRespostas = [...respostasUsuario];
    novasRespostas[currentQuestion] = optionIndex;
    setRespostasUsuario(novasRespostas);
  };

  const handleNext = () => {
    if (currentQuestion < quiz!.perguntas.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (nome.trim() === "") {
      alert("Por favor, insira seu nome.");
      return;
    }

    if (respostasUsuario.length !== quiz!.perguntas.length) {
      alert("Por favor, responda todas as perguntas.");
      return;
    }

    const usuarioResposta: UsuarioResposta = {
      nome,
      respostas: respostasUsuario,
      data: new Date().toISOString(),
      personagem: characterOptions[selectedCharacter],
    };

    registerResponse(quiz!, usuarioResposta);

    alert("Respostas registradas com sucesso!");
    navigate("/");
  };

  const randomizeCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characterOptions.length);
    setSelectedCharacter(randomIndex);
  };

  useEffect(() => {
    randomizeCharacter();
  }, []);

  const startQuiz = async () => {
    try {
      // Exemplo de chamada da API
      const response = await api.post("/guest", {
        name: nome,
        ip: uuidv4(),
        profileUrl: "https://example.com/profile", // Substitua com o URL real do perfil
      });
      console.log("guestJoinQuizResponse.data");
      console.log(response.data);
      const guestJoinQuizResponse = await api.post("/guest/join", {
        guestId: response.data.id,
        quizCode: quiz!.code,
      });
      console.log("guestJoinQuizResponse.data");
      console.log("guestJoinQuizResponse.data");
      console.log(guestJoinQuizResponse);
    } catch (error) {
      console.error("Erro ao iniciar o quiz:", error);
    }
  };

  useEffect(() => {
    if (step === "quiz" && nome) {
      startQuiz(); // Chama a API quando o quiz começa
    }
  }, [step, nome]);

  if (!quiz) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="quiz-container">
      {step === "nome" && (
        <div className="input-nome">
          <h2>Bem-vindo ao Quiz: {quiz.nome}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nome.trim() === "") {
                alert("Por favor, insira seu nome.");
                return;
              }
              setStep("quiz");
            }}
          >
            <div className="character-display">
              <img
                src={characterOptions[selectedCharacter]}
                alt="Seu Personagem"
                className="character-image"
              />
              <button
                type="button"
                onClick={randomizeCharacter}
                className="dice-button"
              >
                <FaDice size={32} />
              </button>
            </div>

            <div className="input-group">
              <label htmlFor="nome">Seu Nome:</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <button type="submit">Iniciar Quiz</button>
          </form>
        </div>
      )}

      {step === "quiz" && (
        <>
          <h2>Quiz: {quiz.nome}</h2>

          <div className="timer-container">
            <CircularProgressbar
              value={tempoRestante}
              maxValue={tempoTotal}
              text={`${tempoRestante}s`}
              styles={buildStyles({
                pathColor: `rgba(62, 152, 199, ${tempoRestante / tempoTotal})`,
                textColor: "#000",
                trailColor: "#d6d6d6",
                backgroundColor: "#f88",
              })}
            />
          </div>

          <div className="question-container">
            <p>
              <strong>
                Pergunta {currentQuestion + 1} de {quiz.perguntas.length}:
              </strong>{" "}
              {quiz.perguntas[currentQuestion].pergunta}
            </p>
            {quiz.perguntas[currentQuestion].opcoes.map(
              (opcao: string, opIndex: number) => (
                <div
                  key={opIndex}
                  className={`option-container ${
                    respostasUsuario[currentQuestion] === opIndex
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleOptionChange(opIndex)}
                >
                  <span>{opcao}</span>
                </div>
              )
            )}
          </div>
          <div className="navigation-buttons">
            {currentQuestion > 0 && (
              <button onClick={handlePrevious}>Anterior</button>
            )}
            {currentQuestion < quiz.perguntas.length - 1 && (
              <button onClick={handleNext}>Próxima</button>
            )}
            {currentQuestion === quiz.perguntas.length - 1 && (
              <button onClick={handleSubmit}>Enviar Respostas</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizResponse;
