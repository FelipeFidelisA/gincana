import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import "../styles/QuizResponse.css";

interface QuizData {
  nome: string;
  perguntas: Pergunta[];
  tempo?: number;
}

interface Pergunta {
  pergunta: string;
  opcoes: string[];
}

interface UsuarioResposta {
  nome: string;
  respostas: number[];
  data: string;
}

const QuizResponse: React.FC = () => {
  const { registerResponse } = useContext(QuizContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [quiz, setQuiz] = useState<any | null>(null);
  const [respostasUsuario, setRespostasUsuario] = useState<number[]>([]);
  const [nome, setNome] = useState<string>("");
  const [tempoRestante, setTempoRestante] = useState<number>(60);
  const [step, setStep] = useState<"nome" | "quiz">("nome");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const getQuizFromURL = (): QuizData | null => {
    const params = new URLSearchParams(location.search);
    const data = params.get("data");
    if (data) {
      try {
        const decodedData = decodeURIComponent(data);
        const quizData = JSON.parse(decodedData) as QuizData;
        return quizData;
      } catch (error) {
        console.error("Erro ao decodificar os dados do quiz:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const quizData = getQuizFromURL();
    if (quizData) {
      setQuiz(quizData);
      setTempoRestante(quizData.tempo || 60);
    } else {
      alert("Dados do quiz inválidos ou ausentes.");
      navigate("/");
    }
  }, [location.search, navigate]);

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
    };

    registerResponse(quiz!, usuarioResposta);

    alert("Respostas registradas com sucesso!");
    navigate("/");
  };

  if (!quiz) {
    return null;
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
            <label htmlFor="nome">Seu Nome:</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <button type="submit">Iniciar Quiz</button>
          </form>
        </div>
      )}

      {step === "quiz" && (
        <>
          <h2>Quiz: {quiz.nome}</h2>
          <h3>Tempo Restante: {tempoRestante} segundos</h3>
          <div className="question-container">
            <p>
              <strong>
                Pergunta {currentQuestion + 1} de {quiz.perguntas.length}:
              </strong>{" "}
              {quiz.perguntas[currentQuestion].pergunta}
            </p>
            {quiz.perguntas[currentQuestion].opcoes.map(
              (opcao: any, opIndex: any) => (
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
