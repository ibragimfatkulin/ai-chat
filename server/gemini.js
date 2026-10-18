import { GoogleGenerativeAI } from '@google/generative-ai';
import { AGENT_SYSTEM_INSTRUCTION } from './agentPrompt.js';

const DEFAULT_MODEL = 'gemini-3.8-flash';

function toGeminiRole(role) {
  return role === 'agent' ? 'model' : 'user';
}

export async function generateAgentReply(userMessage, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY не задан. Скопируйте .env.example в .env и укажите ключ.');
  }

  const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: AGENT_SYSTEM_INSTRUCTION,
  });

  let geminiHistory = history
    .filter((m) => m.text?.trim())
    .map((m) => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.text.trim() }],
    }));

  while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
    geminiHistory.shift();
  }

  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(userMessage.trim());
  const text = result.response.text();
  return text?.trim() || 'Не удалось сформировать ответ. Попробуйте переформулировать вопрос.';
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY не задан. Скопируйте .env.example в .env и укажите ключ.');
  }
  return new GoogleGenerativeAI(apiKey);
}

const AUDIO_MIME_MAP = {
  'audio/webm': 'audio/webm',
  'audio/webm;codecs=opus': 'audio/webm',
  'audio/ogg': 'audio/ogg',
  'audio/ogg;codecs=opus': 'audio/ogg',
  'audio/mp4': 'audio/mp4',
  'audio/mpeg': 'audio/mpeg',
  'audio/wav': 'audio/wav',
  'audio/x-wav': 'audio/wav',
};

export async function transcribeAudio(base64Data, mimeType = 'audio/webm') {
  const genAI = getClient();
  const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const model = genAI.getGenerativeModel({ model: modelName });
  const mime = AUDIO_MIME_MAP[mimeType] || 'audio/webm';

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mime,
        data: base64Data,
      },
    },
    {
      text:
        'Распознай речь на записи. Верни только расшифрованный текст на русском, без кавычек, без пояснений. Если речи нет — верни пустую строку.',
    },
  ]);

  return result.response.text()?.trim() ?? '';
}
