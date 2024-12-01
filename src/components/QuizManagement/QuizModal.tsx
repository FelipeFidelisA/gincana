const QuizModal = ({ modalData, closeModal }: any) => {
    if (!modalData.isOpen || !modalData.quiz) {
      return null; // Não renderiza nada caso o modal não esteja aberto ou o quiz não esteja disponível.
    }
  
    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Respostas para: {modalData.quiz.nome}</h3>
          {modalData.quiz.respostas.length === 0 ? (
            <p>Nenhum usuário respondeu a este quiz ainda.</p>
          ) : (
            <ul>
              {modalData.quiz.respostas.map((resp: any, respIndex: any) => (
                <li key={respIndex} className="response-item">
                  <strong>Nome:</strong> {resp.nome}
                  <br />
                  <strong>Data:</strong>{" "}
                  {new Date(resp.data).toLocaleString()}
                  <br />
                  <strong>Respostas:</strong>
                  <ul>
                    {resp.respostas.map((resposta: any, qIndex: any) => (
                      <li key={qIndex}>
                        Pergunta {qIndex + 1}:{" "}
                        {modalData.quiz.perguntas[qIndex].opcoes[resposta]} -{" "}
                        {resposta === modalData.quiz.perguntas[qIndex].respostaCerta
                          ? "✅ Correta"
                          : "❌ Incorreta"}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <button onClick={closeModal} className="close-modal-button">
            Fechar
          </button>
        </div>
      </div>
    );
  };
  
  export default QuizModal;
  