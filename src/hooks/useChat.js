import { useCallback, useState } from 'react';
import { createWelcomeMessage } from '../mocks/initialConversation.js';
import { pickMockResponse, randomTypingDelay } from '../mocks/responses.js';

export const USE_MOCK_DATA = true;

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useChat() {
  const [messages, setMessages] = useState(() => [createWelcomeMessage()]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickRepliesUsed, setQuickRepliesUsed] = useState(false);

  const appendMessage = useCallback((role, text) => {
    const msg = {
      id: createMessageId(),
      role,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed || isTyping) return;

      appendMessage('user', trimmed);
      setQuickRepliesUsed(true);

      if (USE_MOCK_DATA) {
        setIsTyping(true);
        const delay = randomTypingDelay();
        await new Promise((r) => setTimeout(r, delay));
        const reply = pickMockResponse(trimmed);
        setIsTyping(false);
        appendMessage('agent', reply);
        return;
      }

      // Future: replace with fetch('/api/chat', ...)
      setIsTyping(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed }),
        });
        const data = await res.json();
        appendMessage('agent', data.reply ?? 'Ответ не получен.');
      } catch {
        appendMessage('agent', 'Не удалось связаться с сервером. Попробуйте позже.');
      } finally {
        setIsTyping(false);
      }
    },
    [appendMessage, isTyping]
  );

  return {
    messages,
    isTyping,
    sendMessage,
    quickRepliesVisible: !quickRepliesUsed,
    markQuickRepliesUsed: () => setQuickRepliesUsed(true),
  };
}
