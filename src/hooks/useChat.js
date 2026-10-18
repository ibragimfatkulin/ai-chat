import { useCallback, useState } from 'react';
import { createWelcomeMessage } from '../mocks/initialConversation.js';
import { pickMockResponse, randomTypingDelay } from '../mocks/responses.js';

/** Переключение на моки: VITE_USE_MOCK_DATA=true в .env */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toApiHistory(messages) {
  return messages.map((m) => ({ role: m.role, text: m.text }));
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

      const historyBefore = toApiHistory(messages);
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

      setIsTyping(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historyBefore,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          appendMessage(
            'agent',
            data.reply ?? 'Сервер временно недоступен. Попробуйте через минуту.'
          );
          return;
        }
        appendMessage('agent', data.reply ?? 'Ответ не получен.');
      } catch {
        appendMessage('agent', 'Не удалось связаться с сервером. Запустите npm run dev с backend.');
      } finally {
        setIsTyping(false);
      }
    },
    [appendMessage, isTyping, messages]
  );

  return {
    messages,
    isTyping,
    sendMessage,
    quickRepliesVisible: !quickRepliesUsed,
    markQuickRepliesUsed: () => setQuickRepliesUsed(true),
  };
}
