// components/AddQuiz.tsx
import React, { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";

interface Option {
  id: number;
  description: string;
  isRight: boolean;
}

interface Question {
  id: number;
  title: string;
  description: string;
  options: Option[];
}

const AddQuiz: React.FC = () => {
  const { createQuiz, createQuestion, createOption } = useQuizApi();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      title: "",
      description: "",
      options: [
        { id: Date.now() + 1, description: "", isRight: false },
        { id: Date.now() + 2, description: "", isRight: false },
      ],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        title: "",
        description: "",
        options: [
          { id: Date.now() + 1, description: "", isRight: false },
          { id: Date.now() + 2, description: "", isRight: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (
    id: number,
    field: keyof Omit<Question, "options">,
    value: any
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: Date.now(), description: "", isRight: false },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== optionId),
            }
          : q
      )
    );
  };

  const handleOptionChange = (
    questionId: number,
    optionId: number,
    field: keyof Option,
    value: any
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, [field]: value } : o
              ),
            }
          : q
      )
    );
  };

  const validateForm = () => {
    if (!quizTitle.trim()) {
      alert("Por favor, insira um título para o quiz.");
      return false;
    }
    for (const [qIndex, question] of questions.entries()) {
      if (!question.title.trim()) {
        alert(`Por favor, insira um título para a pergunta ${qIndex + 1}.`);
        return false;
      }
      if (question.options.length < 2) {
        alert(`A pergunta ${qIndex + 1} deve ter pelo menos duas opções.`);
        return false;
      }
      const hasCorrectOption = question.options.some((o) => o.isRight);
      if (!hasCorrectOption) {
        alert(`A pergunta ${qIndex + 1} deve ter uma opção correta.`);
        return false;
      }
      for (const [oIndex, option] of question.options.entries()) {
        if (!option.description.trim()) {
          alert(
            `Por favor, insira uma descrição para a opção ${
              oIndex + 1
            } da pergunta ${qIndex + 1}.`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // 1. Criar o Quiz
      const newQuiz = await createQuiz(quizTitle);

      const quizId: any = newQuiz;
      if (!quizId) {
        throw new Error("Falha ao obter o ID do Quiz criado.");
      }

      // 2. Criar Perguntas e Opções
      for (const [qIndex, question] of questions.entries()) {
        const newQuestion: any = await createQuestion(
          question.title,
          question.description,
          quizId + 1
        );

        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:", newQuestion);
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        console.log("  newQuestion:");
        const questionId = newQuestion.id;
        if (!questionId) {
          throw new Error(
            `Falha ao obter o ID da Pergunta ${qIndex + 1}: "${
              question.title
            }".`
          );
        }
        for (const [oIndex, option] of question.options.entries()) {
          console.log(
            "  option:",
            option.description,
            option.isRight,
            questionId + 1
          );
          await createOption(
            option.description,
            option.isRight,
            questionId
          );
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
          console.log(
            `Opção ${oIndex + 1} para a Pergunta ${
              qIndex + 1
            } criada com sucesso: "${option.description}"`
          );
        }
      }

      alert("Quiz criado com sucesso!");
      setQuizTitle("");
      setQuestions([
        {
          id: Date.now(),
          title: "",
          description: "",
          options: [
            { id: Date.now() + 1, description: "", isRight: false },
            { id: Date.now() + 2, description: "", isRight: false },
          ],
        },
      ]);
    } catch (error: any) {
      console.error("2Erro ao criar o quiz:", error);
      alert(
        error.message ||
          "Ocorreu um erro ao criar o quiz. Por favor, tente novamente."
      );
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Criar Novo Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="quizTitle"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Título do Quiz:
          </label>
          <input
            id="quizTitle"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
            placeholder="Insira o título do quiz"
          />
        </div>

        {questions.map((question, qIndex) => (
          <div
            key={question.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <h3>Pergunta {qIndex + 1}</h3>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveQuestion(question.id)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Remover Pergunta
              </button>
            )}
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor={`questionTitle-${question.id}`}
                style={{ display: "block", marginBottom: "5px" }}
              >
                Título da Pergunta:
              </label>
              <input
                id={`questionTitle-${question.id}`}
                type="text"
                value={question.title}
                onChange={(e) =>
                  handleQuestionChange(question.id, "title", e.target.value)
                }
                required
                style={{ width: "100%", padding: "8px" }}
                placeholder="Insira o título da pergunta"
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label
                htmlFor={`questionDescription-${question.id}`}
                style={{ display: "block", marginBottom: "5px" }}
              >
                Descrição da Pergunta:
              </label>
              <textarea
                id={`questionDescription-${question.id}`}
                value={question.description}
                onChange={(e) =>
                  handleQuestionChange(
                    question.id,
                    "description",
                    e.target.value
                  )
                }
                style={{ width: "100%", padding: "8px" }}
                placeholder="Insira a descrição da pergunta (opcional)"
                rows={3}
              />
            </div>
            <h4>Opções</h4>
            {question.options.map((option, oIndex) => (
              <div
                key={option.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor={`optionDescription-${option.id}`}
                    style={{ display: "block", marginBottom: "5px" }}
                  >
                    Opção {oIndex + 1}:
                  </label>
                  <input
                    id={`optionDescription-${option.id}`}
                    type="text"
                    value={option.description}
                    onChange={(e) =>
                      handleOptionChange(
                        question.id,
                        option.id,
                        "description",
                        e.target.value
                      )
                    }
                    required
                    style={{ width: "100%", padding: "8px" }}
                    placeholder="Insira a descrição da opção"
                  />
                </div>
                <div
                  style={{
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={option.isRight}
                      onChange={(e) =>
                        handleOptionChange(
                          question.id,
                          option.id,
                          "isRight",
                          e.target.checked
                        )
                      }
                      style={{ marginRight: "5px" }}
                    />
                    Correta
                  </label>
                </div>
                {question.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(question.id, option.id)}
                    style={{
                      marginLeft: "10px",
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Remover Opção
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddOption(question.id)}
              style={{
                background: "#3498db",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Adicionar Opção
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          style={{
            background: "#2ecc71",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Adicionar Pergunta
        </button>

        <div>
          <button
            type="submit"
            style={{
              background: "#9b59b6",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Criar Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuiz;
