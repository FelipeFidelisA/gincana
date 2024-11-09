// src/components/QuizResponse.tsx
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";

interface QuizData {
  nome: string;
  perguntas: Pergunta[];
  tempo?: number;
}

interface Pergunta {
  pergunta: string;
  opcoes: string[];
}

const QuizResponse: React.FC = () => {
  const { registerResponse } = useContext(QuizContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [quiz, setQuiz] = useState<any | null>(null);
  const [respostasUsuario, setRespostasUsuario] = useState<number[]>([]);
  const [nome, setNome] = useState<string>("");
  const [tempoRestante, setTempoRestante] = useState<number>(60);

  // Função para extrair dados da URL
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
      // Se os dados do quiz não estiverem presentes ou forem inválidos, redirecionar para a página inicial
      alert("Dados do quiz inválidos ou ausentes.");
      navigate("/");
    }
  }, [location.search, navigate]);

  useEffect(() => {
    if (!quiz) return;

    // Configurar o temporizador
    if (tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);

      if (tempoRestante === 0) {
        handleSubmit();
      }

      return () => clearInterval(timer);
    }
  }, [tempoRestante, quiz]);

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const novasRespostas = [...respostasUsuario];
    novasRespostas[questionIndex] = optionIndex;
    setRespostasUsuario(novasRespostas);
  };

  const handleSubmit = () => {
    if (nome.trim() === "") {
      alert("Por favor, insira seu nome.");
      return;
    }

    // Verificar se todas as perguntas foram respondidas
    if (respostasUsuario.length !== quiz!.perguntas.length) {
      alert("Por favor, responda todas as perguntas.");
      return;
    }

    // Registrar a resposta
    registerResponse(quiz!, {
      nome,
      respostas: respostasUsuario,
      data: new Date().toISOString(),
    });

    alert("Respostas registradas com sucesso!");
    navigate("/");
  };

  if (!quiz) {
    return null;
  }

  return (
    <div>
      <h2>Responder Quiz: {quiz.nome}</h2>
      <div>
        <label>Seu Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <h3>Tempo Restante: {tempoRestante} segundos</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {quiz.perguntas.map((q: any, index: any) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p>
              <strong>Pergunta {index + 1}:</strong> {q.pergunta}
            </p>
            {q.opcoes.map((opcao: any, opIndex: any) => (
              <div key={opIndex}>
                <input
                  type="radio"
                  id={`q${index}_op${opIndex}`}
                  name={`question_${index}`}
                  value={opIndex}
                  checked={respostasUsuario[index] === opIndex}
                  onChange={() => handleOptionChange(index, opIndex)}
                  required
                />
                <label htmlFor={`q${index}_op${opIndex}`}>{opcao}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Enviar Respostas</button>
      </form>
    </div>
  );
};

export default QuizResponse;
