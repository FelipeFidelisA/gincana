// components/TestQuizApi.tsx
import React, { useEffect, useState } from "react";
import { useQuizApi } from "../context/QuizApiContext";

const TestQuizApi: React.FC = () => {
  const {
    createQuiz,
    listQuizzes,
    createQuestion,
    listQuestions,
    createOption,
    listOptions,
  } = useQuizApi();

  const [createdQuiz, setCreatedQuiz] = useState<any>(null);
  const [createdQuestion, setCreatedQuestion] = useState<any>(null);
  const [createdOption, setCreatedOption] = useState<any>(null);

  useEffect(() => {
    const performTests = async () => {
      try {
        // 1. Criar um Quiz
        const quizTitle = "Teste de React";
        await createQuiz(quizTitle);
        console.log(`Quiz "${quizTitle}" criado com sucesso.`);

        // Listar quizzes para obter o quiz criado
        await listQuizzes();
        const quizzes: any = await listQuizzes();
        const quiz = quizzes.find((q: any) => q.title === quizTitle);
        if (!quiz) {
          console.error("Quiz criado não encontrado.");
          return;
        }
        setCreatedQuiz(quiz);
        console.log("Quiz criado:", quiz);

        // 2. Criar uma Pergunta para o Quiz
        const questionTitle = "Qual é a versão mais recente do React?";
        const questionDescription =
          "Selecione a versão mais recente do React disponível.";
        const quizId = quiz.quizCode; // Supondo que 'quizCode' seja usado como ID
        await createQuestion(questionTitle, questionDescription, quizId);
        console.log(`Pergunta "${questionTitle}" criada com sucesso.`);

        // Listar perguntas para obter a pergunta criada
        await listQuestions(quizId);
        const questions: any = await listQuestions(quizId);
        const question = questions.find((q: any) => q.title === questionTitle);
        if (!question) {
          console.error("Pergunta criada não encontrada.");
          return;
        }
        setCreatedQuestion(question);
        console.log("Pergunta criada:", question);

        // 3. Criar uma Opção para a Pergunta
        const optionDescription = "React 18";
        const isRight = true;
        const questionId = question.id; // Supondo que a pergunta tenha um campo 'id'
        await createOption(optionDescription, isRight, questionId);
        console.log(`Opção "${optionDescription}" criada com sucesso.`);

        // Listar opções para verificar a criação
        await listOptions(questionId);
        const options: any = await listOptions(questionId);
        const option = options.find(
          (opt: any) => opt.description === optionDescription
        );
        if (!option) {
          console.error("Opção criada não encontrada.");
          return;
        }
        setCreatedOption(option);
        console.log("Opção criada:", option);
      } catch (error) {
        console.error("Erro durante os testes:", error);
      }
    };

    performTests();
  }, [
    createQuiz,
    listQuizzes,
    createQuestion,
    listQuestions,
    createOption,
    listOptions,
  ]);

  return (
    <div>
      <h2>Teste da API de Quiz</h2>
      <p>Confira o console para ver os resultados dos testes.</p>
    </div>
  );
};

export default TestQuizApi;
