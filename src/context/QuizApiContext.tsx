import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

interface Quiz {
  quizCode: string;
  title: string;
}

interface QuizApiContextType {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  createQuiz: (title: string) => Promise<any>;
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
  ) => Promise<any>;
  listQuestions: (quizId: number) => Promise<void>;
  createOption: (
    description: string,
    isRight: boolean,
    questionId: number
  ) => Promise<void>;
  listOptions: (questionId: number) => Promise<void>;
  quizSelected: Quiz | null;
  setQuizSelected: React.Dispatch<React.SetStateAction<Quiz | null>>;
}

const QuizApiContext = createContext<QuizApiContextType | undefined>(undefined);
export const QuizApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizSelected, setQuizSelected] = useState<Quiz | null>(null);

  useEffect(() => {
    listQuizzes();
  }, []);

  const listQuizzes = async () => {
    try {
      const response: any = await api.get("/quiz", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("🚀 ~ listQuizzes ~ response:", response);
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error listing quizzes:", error);
    }
  };

  const createQuiz = async (title: string): Promise<Quiz> => {
    try {
      const response: any = await api.post(
        "/quiz",
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      listQuizzes(); // Atualiza a lista de quizzes após a criação
      return response.data; // Retorna diretamente o quiz criado
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error; // Propaga o erro para que o chamador possa lidar com ele
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
      const response = await api.post("/question", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("🚀 ~ response:", response)
      console.log("🚀 ~ response:", response)
      console.log("🚀 ~ response:", response)
      console.log("🚀 ~ response:", response)
      return response;
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
        quizSelected,
        setQuizSelected,
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
