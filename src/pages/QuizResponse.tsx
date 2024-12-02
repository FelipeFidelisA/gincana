// src/pages/QuizResponse.tsx

import { v4 as uuidv4 } from "uuid";
import { FaDice } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/QuizResponse.css";
import { useQuizApi } from "../context/QuizApiContext";
import { api } from "../api";

interface UsuarioResposta {
  nome: string;
  respostas: number[];
  data: string;
  personagem: string;
}

interface QuestionWithOptions extends Question {
  options: Option[];
}

interface Question {
  id: number;
  title: string;
  description: string;
  quizId: number;
}

interface Option {
  id: number;
  description: string;
  isRight: boolean;
  questionId: number;
}

const characterOptions = [
  "https://i.imgur.com/x1byl5O.jpeg",
  "https://i.imgur.com/eGGKCQk.jpeg",
  "https://i.imgur.com/mhf5qhD.jpeg",
  "https://i.imgur.com/UpkmJj7.jpeg",
  "https://i.imgur.com/7Nv2wN9.jpeg",
];

const QuizResponse: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizCode: any = queryParams.get("code");

  const {
    submitResponses,
    createGuest,
    joinQuiz,
    listQuestions,
    increaseScore,
  } = useQuizApi();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [respostasUsuario, setRespostasUsuario] = useState<number[]>([]);
  const [nome, setNome] = useState<string>("");
  const [tempoRestante, setTempoRestante] = useState<number>(60);
  const [tempoTotal, setTempoTotal] = useState<number>(60);
  const [step, setStep] = useState<"nome" | "quiz">("nome");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<number>(0);
  const [guestId, setGuestId] = useState<number | null>(null);

  interface Quiz {
    id: number;
    title: string;
    code: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
    guests: Guest[];
    questions: Question[];
    status: string;
  }

  interface Guest {
    id: number;
    name: string;
    ip: string;
    score: number;
    profileUrl: string;
  }

  const fetchQuiz = async () => {
    if (!quizCode) {
      alert("Código do quiz não fornecido.");
      navigate("/");
      return;
    }

    try {
      const response = await api.get<Quiz>(`/quiz/code/${quizCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const foundQuiz = response.data;

      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTempoTotal(60);
        setTempoRestante(60);
        await fetchQuestions(foundQuiz.id);
      } else {
        alert("Quiz não encontrado.");
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      alert("Ocorreu um erro ao buscar o quiz.");
      navigate("/");
    }
  };

  const fetchQuestions = async (quizId: number) => {
    try {
      const fetchedQuestions = await listQuestions(quizId);

      // Para cada pergunta, buscar as opções
      const questionsWithOptions: QuestionWithOptions[] = await Promise.all(
        fetchedQuestions.map(async (question) => {
          const options = await listOptions(question.id);
          return { ...question, options };
        })
      );

      setQuestions(questionsWithOptions);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      alert("Ocorreu um erro ao buscar as perguntas.");
      navigate("/");
    }
  };

  const listOptions = async (questionId: number): Promise<Option[]> => {
    try {
      const options = await api.get<Option[]>(
        `/option/question/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return options.data;
    } catch (error) {
      console.error("Error listing options:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizCode]);

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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (nome.trim() === "") {
      alert("Por favor, insira seu nome.");
      return;
    }

    if (respostasUsuario.length !== questions.length) {
      alert("Por favor, responda todas as perguntas.");
      return;
    }

    try {
      const newGuest = await createGuest(nome, uuidv4(), "https://i");

      setGuestId(newGuest.id);
      await joinQuiz(newGuest.id, quiz!.code);

      await submitResponses(newGuest.id, quizCode, 1);
      let score = 0;
      questions.forEach((question, index) => {
        const selectedOptionIndex = respostasUsuario[index];
        const selectedOption = question.options[selectedOptionIndex];
        if (selectedOption && selectedOption.isRight) {
          score += 1;
        }
      });

      // Enviar a pontuação para a API
      await increaseScore(newGuest.id, quiz!.code, score);

      alert("Respostas e pontuação registradas com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao registrar respostas e pontuação:", error);
      alert(
        "Ocorreu um erro ao registrar suas respostas e pontuação. Por favor, tente novamente."
      );
    }
  };

  const randomizeCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characterOptions.length);
    setSelectedCharacter(randomIndex);
  };

  useEffect(() => {
    randomizeCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="quiz-container">
      {step === "nome" && (
        <div className="input-nome">
          <h2>Bem-vindo ao Quiz: {quiz?.title}</h2>
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
          <h2>Quiz: {quiz?.title}</h2>

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
            {questions.length > 0 ? (
              <>
                <p>
                  <strong>
                    Pergunta {currentQuestion + 1} de {questions.length}:
                  </strong>{" "}
                  {questions[currentQuestion].title}
                </p>
                {questions[currentQuestion].description && (
                  <p>{questions[currentQuestion].description}</p>
                )}
                <div className="options-list">
                  {questions[currentQuestion].options.map(
                    (opcao: Option, opIndex: number) => (
                      <div
                        key={opcao.id}
                        className={`option-container ${
                          respostasUsuario[currentQuestion] === opIndex
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleOptionChange(opIndex)}
                      >
                        <span>{opcao.description}</span>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <p>Carregando perguntas...</p>
            )}
          </div>
          <div className="navigation-buttons">
            {currentQuestion > 0 && (
              <button onClick={handlePrevious}>Anterior</button>
            )}
            {currentQuestion < questions.length - 1 && (
              <button onClick={handleNext}>Próxima</button>
            )}
            {currentQuestion === questions.length - 1 && (
              <button onClick={handleSubmit}>Enviar Respostas</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizResponse;
