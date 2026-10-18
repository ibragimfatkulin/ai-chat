import { useCallback, useEffect, useRef, useState } from 'react';

function pickRecorderMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const comma = dataUrl.indexOf(',');
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : '');
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать запись.'));
    reader.readAsDataURL(blob);
  });
}

export function useSpeechRecognition({ onResult } = {}) {
  const supported =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined';

  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const releaseMic = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const transcribe = useCallback(async (blob, mimeType) => {
    setIsTranscribing(true);
    try {
      const audio = await blobToBase64(blob);
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio, mimeType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError('Не удалось распознать речь. Проверьте сервер Gemini и попробуйте ещё раз.');
        return;
      }
      const transcript = data.transcript?.trim();
      if (!transcript) {
        setError('Речь не распознана. Говорите ближе к микрофону и повторите.');
        return;
      }
      onResultRef.current?.({ transcript, isFinal: true });
    } catch {
      setError('Не удалось связаться с сервером распознавания.');
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        releaseMic();
        setIsListening(false);
      }
      return;
    }
    releaseMic();
    setIsListening(false);
  }, [releaseMic]);

  const start = useCallback(async () => {
    if (!supported || isListening || isTranscribing) return;

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickRecorderMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setError('Ошибка записи микрофона.');
        releaseMic();
        setIsListening(false);
      };

      recorder.onstop = () => {
        const blobType = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: blobType });
        releaseMic();
        setIsListening(false);
        if (blob.size < 800) {
          setError('Запись слишком короткая. Удержите микрофон и скажите фразу.');
          return;
        }
        transcribe(blob, blobType);
      };

      recorder.start();
      setIsListening(true);
    } catch (err) {
      releaseMic();
      setIsListening(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setError('Нет доступа к микрофону. Разрешите его в браузере.');
      } else if (err?.name === 'NotFoundError') {
        setError('Микрофон не найден. Подключите устройство и повторите.');
      } else {
        setError('Не удалось включить микрофон.');
      }
    }
  }, [supported, isListening, isTranscribing, releaseMic, transcribe]);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { supported, isListening, isTranscribing, error, start, stop, toggle };
}
