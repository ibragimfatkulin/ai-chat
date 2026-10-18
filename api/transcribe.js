import { transcribeAudio } from '../server/gemini.js';

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
    const { audio, mimeType } = req.body ?? {};
    if (typeof audio !== 'string' || !audio.trim()) {
      return res.status(400).json({ error: 'audio_required' });
    }

    const transcript = await transcribeAudio(audio.trim(), mimeType);
    if (!transcript) {
      return res.status(200).json({ transcript: '', error: 'empty_transcript' });
    }
    return res.status(200).json({ transcript });
  } catch (err) {
    console.error('[api/transcribe]', err);
    const message = err.message || 'Ошибка сервера';
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
    return res.status(status).json({ error: 'transcribe_failed' });
  }
}
