import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";

const AddQuiz = () => {
  const { addQuiz } = useContext(QuizContext);
  const [form, setForm] = useState({
    nome: "",
    perguntas: [
      { pergunta: "", opcoes: ["", "", "", ""], respostaCerta: null as number | null },
    ],
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
    value: string | number
  ) => {
    const novasPerguntas = [...form.perguntas];
    if (field.startsWith("opcao")) {
      const opcaoIndex = parseInt(field.split("_")[1]);
      novasPerguntas[index].opcoes[opcaoIndex] = value as string;
    } else if (field === "respostaCerta") {
      novasPerguntas[index].respostaCerta = value as number;
    } else if (field === "pergunta") {
      novasPerguntas[index].pergunta = value as string;
    }
    setForm({ ...form, perguntas: novasPerguntas });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      perguntas: [
        ...form.perguntas,
        { pergunta: "", opcoes: ["", "", "", ""], respostaCerta: null },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const novasPerguntas = form.perguntas.filter((_, i) => i !== index);
    setForm({ ...form, perguntas: novasPerguntas });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação para garantir que todas as perguntas tenham uma resposta certa
    for (let i = 0; i < form.perguntas.length; i++) {
      if (form.perguntas[i].respostaCerta === null) {
        alert(`Por favor, selecione a resposta certa para a pergunta ${i + 1}`);
        return;
      }
    }

    const updatedForm = { ...form, respostas: [] };
    addQuiz(updatedForm);
    setForm({
      nome: "",
      perguntas: [
        { pergunta: "", opcoes: ["", "", "", ""], respostaCerta: null },
      ],
      tempo: 60,
    });

    navigate("/qrview", { state: { quizData: updatedForm } });
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "30px auto",
      padding: "20px",
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      color: "#333",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "25px",
      color: "#4CAF50",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "1.1em",
      fontWeight: "bold" as const,
    },
    input: {
      width: "100%",
      padding: "10px",
      boxSizing: "border-box" as const,
      borderRadius: "6px",
      border: "2px solid #ddd",
      fontSize: "1em",
      transition: "border-color 0.3s",
    },
    inputFocus: {
      borderColor: "#4CAF50",
      outline: "none",
    },
    questionCard: {
      backgroundColor: "#fefefe",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "25px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    optionContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
      cursor: "pointer",
      padding: "10px",
      borderRadius: "6px",
      border: "2px solid #ddd",
      backgroundColor: "#fafafa",
      transition: "background-color 0.3s, border-color 0.3s",
    },
    optionSelected: {
      backgroundColor: "#D1E7DD",
      borderColor: "#0F5132",
    },
    optionInput: {
      flex: 1,
      border: "none",
      backgroundColor: "transparent",
      fontSize: "1em",
      outline: "none",
      paddingLeft: "10px",
    },
    button: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold" as const,
      fontSize: "1em",
      transition: "background-color 0.3s, transform 0.2s",
    },
    addButton: {
      backgroundColor: "#28a745",
      color: "#fff",
      marginBottom: "25px",
    },
    addButtonHover: {
      backgroundColor: "#218838",
      transform: "scale(1.05)",
    },
    removeButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      marginTop: "10px",
    },
    removeButtonHover: {
      backgroundColor: "#c82333",
      transform: "scale(1.05)",
    },
    submitButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      width: "100%",
      padding: "15px",
      fontSize: "1.1em",
      borderRadius: "8px",
      transition: "background-color 0.3s, transform 0.2s",
    },
    submitButtonHover: {
      backgroundColor: "#0069d9",
      transform: "scale(1.02)",
    },
    responsive: {
      // Placeholder for any responsive adjustments if needed
    },
  };

  // State to handle hover effects for buttons
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Adicionar Novo Quiz</h2>
      <form onSubmit={handleSubmit}>
        {/* Nome do Quiz */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Nome do Quiz:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Digite o nome do quiz"
            onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
          />
        </div>

        {/* Tempo do Quiz */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Tempo (segundos):</label>
          <input
            type="number"
            name="tempo"
            value={form.tempo}
            onChange={handleChange}
            required
            min="10"
            style={styles.input}
            placeholder="Ex: 60"
            onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
          />
        </div>

        {/* Perguntas */}
        <h3>Perguntas</h3>
        {form.perguntas.map((q, index) => (
          <div key={index} style={styles.questionCard}>
            {/* Pergunta */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Pergunta {index + 1}:</label>
              <input
                type="text"
                value={q.pergunta}
                onChange={(e) =>
                  handleQuestionChange(index, "pergunta", e.target.value)
                }
                required
                style={styles.input}
                placeholder="Digite a pergunta"
                onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
              />
            </div>

            {/* Opções */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Opções:</label>
              {q.opcoes.map((opcao, opIndex) => (
                <div
                  key={opIndex}
                  style={{
                    ...styles.optionContainer,
                    ...(q.respostaCerta === opIndex ? styles.optionSelected : {}),
                  }}
                  onClick={() =>
                    handleQuestionChange(index, "respostaCerta", opIndex)
                  }
                >
                  <input
                    type="radio"
                    name={`respostaCerta_${index}`}
                    checked={q.respostaCerta === opIndex}
                    readOnly
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      display: "inline-block",
                      borderRadius: "50%",
                      border: "2px solid #0F5132",
                      backgroundColor:
                        q.respostaCerta === opIndex ? "#0F5132" : "#fff",
                      marginRight: "10px",
                      flexShrink: 0,
                    }}
                  ></span>
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
                    style={styles.optionInput}
                  />
                </div>
              ))}
            </div>

            {/* Remover Pergunta */}
            <button
              type="button"
              style={{
                ...styles.button,
                ...styles.removeButton,
                ...(hoveredButton === `remove_${index}`
                  ? styles.removeButtonHover
                  : {}),
              }}
              onClick={() => removeQuestion(index)}
              onMouseEnter={() => setHoveredButton(`remove_${index}`)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Remover Pergunta
            </button>
          </div>
        ))}

        {/* Adicionar Pergunta */}
        <button
          type="button"
          onClick={addQuestion}
          style={{
            ...styles.button,
            ...styles.addButton,
            ...(hoveredButton === "add" ? styles.addButtonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton("add")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Adicionar Pergunta
        </button>

        {/* Submeter Quiz */}
        <button
          type="submit"
          style={{
            ...styles.button,
            ...styles.submitButton,
            ...(hoveredButton === "submit" ? styles.submitButtonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton("submit")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Adicionar Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuiz;
