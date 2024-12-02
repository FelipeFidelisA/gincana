import React, { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";

const CreateQuiz: React.FC = () => {
  const { createQuiz, listQuizzes } = useQuizApi();
  const [quizTitle, setQuizTitle] = useState("");

  const handleCreateQuiz = async () => {
    if (quizTitle.trim()) {
      await createQuiz(quizTitle);
      setQuizTitle("");
      listQuizzes();
    }
  };

  return (
    <div>
      <h2>Criar Novo Quiz</h2>
      <input
        type="text"
        placeholder="Título do Quiz"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
      />
      <button onClick={handleCreateQuiz}>Criar Quiz</button>
    </div>
  );
};

export default CreateQuiz;
