import React, { useEffect, useState } from "react";
import { api } from "../api";
import CreateQuestionForm from "./CreateQuestionForm";

interface QuestionListProps {
  quizId: any;
  onClose: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ quizId, onClose }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [options, setOptions] = useState<any>({});

  const onCloseModal = () => {
    onClose();
  };

  const listQuestions = async (quizId: number) => {
    try {
      const response = await api.get(`/question/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setQuestions(response.data);

      for (let question of response.data) {
        listOptions(question.id);
      }
    } catch (error) {
      console.error("Error listing questions:", error);
    }
  };

  const listOptions = async (questionId: number) => {
    try {
      const response = await api.get(`/option/question/${questionId}`);
      setOptions((prevOptions: any) => ({
        ...prevOptions,
        [questionId]: response.data,
      }));
    } catch (error) {
      console.error(`Error listing options for question ${questionId}:`, error);
    }
  };

  const createQuestion = async (
    title: string,
    description: string,
    quizId: number,
    options: any[]
  ) => {
    try {
      const body = { title, description, quizId };
      const response = await api.post("/question", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const questionId = response.data.id;

      // Criação das opções
      options.forEach(async (option) => {
        await api.post(
          "/option",
          {
            description: option.description,
            isRight: option.isRight,
            questionId,
            title,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      });

      listQuestions(quizId);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  useEffect(() => {
    listQuestions(quizId);
  }, [quizId]);

  return (
    <div>
      <h2>Perguntas do Quiz {quizId}</h2>
      <button onClick={onCloseModal}>Fechar</button>

      <CreateQuestionForm quizId={quizId} onCreateQuestion={createQuestion} />

      <h3>Perguntas Existentes</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <strong>{question.title}</strong>: {question.description}
            <div>
              <h4>Opções</h4>
              {options[question.id] ? (
                <ul>
                  {options[question.id].map((option: any) => (
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
