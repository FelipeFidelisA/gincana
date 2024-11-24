const GuestManagement = ({ quizId, onClose }: any) => {
    return (
        <div>
            <h2>Guest Management for Quiz {quizId}</h2>
            <p>Here you can manage guests for this quiz.</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default GuestManagement;
