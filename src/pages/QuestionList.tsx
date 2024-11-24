import React, { useEffect, useState } from "react";
import { api } from "../api";
import CreateQuestionForm from "./CreateQuestionForm";

interface QuestionListProps {
  quizId: any;
  onClose: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ quizId, onClose }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [options, setOptions] = useState<any>({}); // Estado para armazenar opções das questões

  const onCloseModal = () => {
    onClose();
  };

  // Função para listar as questões
  const listQuestions = async (quizId: number) => {
    console.log("Listing questions for quiz:", quizId);
    try {
      const response = await api.get(`/question/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setQuestions(response.data);
      console.log("Questions:", response.data);

      // Após carregar as questões, buscar as opções para cada questão
      for (let question of response.data) {
        listOptions(question.id);
      }
    } catch (error) {
      console.error("Error listing questions:", error);
    }
  };

  // Função para listar as opções de uma questão
  const listOptions = async (questionId: number) => {
    try {
      const response = await api.get(`/option/question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOptions((prevOptions: any) => ({
        ...prevOptions,
        [questionId]: response.data, // Armazena as opções para a questão específica
      }));
      console.log(`Options for question ${questionId}:`, response.data);
    } catch (error) {
      console.error(`Error listing options for question ${questionId}:`, error);
    }
  };

  // Função para criar uma nova questão
  const createQuestion = async (
    title: string,
    description: string,
    quizId: number
  ) => {
    try {
      console.log("Creating question:", title, description, quizId);
      const body = { title, description, quizId };

      await api.post("/question", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      listQuestions(quizId);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  // Função para criar uma opção
  const createOption = async (
    description: string,
    isRight: boolean,
    questionId: number,
    title: string
  ) => {
    console.log("Creating option:", description, isRight, questionId, title);
    try {
      await api.post(
        "/option",
        { description, isRight, questionId, title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      // Atualizar lista de questões após adicionar opção
      listQuestions(quizId);
    } catch (error) {
      console.error("Error creating option:", error);
    }
  };

  // Carregar as questões ao montar o componente
  useEffect(() => {
    listQuestions(quizId);
  }, [quizId]);

  return (
    <div>
      <h2>Questions for Quiz {quizId}</h2>
      <button onClick={onCloseModal}>Close</button>

      <CreateQuestionForm quizId={quizId} onCreateQuestion={createQuestion} />

      <h3>Existing Questions</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <strong>{question.title}</strong>: {question.description}
            <div>
              <h4>Options</h4>
              {options[question.id] ? (
                <ul>
                  {options[question.id].map((option: any) => (
                    <li key={option.id}>
                      {option.description} -{" "}
                      {option.isRight ? "Correct" : "Incorrect"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No options available</p>
              )}
              <button
                onClick={() =>
                  createOption(
                    "Option description",
                    false,
                    question.id,
                    question.title
                  )
                }
              >
                Add Option
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
