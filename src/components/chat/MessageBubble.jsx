function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--agent'}`}>
      <div className="chat-message__bubble">
        <p className="chat-message__text">{message.text}</p>
        <time className="chat-message__time" dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
