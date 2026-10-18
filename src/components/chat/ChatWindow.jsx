import { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader.jsx';
import { MessageList } from './MessageList.jsx';
import { ChatInput } from './ChatInput.jsx';

export function ChatWindow({
  open,
  onMinimize,
  onClose,
  messages,
  isTyping,
  sendMessage,
  quickRepliesVisible,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="chat-window" role="dialog" aria-modal="true" aria-label="Чат с ассистентом">
      <ChatHeader onMinimize={onMinimize} onClose={onClose} />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        quickRepliesVisible={quickRepliesVisible}
        onQuickReply={sendMessage}
        inputDisabled={isTyping}
      />
      <ChatInput onSend={sendMessage} disabled={isTyping} inputRef={inputRef} />
    </div>
  );
}
