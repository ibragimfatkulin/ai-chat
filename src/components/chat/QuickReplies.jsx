import { mockQuickReplies } from '../../mocks/initialConversation.js';

export function QuickReplies({ visible, onSelect, disabled }) {
  if (!visible) return null;

  return (
    <div className="chat-quick-replies" role="group" aria-label="Быстрые ответы">
      {mockQuickReplies.map((item) => (
        <button
          key={item.id}
          type="button"
          className="chat-quick-replies__chip"
          disabled={disabled}
          onClick={() => onSelect(item.text)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
