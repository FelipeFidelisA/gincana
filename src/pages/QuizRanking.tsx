const QuizRanking = ({ quizId, onClose }: any) => {
    return (
        <div>
            <h2>Ranking for Quiz {quizId}</h2>
            <p>Here you can see the rankings for this quiz.</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default QuizRanking;
