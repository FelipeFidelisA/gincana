import { useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";

const AddQuizForm = ({ onAddQuiz, onClose }: any) => {
  const [quizName, setQuizName] = useState("");
  const { createQuiz, listQuizzes } = useQuizApi();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (quizName.trim()) {
      createQuiz(quizName);
      onAddQuiz(quizName);
      setQuizName("");
      listQuizzes();
      console.log("Quiz added");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      <button type="submit">Add Quiz</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default AddQuizForm;
