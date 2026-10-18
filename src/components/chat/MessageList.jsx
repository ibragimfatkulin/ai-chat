import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { QuickReplies } from './QuickReplies.jsx';

export function MessageList({
  messages,
  isTyping,
  quickRepliesVisible,
  onQuickReply,
  inputDisabled,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <QuickReplies
        visible={quickRepliesVisible && !isTyping}
        onSelect={onQuickReply}
        disabled={inputDisabled}
      />
      <div ref={bottomRef} className="chat-messages__anchor" />
    </div>
  );
}
