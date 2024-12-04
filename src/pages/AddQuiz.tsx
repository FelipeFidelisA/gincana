import React, { useState, useEffect } from "react";
import { useQuizApi } from "../context/QuizApiContext";
import { useNavigate } from "react-router-dom";
import "../styles/addQuiz.css";

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
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
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
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (questions.length > 0 && selectedQuestionId === null) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [questions, selectedQuestionId]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      title: "",
      description: "",
      options: [
        { id: Date.now() + 1, description: "", isRight: false },
        { id: Date.now() + 2, description: "", isRight: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
  };

  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (selectedQuestionId === id) {
      setSelectedQuestionId(questions.length > 1 ? questions[0].id : null);
    }
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

  const handleAddOption = () => {
    if (selectedQuestionId === null) return;
    setQuestions(
      questions.map((q) =>
        q.id === selectedQuestionId
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

  const handleRemoveOption = (optionId: number) => {
    if (selectedQuestionId === null) return;
    setQuestions(
      questions.map((q) =>
        q.id === selectedQuestionId
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== optionId),
            }
          : q
      )
    );
  };

  const handleOptionChange = (
    optionId: number,
    field: keyof Option,
    value: any
  ) => {
    if (selectedQuestionId === null) return;

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id !== selectedQuestionId) return q;

        const updatedOptions = q.options.map((o) => {
          if (o.id === optionId) {
            return { ...o, [field]: value };
          }

          // Se o campo sendo alterado for 'isRight' e o valor está sendo marcado como correto,
          // desmarque as outras opções.
          if (field === "isRight" && value === true) {
            return { ...o, isRight: false };
          }

          return o;
        });

        return { ...q, options: updatedOptions };
      })
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
      setTimeout(() => {}, 1000);
      const newQuiz = await createQuiz(quizTitle);
      setTimeout(() => {}, 1000);
      const quizId: any = newQuiz;
      if (!quizId) {
        throw new Error("Falha ao obter o ID do Quiz criado.");
      }

      for (const [qIndex, question] of questions.entries()) {
        setTimeout(() => {}, 1000);
        const newQuestion: any = await createQuestion(
          question.title,
          question.description,
          quizId + 1
        );
        setTimeout(() => {}, 1000);
        const questionId = newQuestion.id;
        if (!questionId) {
          throw new Error(
            `Falha ao obter o ID da Pergunta ${qIndex + 1}: "${
              question.title
            }".`
          );
        }
        for (const [oIndex, option] of question.options.entries()) {
          console.log(oIndex);
          setTimeout(() => {}, 1000);
          await createOption(option.description, option.isRight, questionId);
          setTimeout(() => {}, 1000);
        }
      }
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
      setSelectedQuestionId(null);
      navigate("/manage");
    } catch (error: any) {
      console.error("Erro ao criar o quiz:", error);
      alert(
        error.message ||
          "Ocorreu um erro ao criar o quiz. Por favor, tente novamente."
      );
    }
  };

  return (
    <div className="container-quiz-add">
      <h1
        style={{
          textAlign: "center",
          margin: "8px",
        }}
      >
        Criar Novo Quiz
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quizTitle">Título do Quiz:</label>
          <input
            id="quizTitle"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            required
            placeholder="Insira o título do quiz"
          />
        </div>
        <div className="columns">
          <div className="left-column">
            <h3>Perguntas</h3>
            <ul className="question-list">
              {questions.map((question, qIndex) => (
                <li
                  key={question.id}
                  className={`question-item ${
                    selectedQuestionId === question.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedQuestionId(question.id)}
                >
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) =>
                      handleQuestionChange(question.id, "title", e.target.value)
                    }
                    placeholder={`Digite a pergunta ${qIndex + 1} Aqui`}
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="remove-question-button"
                      aria-label={`Remover Pergunta ${qIndex + 1}`}
                    >
                      Remover
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="add-question-button"
            >
              Adicionar Pergunta
            </button>
          </div>
          <div className="right-column">
            {selectedQuestionId !== null && (
              <>
                <h3>Opções da Pergunta</h3>
                <div className="form-group">
                  <label htmlFor={`questionDescription-${selectedQuestionId}`}>
                    Descrição da Pergunta:
                  </label>
                  <textarea
                    id={`questionDescription-${selectedQuestionId}`}
                    value={
                      questions.find((q) => q.id === selectedQuestionId)
                        ?.description || ""
                    }
                    onChange={(e) =>
                      handleQuestionChange(
                        selectedQuestionId,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Insira a descrição da pergunta (opcional)"
                    rows={3}
                  />
                </div>
                <ul className="option-list">
                  {questions
                    .find((q) => q.id === selectedQuestionId)
                    ?.options.map((option, oIndex) => (
                      <li key={option.id} className="option-item">
                        <input
                          type="text"
                          value={option.description}
                          onChange={(e) =>
                            handleOptionChange(
                              option.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder={`Digite a opção ${oIndex + 1} aqui`}
                        />
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={option.isRight}
                            onChange={(e) =>
                              handleOptionChange(
                                option.id,
                                "isRight",
                                e.target.checked
                              )
                            }
                          />
                          Correta
                        </label>
                        {questions.find((q) => q.id === selectedQuestionId)!
                          .options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option.id)}
                            className="remove-option-button"
                            aria-label={`Remover Opção ${oIndex + 1}`}
                          >
                            Remover
                          </button>
                        )}
                      </li>
                    ))}
                </ul>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="add-option-button"
                >
                  Adicionar Opção
                </button>
              </>
            )}
          </div>
        </div>
        <button type="submit" className="submit-button">
          Criar Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuiz;
