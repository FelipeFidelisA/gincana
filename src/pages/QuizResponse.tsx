import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FaDice, FaSpinner } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Confetti from "react-confetti";
import { useSpring, animated } from "react-spring";
import { useQuizApi } from "../context/QuizApiContext";
import { api } from "../api";
import "../styles/QuizResponse.css";
import "react-circular-progressbar/dist/styles.css";

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

const QuizResponse: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizCode = new URLSearchParams(location.search).get("code");

  const {
    submitResponses,
    createGuest,
    joinQuiz,
    listQuestions,
    increaseScore,
  } = useQuizApi();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizStatus, setQuizStatus] = useState<string>("WAITING_GUESTS");
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [userResponses, setUserResponses] = useState<number[]>([]);
  const [name, setName] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(300);
  const [totalTime, setTotalTime] = useState<number>(300);
  const [step, setStep] = useState<"character" | "quiz">("character");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [guestId, setGuestId] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const predefinedCharacters: string[] = [
    "https://i.imgur.com/UpkmJj7.jpeg",
    "https://i.imgur.com/eGGKCQk.jpeg",
    "https://i.imgur.com/y8rOK45.jpeg",
    "https://i.imgur.com/uciF6PR.jpeg",
    "https://i.imgur.com/7Nv2wN9.jpeg",
    "https://i.imgur.com/0M60djy.jpeg",
    "https://i.imgur.com/HXcYUbQ.jpeg",
    "https://i.imgur.com/djrtigi.jpeg",
    "https://i.imgur.com/x1byl5O.jpeg",
    "https://i.imgur.com/xKj6bS7.jpeg",
    "https://i.imgur.com/mhf5qhD.jpeg",
    "https://i.imgur.com/8amCndS.jpeg",
    "https://i.imgur.com/0MtDXFD.jpeg",
    "https://i.imgur.com/DWDr1ZX.jpeg",
    "https://i.imgur.com/dY4uXD4.jpeg",
    "https://i.imgur.com/TrAsdHx.jpeg",
  ];

  const randomizeCharacter = () => {
    const randomIndex = Math.floor(Math.random() * predefinedCharacters.length);
    setSelectedCharacter(predefinedCharacters[randomIndex]);
  };

  const fetchQuiz = async () => {
    if (!quizCode) {
      alert("Código do quiz não fornecido.");
      navigate("/");
      return;
    }

    try {
      const response = await api.get<Quiz>(`/quiz/code/${quizCode}`);

      const foundQuiz = response.data;
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setQuizStatus(foundQuiz.status);
        setTotalTime(300);
        setRemainingTime(300);
        await fetchQuestions(foundQuiz.id);

        const quizjarespondido = localStorage.getItem(
          `quiz_${quizCode}_respondido`
        );
        if (quizjarespondido === "true") {
          navigate(`/ranking?code=${quizCode}`);
        }
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
      const questionsWithOptions: QuestionWithOptions[] = await Promise.all(
        fetchedQuestions.map(async (question) => {
          const options = await listOptions(question.id);
          return { ...question, options };
        })
      );
      setQuestions(questionsWithOptions);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      navigate("/");
    }
  };

  const listOptions = async (questionId: number): Promise<Option[]> => {
    try {
      const options = await api.get<Option[]>(`/option/question/${questionId}`);
      return options.data;
    } catch (error) {
      console.error("Erro ao listar opções:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizCode]);

  useEffect(() => {
    if (!quizCode) return;
    const interval = setInterval(async () => {
      try {
        const response = await api.get<Quiz>(`/quiz/code/${quizCode}`);
        const currentStatus = response.data.status;
        setQuizStatus(currentStatus);
        if (currentStatus === "IN_PROGRESS") {
          clearInterval(interval);
          setTotalTime(300);
          setRemainingTime(300);
        }
      } catch (error) {
        console.error("Erro ao verificar status do quiz:", error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quizCode]);

  useEffect(() => {
    if (step !== "quiz" || !quiz) return;
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [remainingTime, step, quiz]);

  const handleOptionChange = (optionIndex: number) => {
    const newResponses = [...userResponses];
    newResponses[currentQuestion] = optionIndex;
    setUserResponses(newResponses);
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
    if (quizSubmitted) return;
    if (userResponses.length !== questions.length) {
      alert("Por favor, responda todas as perguntas.");
      return;
    }
    if (!guestId) {
      alert("Erro interno: guestId não definido.");
      return;
    }

    try {
      let correctAnswers = 0;
      const selectedOptionIds: any = [];

      questions.forEach((question, index) => {
        const selectedOptionIndex = userResponses[index];
        const selectedOption = question.options[selectedOptionIndex];
        if (selectedOption) {
          selectedOptionIds.push(selectedOption.id);
          if (selectedOption.isRight) {
            correctAnswers += 1;
          }
        }
      });

      const calculateScore = (
        correctAnswers: number,
        remainingTime: number,
        guestId: number
      ) => {
        const timeWeight = Math.pow(remainingTime, 1.5) * 50;
        const answerWeight = Math.pow(correctAnswers, 2) * 1000;
        const uniqueFactor = (guestId % 100) * 0.1;
        return Math.floor(answerWeight + timeWeight + uniqueFactor);
      };

      const score = calculateScore(correctAnswers, remainingTime, guestId);

      await submitResponses(guestId, quizCode!, score);
      await increaseScore(guestId, quiz!.code, score);
      setQuizSubmitted(true);
      localStorage.setItem(`quiz_${quizCode}_respondido`, "true");

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      const redirectTimeout = setTimeout(() => {
        clearInterval(countdownInterval);
        navigate(`/ranking?code=${quizCode}`);
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimeout);
      };
    } catch (error) {
      console.error("Erro ao registrar respostas e pontuação:", error);
      alert(
        "Ocorreu um erro ao registrar suas respostas e pontuação. Por favor, tente novamente."
      );
    }
  };

  useEffect(() => {
    randomizeCharacter();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const animationProps = useSpring({
    opacity: quizSubmitted ? 1 : 0,
    transform: quizSubmitted
      ? `translate(-50%, -50%)`
      : `translate(-50%, -60%)`,
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
      {quizSubmitted && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={60}
        />
      )}
      {quizSubmitted && (
        <animated.div style={animationProps} className="success-message">
          <h2>Quiz respondido com sucesso!</h2>
          <p>Redirecionando para a tela de ranking em {countdown}...</p>
        </animated.div>
      )}
      <div className="quiz-container">
        {step === "quiz" && quizStatus !== "IN_PROGRESS" && (
          <div className="waiting-container">
            <div className="spinner-container">
              <FaSpinner className="spinner" />
            </div>
            <h2 className="waiting-title">Aguardando Início do Quiz...</h2>
            <p className="waiting-message">
              Por favor, aguarde até que o administrador inicie o quiz.
            </p>
            <div className="progress-bar">
              <div className="progress"></div>
            </div>
          </div>
        )}
        {step === "quiz" && quizStatus === "IN_PROGRESS" && (
          <>
            {quiz && (
              <>
                <h2>Quiz: {quiz?.title}</h2>
                <div className="timer-container">
                  <CircularProgressbar
                    value={remainingTime}
                    maxValue={totalTime}
                    text={
                      remainingTime > 60
                        ? `${Math.floor(remainingTime / 60)}m ${
                            remainingTime % 60
                          }s`
                        : `${remainingTime}s`
                    }
                    styles={buildStyles({
                      pathColor: `rgba(62, 152, 199, ${
                        remainingTime / totalTime
                      })`,
                      textColor: "#fff",
                      textSize: "20px",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#3e98c7",
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
                          (option, optionIndex) => (
                            <div
                              key={option.id}
                              className={`option-container ${
                                userResponses[currentQuestion] === optionIndex
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => handleOptionChange(optionIndex)}
                            >
                              <span>{option.description}</span>
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
                    <button onClick={handlePrevious} className="nav-button">
                      Anterior
                    </button>
                  )}
                  {currentQuestion < questions.length - 1 && (
                    <button onClick={handleNext} className="nav-button">
                      Próxima
                    </button>
                  )}
                  {currentQuestion === questions.length - 1 && (
                    <button
                      onClick={handleSubmit}
                      disabled={quizSubmitted}
                      className={`submit-button ${
                        quizSubmitted ? "disabled-button" : ""
                      }`}
                    >
                      {quizSubmitted ? "Enviando..." : "Enviar Respostas"}
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}
        {step === "character" && (
          <div className="character-creation">
            <h2>Bem-vindo ao Quiz: {quiz?.title}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (name.trim() === "") {
                  alert("Por favor, insira seu nome.");
                  return;
                }
                if (selectedCharacter === "") {
                  alert("Por favor, selecione uma imagem para seu personagem.");
                  return;
                }
                localStorage.setItem("myName", name);
                try {
                  const newGuest = await createGuest(
                    name,
                    uuidv4(),
                    selectedCharacter
                  );
                  setGuestId(newGuest.id);
                  await joinQuiz(newGuest.id, quiz!.code);
                  setStep("quiz");
                } catch (error) {
                  console.error(
                    "Erro ao criar perfil e ingressar no quiz:",
                    error
                  );
                  alert(
                    "Ocorreu um erro ao criar seu perfil. Por favor, tente novamente."
                  );
                }
              }}
            >
              <div className="character-display">
                <img
                  src={selectedCharacter || "https://i.imgur.com/x1byl5O.jpeg"}
                  alt="Seu Personagem"
                  className="character-image"
                />
                <div className="character-buttons">
                  <button
                    type="button"
                    onClick={randomizeCharacter}
                    className="dice-button"
                    title="Randomizar Imagem"
                  >
                    <FaDice size={20} />
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="name">Seu Nome:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 15))}
                  required
                  placeholder="Digite seu nome"
                />
              </div>
              <button type="submit" className="start-quiz-button">
                Iniciar Quiz
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizResponse;
