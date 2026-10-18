export const COMPANY_PHONE = '+7 (800) 555-01-23';
export const COMPANY_PHONE_HOURS = 'Пн–Сб, 10:00–20:00 МСК';

export function offTopicRedirectMessage() {
  return `Я помогаю только с вопросами о товарах для компьютера и периферии в iThech. По другим темам лучше связаться с нашими специалистами: ${COMPANY_PHONE} (${COMPANY_PHONE_HOURS}).`;
}
