import React, { useEffect, useState } from "react";
import { api } from "../api";
import CreateQuestionForm from "./CreateQuestionForm";

interface QuestionListProps {
  quizId: any;
  onClose: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ quizId, onClose }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionOptions, setQuestionOptions] = useState<any>({});

  const handleClose = () => {
    onClose();
  };

  const fetchQuestions = async (quizId: number) => {
    try {
      const response = await api.get(`/question/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setQuestions(response.data);

      response.data.forEach((question: any) => {
        fetchOptions(question.id);
      });
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchOptions = async (questionId: number) => {
    try {
      const response = await api.get(`/option/question/${questionId}`);
      setQuestionOptions((prev: any) => ({
        ...prev,
        [questionId]: response.data,
      }));
    } catch (error) {
      console.error(
        `Error fetching options for question ${questionId}:`,
        error
      );
    }
  };

  const handleCreateQuestion = async (
    title: string,
    description: string,
    quizId: number,
    options: any[]
  ) => {
    try {
      const newQuestion = { title, description, quizId };
      const response = await api.post("/question", newQuestion, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const newQuestionId = response.data.id;

      await Promise.all(
        options.map((option) =>
          api.post(
            "/option",
            {
              description: option.description,
              isRight: option.isRight,
              questionId: newQuestionId,
              title,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          )
        )
      );

      fetchQuestions(quizId);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  useEffect(() => {
    fetchQuestions(quizId);
  }, [quizId]);

  return (
    <div>
      <h2>Perguntas do Quiz {quizId}</h2>
      <button onClick={handleClose}>Fechar</button>

      <CreateQuestionForm
        quizId={quizId}
        onCreateQuestion={handleCreateQuestion}
      />

      <h3>Perguntas Existentes</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <strong>{question.title}</strong>: {question.description}
            <div>
              <h4>Opções</h4>
              {questionOptions[question.id] ? (
                <ul>
                  {questionOptions[question.id].map((option: any) => (
                    <li key={option.id}>
                      {option.description} -{" "}
                      {option.isRight ? "Correta" : "Incorreta"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem opções disponíveis</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
