import React, { useState } from "react";

interface CreateQuestionFormProps {
  quizId: number;
  onCreateQuestion: (
    title: string,
    description: string,
    quizId: number,
    options: any[]
  ) => void;
}

const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({
  quizId,
  onCreateQuestion,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [options, setOptions] = useState<
    { description: string; isRight: boolean }[]
  >([
    { description: "", isRight: false },
    { description: "", isRight: false },
    { description: "", isRight: false },
    { description: "", isRight: false },
  ]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].description = value;
    setOptions(updatedOptions);
  };

  const handleCorrectOptionChange = (index: number) => {
    const updatedOptions = options.map((option, i) => ({
      ...option,
      isRight: i === index,
    }));
    setOptions(updatedOptions);
  };

  const handleCreate = () => {
    if (title && description && options.every((option) => option.description)) {
      onCreateQuestion(title, description, quizId, options);
      setTitle("");
      setDescription("");
      setOptions([
        { description: "", isRight: false },
        { description: "", isRight: false },
        { description: "", isRight: false },
        { description: "", isRight: false },
      ]);
    } else {
      alert("Por favor, preencha todos os campos da pergunta e das opções.");
    }
  };

  return (
    <div>
      <h3>Criar Nova Pergunta</h3>
      <input
        type="text"
        placeholder="Título da Pergunta"
        value={title}
        onChange={handleTitleChange}
      />
      <input
        type="text"
        placeholder="Descrição da Pergunta"
        value={description}
        onChange={handleDescriptionChange}
      />

      <h4>Opções</h4>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Opção ${index + 1}`}
            value={option.description}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          <label>
            <input
              type="radio"
              name={`correct-option-${index}`}
              checked={option.isRight}
              onChange={() => handleCorrectOptionChange(index)}
            />
            Correta
          </label>
        </div>
      ))}

      <button onClick={handleCreate}>Criar Pergunta</button>
    </div>
  );
};

export default CreateQuestionForm;
