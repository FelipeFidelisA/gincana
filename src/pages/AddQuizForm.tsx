import React, { useState } from 'react';
import { useQuizApi } from '../context/QuizApiContext';
import CreateQuestionForm from './CreateQuestionForm';
import '../styles/AddQuizForm.css';
const AddQuizForm = ({ onClose }: any) => {
  const [quizName, setQuizName] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const { createQuiz, listQuizzes } = useQuizApi();

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizName.trim()) {
      createQuiz(quizName);
      setQuizName('');
      listQuizzes(); // Atualize a lista de quizzes após a criação
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCreateQuiz = () => {
    console.log('Criar quiz com perguntas:', questions);
    // Adicione aqui a lógica para salvar o quiz e suas perguntas
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="add-quiz-form">
      <form onSubmit={handleQuizSubmit} className="quiz-form">
        <h2 className="form-title">Adicionar Quiz</h2>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Nome do Quiz"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="quiz-name-input"
          />
        </div>

        <div className="question-container">
          <CreateQuestionForm 
            quizId={1}
            onCreateQuestion={(question) => setQuestions([...questions, question])}
          />
        </div>

        <div className="pagination-controls">
          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="pagination-button"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="pagination-button"
          >
            Próxima
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            onClick={handleCreateQuiz}
            className="create-quiz-button"
          >
            Criar Quiz
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="close-button"
          >
            Fechar
          </button>
        </div>
      </form>

      <div className="question-pagination">
        <span>{`Pergunta ${currentQuestionIndex + 1} de ${questions.length}`}</span>
      </div>
    </div>
  );
};

export default AddQuizForm;
