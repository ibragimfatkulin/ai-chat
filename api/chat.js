import { generateAgentReply } from '../server/gemini.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const { message, history } = req.body ?? {};
    const trimmed = typeof message === 'string' ? message.trim() : '';

    if (!trimmed) {
      return res.status(400).json({
        error: 'message_required',
        reply: 'Сообщение не может быть пустым.',
      });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'invalid_history' });
    }

    const safeHistory = history
      .slice(-20)
      .filter((m) => m && (m.role === 'user' || m.role === 'agent') && typeof m.text === 'string');

    const reply = await generateAgentReply(trimmed, safeHistory);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[api/chat]', err);
    const message = err.message || 'Ошибка сервера';
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
    return res.status(status).json({
      error: 'chat_failed',
      reply: 'Сейчас не могу ответить. Проверьте ключ Gemini на сервере или попробуйте позже.',
    });
  }
}
