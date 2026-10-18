import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { generateAgentReply, transcribeAudio } from './gemini.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '8mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body ?? {};
    const trimmed = typeof message === 'string' ? message.trim() : '';

    if (!trimmed) {
      return res.status(400).json({ error: 'message_required', reply: 'Сообщение не может быть пустым.' });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'invalid_history' });
    }

    const safeHistory = history
      .slice(-20)
      .filter((m) => m && (m.role === 'user' || m.role === 'agent') && typeof m.text === 'string');

    const reply = await generateAgentReply(trimmed, safeHistory);
    return res.json({ reply });
  } catch (err) {
    console.error('[api/chat]', err);
    const message = err.message || 'Ошибка сервера';
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
    return res.status(status).json({
      error: 'chat_failed',
      reply: 'Сейчас не могу ответить. Проверьте ключ Gemini на сервере или попробуйте позже.',
      detail: process.env.NODE_ENV === 'development' ? message : undefined,
    });
  }
});

app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType } = req.body ?? {};
    if (typeof audio !== 'string' || !audio.trim()) {
      return res.status(400).json({ error: 'audio_required' });
    }

    const transcript = await transcribeAudio(audio.trim(), mimeType);
    if (!transcript) {
      return res.json({ transcript: '', error: 'empty_transcript' });
    }
    return res.json({ transcript });
  } catch (err) {
    console.error('[api/transcribe]', err);
    const message = err.message || 'Ошибка сервера';
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
    return res.status(status).json({
      error: 'transcribe_failed',
      detail: process.env.NODE_ENV === 'development' ? message : undefined,
    });
  }
});

app.listen(port, () => {
  console.log(`[server] http://localhost:${port} (Gemini: ${process.env.GEMINI_MODEL || 'gemini-3.8-flash'})`);
});
