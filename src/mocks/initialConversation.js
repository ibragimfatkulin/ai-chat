export const mockSession = {
  id: 'session-demo-001',
  startedAt: '2026-10-10T14:00:00+05:00',
};

export const mockQuickReplies = [
  { id: 'qr-1', label: 'Цены', text: 'Расскажите о ценах' },
  { id: 'qr-2', label: 'Как подключить', text: 'Как подключить чат на сайт?' },
  { id: 'qr-3', label: 'Связаться с человеком', text: 'Хочу поговорить с оператором' },
  { id: 'qr-4', label: 'Демо', text: 'Покажите возможности ассистента' },
];

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createWelcomeMessage() {
  return {
    id: createMessageId(),
    role: 'agent',
    text:
      'Здравствуйте! Я ИИ-ассистент iThech. Помогу с тарифами, подключением виджета и отвечу на частые вопросы. Чем могу помочь?',
    createdAt: new Date().toISOString(),
  };
}
