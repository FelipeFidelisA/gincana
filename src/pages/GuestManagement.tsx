import { useEffect, useState } from "react";
import { api } from "../api";

const GuestManagement = ({ quizCode, onClose }: any) => {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuizData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response: any = await api.get(`/quiz/code/${quizCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setQuizData(response.data);
        setLoading(false);
        console.log("Quiz data fetched:", response.data);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response: any = await api.post(
        `/quiz/code/${quizCode}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Quiz started:", response.data);
        fetchQuizData(); // Refresh quiz data after starting
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  const ejectGuest = (guestId: string) => {
    if (window.confirm("Are you sure you want to eject this guest?")) {
      const token = localStorage.getItem("authToken");
      api
        .post(
          `/quiz/code/${quizCode}/eject/${guestId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Guest ejected:", response.data);
          fetchQuizData();
        })
        .catch((error) => {
          console.error("Error ejecting guest:", error);
        });
    }
  };

  useEffect(() => {
    fetchQuizData();

    const intervalId = setInterval(() => {
      fetchQuizData();
    }, 500);

    return () => clearInterval(intervalId);
  }, [quizCode]);

  if (loading) {
    return <div>Loading quiz data...</div>;
  }

  // Ordenando os guests por nome em ordem alfabética
  const sortedGuests = quizData.guests.sort((a: any, b: any) => a.name.localeCompare(b.name));

  // As questões já estão ordenadas por índice no array, mas para garantir a ordem, você pode usar .sort() no array
  const sortedQuestions = [...quizData.questions].sort((a: any, b: any) => a.id - b.id);

  return (
    <div className="guest-management">
      <h2 className="title">Guest Management for Quiz: {quizData.title}</h2>
      <p className="status">Status: {quizData.status}</p>

      <button className="start-btn" onClick={startQuiz}>
        Start Quiz
      </button>

      <div className="guests">
        <h3>Guests</h3>
        {sortedGuests.length === 0 ? (
          <p>No guests have joined yet.</p>
        ) : (
          <ul>
            {sortedGuests.map((guest: any) => (
              <li key={guest.id} className="guest-item">
                <strong>{guest.name}</strong> - Score: {guest.score}
                <br />
                <small>{guest.ip}</small>
                <button
                  className="eject-btn"
                  onClick={() => ejectGuest(guest.id)}
                >
                  Eject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="questions">
        <h3>Questions</h3>
        {sortedQuestions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          <ul>
            {sortedQuestions.map((question: any) => (
              <li key={question.id}>
                <strong>{question.title}</strong>: {question.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default GuestManagement;
