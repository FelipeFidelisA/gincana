import React, { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";

interface CreateQuestionProps {
  quizId: number | null;
  onClose: () => void;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({ quizId, onClose }) => {
  const { createQuestion, listQuestions } = useQuizApi();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");

  const handleCreateQuestion = async () => {
    if (quizId && questionTitle.trim() && questionDescription.trim()) {
      await createQuestion(questionTitle, questionDescription, quizId);
      setQuestionTitle("");
      setQuestionDescription("");
      listQuestions(quizId);
    }
  };

  const onCloseModal = () => {
    setQuestionTitle("");
    setQuestionDescription("");
    onClose();
  };

  return (
    <div>
      <h2>Criar Pergunta</h2>
      <button onClick={onCloseModal}>Fechar</button>
      <input
        type="text"
        placeholder="Título da Pergunta"
        value={questionTitle}
        onChange={(e) => setQuestionTitle(e.target.value)}
      />
      <textarea
        placeholder="Descrição da Pergunta"
        value={questionDescription}
        onChange={(e) => setQuestionDescription(e.target.value)}
      />
      <button onClick={handleCreateQuestion}>Criar Pergunta</button>
    </div>
  );
};

export default CreateQuestion;
