import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

interface Quiz {
  quizCode: string;
  title: string;
}

interface QuizApiContextType {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  createQuiz: (title: string) => Promise<void>;
  listQuizzes: () => Promise<void>;
  increaseScore: (
    guestId: number,
    quizCode: string,
    value: number
  ) => Promise<void>;
  getRanking: (quizCode: string) => Promise<void>;
  createGuest: (name: string, ip: string) => Promise<void>;
  joinQuiz: (guestId: number, quizCode: string) => Promise<void>;
  createQuestion: (
    title: string,
    description: string,
    quizId: number
  ) => Promise<void>;
  listQuestions: (quizId: number) => Promise<void>;
  createOption: (
    description: string,
    isRight: boolean,
    questionId: number
  ) => Promise<void>;
  listOptions: (questionId: number) => Promise<void>;
}

const QuizApiContext = createContext<QuizApiContextType | undefined>(undefined);
export const QuizApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    listQuizzes();
  }, []);

  const createQuiz = async (title: string) => {
    try {
      await api.post(
        "/quiz",
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      listQuizzes();
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const listQuizzes = async () => {
    try {
      const response = await api.get("/quiz", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setQuizzes(response.data); // Assuming the response returns a list of quizzes
    } catch (error) {
      console.error("Error listing quizzes:", error);
    }
  };

  const increaseScore = async (
    guestId: number,
    quizCode: string,
    value: number
  ) => {
    try {
      await api.put(
        "/quiz/score/plus",
        { guestId, quizCode, value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error increasing score:", error);
    }
  };

  const getRanking = async (quizCode: string) => {
    try {
      const response = await api.get(`/quiz/ranking/${quizCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Ranking:", response.data);
    } catch (error) {
      console.error("Error getting ranking:", error);
    }
  };

  const createGuest = async (name: string, ip: string) => {
    try {
      await api.post("/guest", { name, ip });
    } catch (error) {
      console.error("Error creating guest:", error);
    }
  };

  const joinQuiz = async (guestId: number, quizCode: string) => {
    try {
      await api.post("/guest/join", { guestId, quizCode });
    } catch (error) {
      console.error("Error joining quiz:", error);
    }
  };

  const createQuestion = async (
    title: string,
    description: string,
    quizId: number
  ) => {
    try {
      console.log("Creating question:", title, description, quizId);
      const body = {
        title: title,
        description: description,
        quizId: quizId,
      };

      await api.post("/question", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const listQuestions = async (quizId: number) => {
    console.log("Listing questions for quiz:", quizId);
    try {
      const response = await api.get(`/question/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Questions:", response.data);
    } catch (error) {
      console.error("Error listing questions:", error);
    }
  };

  const createOption = async (
    description: string,
    isRight: boolean,
    questionId: number
  ) => {
    try {
      await api.post(
        "/option",
        { description, isRight, questionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error creating option:", error);
    }
  };

  const listOptions = async (questionId: number) => {
    try {
      const response = await api.get(`/option/question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Options:", response.data);
    } catch (error) {
      console.error("Error listing options:", error);
    }
  };

  return (
    <QuizApiContext.Provider
      value={{
        quizzes,
        setQuizzes,
        createQuiz,
        listQuizzes,
        increaseScore,
        getRanking,
        createGuest,
        joinQuiz,
        createQuestion,
        listQuestions,
        createOption,
        listOptions,
      }}
    >
      {children}
    </QuizApiContext.Provider>
  );
};

export const useQuizApi = (): QuizApiContextType => {
  const context = useContext(QuizApiContext);
  if (!context) {
    throw new Error("useQuizApi must be used within a QuizApiProvider");
  }
  return context;
};
