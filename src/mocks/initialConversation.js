export const mockSession = {
  id: 'session-demo-001',
  startedAt: '2026-10-10T14:00:00+05:00',
};

export const mockQuickReplies = [
  { id: 'qr-1', label: 'Клавиатура', text: 'Помогите подобрать клавиатуру для работы' },
  { id: 'qr-2', label: 'Наушники', text: 'Какие наушники лучше для ПК и созвонов?' },
  { id: 'qr-3', label: 'Монитор', text: 'Нужен монитор 27" для офиса — что посоветуете?' },
  { id: 'qr-4', label: 'Звонок', text: 'Хочу заказать обратный звонок по заказу' },
];

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createWelcomeMessage() {
  return {
    id: createMessageId(),
    role: 'agent',
    text:
      'Здравствуйте! Я консультант iThech по компьютерной периферии: клавиатуры, мыши, мониторы, наушники и аксессуары. Подскажу с выбором и характеристиками. По другим вопросам звоните: +7 (800) 555-01-23.',
    createdAt: new Date().toISOString(),
  };
}
