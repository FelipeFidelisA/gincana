// context/QuizApiContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { api } from "../api";

export interface Quiz {
  id: number;
  title: string;
  code: string;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  guests: Guest[];
  questions: Question[];
}

export interface Guest {
  id: number;
  name: string;
  ip: string;
  profileUrl: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  quizId: number;
  options?: Option[];
}

export interface Option {
  id: number;
  description: string;
  isRight: boolean;
  questionId: number;
}

interface QuizApiContextType {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  createQuiz: (title: string) => Promise<Quiz>;
  listQuizzes: () => Promise<void>;
  increaseScore: (
    guestId: number,
    quizCode: string,
    value: number
  ) => Promise<void>;
  getRanking: (quizCode: string) => Promise<void>;
  createGuest: (name: string, ip: string, profileUrl: string) => Promise<Guest>;
  joinQuiz: (guestId: number, quizCode: string) => Promise<void>;
  createQuestion: (
    title: string,
    description: string,
    quizId: number
  ) => Promise<Question>;
  listQuestions: (quizId: number) => Promise<Question[]>;
  createOption: (
    description: string,
    isRight: boolean,
    questionId: number
  ) => Promise<void>;
  listOptions: (questionId: number) => Promise<Option[]>;
  fetchOptionsForQuestion: (questionId: number) => Promise<Option[]>;
  quizSelected: Quiz | null;
  setQuizSelected: React.Dispatch<React.SetStateAction<Quiz | null>>;
  submitResponses: (
    guestId: number,
    quizCode: string,
    value: any
  ) => Promise<void>;
}

const QuizApiContext = createContext<QuizApiContextType | undefined>(undefined);

export const QuizApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizSelected, setQuizSelected] = useState<Quiz | null>(null);

  // Cache para armazenar opções já buscadas
  const optionsCache = useRef<{ [key: number]: Option[] }>({});

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setTimeout(() => {
        listQuizzes();
      }, 500);
    }
  }, []);

  const listQuizzes = async () => {
    try {
      const response: any = await api.get("/quiz", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Lista de Quizzes obtida com sucesso:", response.data);
      setQuizzes(response.data);
    } catch (error) {
      console.error("Erro ao listar os quizzes:", error);
    }
  };

  const createQuiz = async (title: string): Promise<any> => {
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
      console.log("Quiz criado com sucesso:", response.data);
      await listQuizzes(); // Atualiza a lista de quizzes após a criação
      const lastIndex = quizzes.length - 1;
      const lastQuiz = quizzes[lastIndex];
      console.log("Último quiz na lista após criação:", lastQuiz);
      return lastQuiz.id; // Retorna o ID real do quiz criado
    } catch (error) {
      console.error("1Erro ao criar o quiz:", error);
      throw error; // Propaga o erro para que o chamador possa tratar
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
      console.log(
        `Pontuação aumentada em ${value} para o convidado ID ${guestId} no quiz ${quizCode}.`
      );
    } catch (error) {
      console.error("Erro ao aumentar a pontuação:", error);
    }
  };

  const getRanking = async (quizCode: string) => {
    try {
      const response = await api.get(`/quiz/ranking/${quizCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(`Ranking obtido para o quiz ${quizCode}:`, response.data);
    } catch (error) {
      console.error("Erro ao obter o ranking:", error);
    }
  };

  const createGuest = async (
    name: string,
    ip: string,
    profileUrl: string
  ): Promise<Guest> => {
    try {
      const response = await api.post("/guest", { name, ip, profileUrl });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar o convidado:", error);
      throw error;
    }
  };

  const joinQuiz = async (guestId: number, quizCode: string) => {
    try {
      await api.post("/guest/join", { guestId, quizCode });
      console.log(
        `Convidado ID ${guestId} entrou no quiz com código ${quizCode}.`
      );
    } catch (error) {
      console.error("Erro ao entrar no quiz:", error);
      throw error;
    }
  };

  const createQuestion = async (
    title: string,
    description: string,
    quizId: number
  ): Promise<any> => {
    try {
      const body = {
        title,
        description,
        quizId,
      };
      const response = await api.post("/question", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Erro ao criar a pergunta.");
      }
      console.log(
        `Pergunta criada com sucesso para o Quiz ID ${quizId}:`,
        response.data
      );
      return response.data; // Retorna os dados da pergunta criada
    } catch (error) {
      console.error("Erro ao criar a pergunta:", error);
      throw error;
    }
  };

  const listQuestions = async (quizId: number): Promise<Question[]> => {
    try {
      const response = await api.get(`/question/quiz/${quizId}`);
      console.log(`Perguntas obtidas para o Quiz ID ${quizId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar as perguntas:", error);
      throw error;
    }
  };

  const createOption = async (
    description: string,
    isRight: boolean,
    questionId: number
  ) => {
    try {
      const response = await api.post(
        "/option",
        { description, isRight, questionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Erro ao criar a opção.");
      }
      console.log(
        `Opção criada com sucesso para a Pergunta ID ${questionId}:`,
        response.data
      );

      if (optionsCache.current[questionId]) {
        optionsCache.current[questionId].push({
          id: response.data.id,
          description,
          isRight,
          questionId,
        });
        console.log(
          `Opção adicionada ao cache para a Pergunta ID ${questionId}.`
        );
      }
    } catch (error) {
      console.error("Erro ao criar a opção:", error);
      throw error;
    }
  };

  const listOptions = async (questionId: number): Promise<Option[]> => {
    try {
      const response = await api.get(`/option/question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(
        `Opções obtidas para a Pergunta ID ${questionId}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao listar as opções:", error);
      throw error;
    }
  };

  const fetchOptionsForQuestion = async (
    questionId: number
  ): Promise<Option[]> => {
    // Verifica se as opções já estão no cache
    if (optionsCache.current[questionId]) {
      console.log(`Opções para a Pergunta ID ${questionId} obtidas do cache.`);
      return optionsCache.current[questionId];
    }

    try {
      const response = await api.get(`/option/question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const options: Option[] = response.data;
      // Armazena as opções no cache
      optionsCache.current[questionId] = options;
      console.log(
        `Opções para a Pergunta ID ${questionId} obtidas da API e armazenadas no cache:`,
        options
      );
      return options;
    } catch (error) {
      console.error(
        `Erro ao buscar as opções para a Pergunta ID ${questionId}:`,
        error
      );
      return [];
    }
  };

  const submitResponses = async (
    guestId: number,
    quizCode: string,
    value: string
  ): Promise<any> => {
    try {
      const response = await api.put(
        `/quiz/score/plus`,
        {
          guestId,
          quizCode,
          value,
        }
      );
      console.log(response);
      console.log(
        `Respostas enviadas com sucesso para o convidado ID ${guestId}.`
      );
    } catch (error) {
      console.error("Erro ao enviar as respostas:", error);
      throw error;
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
        fetchOptionsForQuestion, // Adicionamos o novo método ao contexto
        quizSelected,
        setQuizSelected,
        submitResponses,
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
