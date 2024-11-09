import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { QuizContext } from "../context/QuizContext";

const QuizManagement = () => {
  const { quizzes, addQuiz, removeQuiz } = useContext(QuizContext);
  const [form, setForm] = useState({
    nome: "",
    perguntas: [{ pergunta: "", opcoes: ["", "", "", ""], respostaCerta: 0 }],
    tempo: 60,
  });
  const navigate = useNavigate();

  const [expandedQuizIndex, setExpandedQuizIndex] = useState(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleQuestionChange = (index: any, field: any, value: any) => {
    const novasPerguntas: any = [...form.perguntas];
    if (field === "respostaCerta") {
      novasPerguntas[index][field] = parseInt(value);
    } else if (field.startsWith("opcao")) {
      const opcaoIndex = parseInt(field.split("_")[1]);
      novasPerguntas[index].opcoes[opcaoIndex] = value;
    } else {
      novasPerguntas[index][field] = value;
    }
    setForm({ ...form, perguntas: novasPerguntas });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      perguntas: [
        ...form.perguntas,
        { pergunta: "", opcoes: ["", "", "", ""], respostaCerta: 0 },
      ],
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const updatedForm = { ...form, respostas: [] }; // Add the missing 'respostas' property
    addQuiz(updatedForm);
    setForm({
      nome: "",
      perguntas: [{ pergunta: "", opcoes: ["", "", "", ""], respostaCerta: 0 }],
      tempo: 60,
    });
  };

  const toggleResponses = (index: any) => {
    if (expandedQuizIndex === index) {
      setExpandedQuizIndex(null);
    } else {
      setExpandedQuizIndex(index);
    }
  };

  const generateQuizURL = (quiz: any) => {
    const serializedData = encodeURIComponent(JSON.stringify(quiz));
    return `${window.location.origin}/respond?data=${serializedData}`;
  };

  return (
    <div>
      <h2>Gerenciamento de Quizzes</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Quiz:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tempo (segundos):</label>
          <input
            type="number"
            name="tempo"
            value={form.tempo}
            onChange={handleChange}
            required
            min="10"
          />
        </div>
        <h3>Perguntas</h3>
        {form.perguntas.map((q, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div>
              <label>Pergunta {index + 1}:</label>
              <input
                type="text"
                value={q.pergunta}
                onChange={(e) =>
                  handleQuestionChange(index, "pergunta", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Opções:</label>
              {q.opcoes.map((opcao, opIndex) => (
                <div key={opIndex}>
                  <input
                    type="text"
                    placeholder={`Opção ${opIndex + 1}`}
                    value={opcao}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        `opcao_${opIndex}`,
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label>Resposta Certa (0-3):</label>
              <input
                type="number"
                min="0"
                max="3"
                value={q.respostaCerta}
                onChange={(e) =>
                  handleQuestionChange(index, "respostaCerta", e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Adicionar Pergunta
        </button>
        <br />
        <br />
        <button type="submit">Adicionar Quiz</button>
      </form>

      <h3>Lista de Quizzes</h3>
      {quizzes.length === 0 ? (
        <p>Nenhum quiz adicionado ainda.</p>
      ) : (
        <ul>
          {quizzes.map((quiz, index) => (
            <li key={index} style={{ marginBottom: "40px" }}>
              <strong>{quiz.nome}</strong> - Tempo: {quiz.tempo}s
              <button
                onClick={() => removeQuiz(index)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Remover
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/respond?data=${encodeURIComponent(JSON.stringify(quiz))}`
                  )
                }
                style={{ marginLeft: "10px" }}
              >
                Responder
              </button>
              <button
                onClick={() => toggleResponses(index)}
                style={{ marginLeft: "10px" }}
              >
                {expandedQuizIndex === index
                  ? "Ocultar Respostas"
                  : "Ver Respostas"}
              </button>
              {expandedQuizIndex === index && (
                <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  <h4>Respostas:</h4>
                  {quiz.respostas.length === 0 ? (
                    <p>Nenhum usuário respondeu a este quiz ainda.</p>
                  ) : (
                    <ul>
                      {quiz.respostas.map((resp: any, respIndex: any) => (
                        <li key={respIndex} style={{ marginBottom: "10px" }}>
                          <strong>Nome:</strong> {resp.nome}
                          <br />
                          <strong>Data:</strong>{" "}
                          {new Date(resp.data).toLocaleString()}
                          <br />
                          <strong>Respostas:</strong>
                          <ul>
                            {resp.respostas.map(
                              (resposta: any, qIndex: any) => (
                                <li key={qIndex}>
                                  Pergunta {qIndex + 1}:{" "}
                                  {quiz.perguntas[qIndex].opcoes[resposta]}
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {/* Exibição do QR Code */}
              <div style={{ marginTop: "10px" }}>
                <QRCodeCanvas value={generateQuizURL(quiz)} size={128} />
                <p>Escaneie para responder este quiz</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizManagement;
