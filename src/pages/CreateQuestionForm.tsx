import React, { useState } from "react";

interface CreateQuestionFormProps {
  quizId: number;
  onCreateQuestion: (
    title: string,
    description: string,
    quizId: number
  ) => void;
}

const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({
  quizId,
  onCreateQuestion,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleCreate = () => {
    if (title && description) {
      onCreateQuestion(title, description, quizId);
      setTitle("");
      setDescription("");
    } else {
      console.log("Please fill in both title and description.");
    }
  };

  return (
    <div>
      <h3>Create New Question</h3>
      <input
        type="text"
        placeholder="Question Title"
        value={title}
        onChange={handleTitleChange}
      />
      <input
        type="text"
        placeholder="Question Description"
        value={description}
        onChange={handleDescriptionChange}
      />
      <button onClick={handleCreate}>Create Question</button>
    </div>
  );
};

export default CreateQuestionForm;
