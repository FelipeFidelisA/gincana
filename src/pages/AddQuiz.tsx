import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import "../styles/AddQuiz.css";

const AddQuiz = () => {
  const { addQuiz } = useContext(QuizContext);
  const [form, setForm] = useState({
    nome: "",
    perguntas: [{ pergunta: "", opcoes: ["", "", "", ""], respostaCerta: 0 }],
    tempo: 60,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string
  ) => {
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

  const removeQuestion = (index: number) => {
    const novasPerguntas = form.perguntas.filter((_, i) => i !== index);
    setForm({ ...form, perguntas: novasPerguntas });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedForm = { ...form, respostas: [] };
    addQuiz(updatedForm);
    setForm({
      nome: "",
      perguntas: [{ pergunta: "", opcoes: ["", "", "", ""], respostaCerta: 0 }],
      tempo: 60,
    });

    navigate("/qrview", { state: { quizData: updatedForm } });
  };

  return (
    <div className="add-quiz-container">
      <h2>Adicionar Novo Quiz</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="submit-quiz-button">
          Adicionar Quiz
        </button>
        <div className="form-group">
          <label>Nome do Quiz:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
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
          <div key={index} className="question-card">
            <div className="form-group">
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
            <div className="form-group">
              <label>Opções:</label>
              {q.opcoes.map((opcao, opIndex) => (
                <div key={opIndex} className="option-input">
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
            <div className="form-group">
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
            <button
              type="button"
              className="remove-question-button"
              onClick={() => removeQuestion(index)}
            >
              Remover Pergunta
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="add-question-button"
        >
          Adicionar Pergunta
        </button>
        <br />
        <br />
      </form>
    </div>
  );
};

export default AddQuiz;
