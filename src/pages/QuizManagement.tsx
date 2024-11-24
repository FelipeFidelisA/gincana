import { useEffect, useState } from "react";
import Modal from "react-modal";
import QuizList from "./QuizList";
import GuestManagement from "./GuestManagement";
import QuizRanking from "./QuizRanking";
import AddQuizForm from "./AddQuizForm";
import QuestionList from "./QuestionList";
import { useQuizApi } from "../context/QuizApiContext";

// Define the app element for Modal to manage accessibility
Modal.setAppElement("#root");

const QuizManagement = () => {
  // State hooks
  const { quizzes } = useQuizApi();
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  useEffect(() => {
    quizzes;
  }, []);
  // Modal management functions
  const openGuestModal = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsGuestModalOpen(true);
  };

  const openRankingModal = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsRankingModalOpen(true);
  };

  const openAddQuizModal = () => {
    setIsAddQuizModalOpen(true);
  };

  const openAddQuestionModal = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsAddQuestionModalOpen(true);
  };

  const closeModal = () => {
    setIsGuestModalOpen(false);
    setIsRankingModalOpen(false);
    setIsAddQuizModalOpen(false);
    setIsAddQuestionModalOpen(false);
  };

  const addQuiz = (quizName: string) => {
    console.log("Adding quiz:", quizName);
  };

  return (
    <div>
      <h1>Quiz Management</h1>

      {/* Add Quiz Button */}
      <button onClick={openAddQuizModal}>Add Quiz</button>

      {/* Quiz List */}
      <QuizList
        quizzes={quizzes}
        selectedQuizId={selectedQuizId}
        onOpenGuestModal={openGuestModal}
        onOpenRankingModal={openRankingModal}
        onOpenAddQuestionModal={openAddQuestionModal}
      />

      {/* Guest Management Modal */}
      <Modal
        isOpen={isGuestModalOpen}
        onRequestClose={closeModal}
        contentLabel="Guest Management"
      >
        <GuestManagement quizId={selectedQuizId} onClose={closeModal} />
      </Modal>

      {/* Quiz Ranking Modal */}
      <Modal
        isOpen={isRankingModalOpen}
        onRequestClose={closeModal}
        contentLabel="Quiz Ranking"
      >
        <QuizRanking quizId={selectedQuizId} onClose={closeModal} />
      </Modal>

      {/* Add Quiz Modal */}
      <Modal
        isOpen={isAddQuizModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Quiz"
      >
        <AddQuizForm onAddQuiz={addQuiz} onClose={closeModal} />
      </Modal>

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddQuestionModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Question"
      >
        <QuestionList quizId={selectedQuizId} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default QuizManagement;
