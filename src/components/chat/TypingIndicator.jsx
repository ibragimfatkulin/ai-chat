export function TypingIndicator() {
  return (
    <div className="chat-message chat-message--agent" aria-live="polite" aria-label="Ассистент печатает">
      <div className="chat-message__bubble chat-typing">
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
      </div>
    </div>
  );
}
