import React, { createContext, useState, ReactNode, FC } from 'react';

interface Quiz {
  id: number;
  title: string;
}

interface QuizContextType {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

export const QuizContext = createContext<QuizContextType>({
  quizzes: [],
  setQuizzes: () => {},
});

export const QuizProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  return (
    <QuizContext.Provider value={{ quizzes, setQuizzes }}>
      {children}
    </QuizContext.Provider>
  );
};
