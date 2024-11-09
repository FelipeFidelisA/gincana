import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Quiz {
  nome: ReactNode;
  tempo: ReactNode;
  perguntas: any;
  respostas: any;
}

interface QuizContextProps {
  quizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  removeQuiz: (index: number) => void;
  registerResponse: (quizData: Quiz, response: any) => void;
}

export const QuizContext = createContext<QuizContextProps>({
  quizzes: [],
  addQuiz: () => {},
  removeQuiz: () => {},
  registerResponse: () => {},
});

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const storedQuizzes = localStorage.getItem("quizzes");
    return storedQuizzes ? JSON.parse(storedQuizzes) : [];
  });

  useEffect(() => {
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  const addQuiz = (quiz: Quiz) => {
    setQuizzes([
      ...quizzes,
      {
        ...quiz,
        respostas: [],
      },
    ]);
  };

  const removeQuiz = (index: number) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes.splice(index, 1);
    setQuizzes(updatedQuizzes);
  };

  const registerResponse = (quizData: Quiz, response: any) => {
    const quizIndex = quizzes.findIndex(
      (q) => JSON.stringify(q) === JSON.stringify(quizData)
    );
    if (quizIndex !== -1) {
      const updatedQuizzes = [...quizzes];
      updatedQuizzes[quizIndex].respostas.push(response);
      setQuizzes(updatedQuizzes);
    } else {
      addQuiz({ ...quizData, respostas: [response] });
    }
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        addQuiz,
        removeQuiz,
        registerResponse,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
