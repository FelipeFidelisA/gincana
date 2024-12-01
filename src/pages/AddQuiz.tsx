// src/components/AddQuiz.tsx

import React, { useState } from 'react';
import axios from 'axios';

// Interfaces para definir a estrutura dos dados
interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  options: Option[];
}

interface Quiz {
  title: string;
  questions: Question[];
}

const AddQuiz: React.FC = () => {
  // Estado para armazenar os dados do quiz
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    questions: [
      {
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
        ],
      },
    ],
  });

  // Estado para mensagens de sucesso ou erro
  const [message, setMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // ID do usuário autenticado (substitua com a lógica de autenticação real)
  const userId = 1; // Exemplo estático

  // Função para atualizar o título do quiz
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz({ ...quiz, title: e.target.value });
  };

  // Função para atualizar o texto de uma pergunta
  const handleQuestionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index].questionText = e.target.value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Função para atualizar o texto de uma opção
  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex].optionText = e.target.value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Função para atualizar se uma opção está correta
  const handleIsCorrectChange = (
    qIndex: number,
    oIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex].isCorrect = e.target.checked;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Função para adicionar uma nova pergunta
  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: '',
          options: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
          ],
        },
      ],
    });
  };

  // Função para remover uma pergunta
  const removeQuestion = (qIndex: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(qIndex, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Função para adicionar uma opção a uma pergunta
  const addOption = (qIndex: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.push({ optionText: '', isCorrect: false });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Função para remover uma opção de uma pergunta
  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...quiz.questions];
    if (newQuestions[qIndex].options.length > 2) { // Mínimo de 2 opções
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuiz({ ...quiz, questions: newQuestions });
    }
  };

  // Função para validar o formulário antes do envio
  const validateQuiz = (): boolean => {
    if (quiz.title.trim() === '') {
      setMessage('O título do quiz é obrigatório.');
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      if (question.questionText.trim() === '') {
        setMessage(`O texto da pergunta ${i + 1} é obrigatório.`);
        return false;
      }
      if (question.options.length < 2) {
        setMessage(`A pergunta ${i + 1} deve ter pelo menos 2 opções.`);
        return false;
      }
      let hasCorrect = false;
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j];
        if (option.optionText.trim() === '') {
          setMessage(
            `O texto da opção ${j + 1} da pergunta ${i + 1} é obrigatório.`
          );
          return false;
        }
        if (option.isCorrect) {
          hasCorrect = true;
        }
      }
      if (!hasCorrect) {
        setMessage(
          `A pergunta ${i + 1} deve ter pelo menos uma opção correta.`
        );
        return false;
      }
    }

    setMessage('');
    setErrorDetails(null);
    return true;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateQuiz()) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/quizzes',
        {
          title: quiz.title,
          questions: quiz.questions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'userid': userId.toString(), // Header ajustado para 'userid'
          },
        }
      );
      console.log("🚀 ~ handleSubmit ~ response:", response);

      setMessage('Quiz criado com sucesso!');
      setErrorDetails(null);
      // Resetar o formulário após o envio
      setQuiz({
        title: '',
        questions: [
          {
            questionText: '',
            options: [
              { optionText: '', isCorrect: false },
              { optionText: '', isCorrect: false },
            ],
          },
        ],
      });
    } catch (error: any) {
      console.error("Erro ao criar o quiz:", error);
      if (error.response) {
        // Erros de resposta do servidor
        setMessage(error.response.data.error || 'Erro ao criar o quiz. Tente novamente.');
        setErrorDetails(JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // Erros de solicitação
        setMessage('Sem resposta do servidor. Verifique sua conexão.');
        setErrorDetails('Sem resposta do servidor.');
      } else {
        // Outros erros
        setMessage('Erro ao criar o quiz. Tente novamente.');
        setErrorDetails(error.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Adicionar Novo Quiz</h2>
      {message && <p style={styles.message}>{message}</p>}
      {errorDetails && (
        <pre style={styles.errorDetails}>{errorDetails}</pre>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label htmlFor="title">Título do Quiz:</label>
          <input
            type="text"
            id="title"
            value={quiz.title}
            onChange={handleTitleChange}
            required
            style={styles.input}
          />
        </div>

        <h3>Perguntas</h3>
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} style={styles.question}>
            <div style={styles.questionHeader}>
              <label>Pergunta {qIndex + 1}:</label>
              {quiz.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  style={styles.removeButton}
                >
                  Remover Pergunta
                </button>
              )}
            </div>
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              required
              placeholder="Texto da pergunta"
              style={styles.input}
            />

            <div style={styles.options}>
              <h4>Opções</h4>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} style={styles.option}>
                  <input
                    type="text"
                    value={option.optionText}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e)
                    }
                    required
                    placeholder={`Opção ${oIndex + 1}`}
                    style={styles.input}
                  />
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleIsCorrectChange(qIndex, oIndex, e)
                      }
                    />
                    Correta
                  </label>
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      style={styles.removeButton}
                    >
                      Remover Opção
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                style={styles.addButton}
              >
                Adicionar Opção
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          style={styles.addButton}
        >
          Adicionar Pergunta
        </button>

        <button type="submit" style={styles.submitButton}>
          Criar Quiz
        </button>
      </form>
    </div>
  );
};

// Estilos simples para o componente
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    boxSizing: 'border-box',
  },
  question: {
    border: '1px solid #ccc',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  options: {
    marginTop: '10px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  checkboxLabel: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  removeButton: {
    padding: '6px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  },
  message: {
    color: 'red',
    marginBottom: '20px',
  },
  errorDetails: {
    backgroundColor: '#fdd',
    color: '#900',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    whiteSpace: 'pre-wrap',
  },
};

export default AddQuiz;
