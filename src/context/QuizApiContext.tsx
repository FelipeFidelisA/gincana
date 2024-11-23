import React, { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '../api'; // Importando a instância do axios

// Tipos de dados do quiz, perguntas, opções e ranking
interface User {
    id: number;
    name: string;
    email: string;
}

interface Guest {
    id: number;
    name: string;
    ip: string;
    score: number;
}

interface Question {
    id: number;
    title: string;
    description: string;
    quizId: number;
}


interface Quiz {
    id: number;
    title: string;
    code: string;
    isDone: boolean;
    user: User;
    guests: Guest[];
    questions: Question[];
}

interface Ranking {
    guestRanking: {
        guestName: string;
        score: number;
        position: number;
    }[];
    winner: {
        guestName: string;
        score: number;
        position: number;
    };
}

// Contexto do API do Quiz
interface QuizApiContextType {
    quizzes: Quiz[];
    ranking: Ranking | null;
    loading: boolean;
    error: string | null;
    fetchQuizzes: () => void;
    createQuiz: (title: string) => void;
    fetchRanking: (quizCode: string) => void;
    updateScore: (guestId: number, quizCode: string, value: number) => void;
    removeQuiz: (quizCode: string) => void;
}

const QuizApiContext = createContext<QuizApiContextType | undefined>(undefined);

// Interface para a propriedade children
interface QuizApiProviderProps {
    children: ReactNode;
}

// Provider do contexto
export const QuizApiProvider: React.FC<QuizApiProviderProps> = ({ children }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [ranking, setRanking] = useState<Ranking | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar todos os quizzes
    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const responses: any = await fetch('https://postgresql-16-adada.5lsiua.easypanel.host/quiz',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaGVucmlxdWUyMDE1MjBAZ21haWwuY29tIiwiaWF0IjoxNzMyNDA1NjY2LCJleHAiOjE3MzI0MDYzODZ9.dMqjkoHW7jLZuHjvx0Y8zlYq7SLHG0t75G_pA6aFAxQ`,
                    },
                });
            setQuizzes(responses.data);
        } catch (err) {
            setError('Erro ao buscar quizzes');
        } finally {
            setLoading(false);
        }
    };

    // Função para criar um novo quiz
    const createQuiz = async (title: string) => {
        setLoading(true);
        try {
            await api.post(
                '/quiz',
                { title },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchQuizzes(); // Atualiza a lista de quizzes após criação
        } catch (err) {
            setError('Erro ao criar quiz');
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar o ranking de um quiz
    const fetchRanking = async (quizCode: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/quiz/ranking/${quizCode}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRanking(response.data);
        } catch (err) {
            setError('Erro ao buscar ranking');
        } finally {
            setLoading(false);
        }
    };

    // Função para atualizar a pontuação de um convidado
    const updateScore = async (guestId: number, quizCode: string, value: number) => {
        setLoading(true);
        try {
            await api.put(
                '/quiz/score/plus',
                { guestId, quizCode, value },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchQuizzes();
        } catch (err) {
            setError('Erro ao atualizar a pontuação');
        } finally {
            setLoading(false);
        }
    };

    // Função para remover um quiz
    const removeQuiz = async (quizCode: string) => {
        setLoading(true);
        try {
            await api.delete(`/quiz/${quizCode}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchQuizzes(); // Atualiza a lista de quizzes após a remoção
        } catch (err) {
            setError('Erro ao remover o quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <QuizApiContext.Provider
            value={{
                quizzes,
                ranking,
                loading,
                error,
                fetchQuizzes,
                createQuiz,
                fetchRanking,
                updateScore,
                removeQuiz,
            }}
        >
            {children}
        </QuizApiContext.Provider>
    );
};

// Hook para consumir o contexto
export const useQuizApi = (): QuizApiContextType => {
    const context = useContext(QuizApiContext);
    if (!context) {
        throw new Error('useQuizApi must be used within a QuizApiProvider');
    }
    return context;
};


