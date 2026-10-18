import { useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

export function ChatInput({ onSend, disabled, inputRef }) {
  const [value, setValue] = useState('');
  const { supported, isListening, isTranscribing, error, toggle, stop } = useSpeechRecognition({
    onResult: ({ transcript }) => {
      if (transcript) setValue(transcript);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    stop();
    onSend(value);
    setValue('');
  };

  const micBusy = isListening || isTranscribing;
  const micLabel = !supported
    ? 'Голосовой ввод недоступен в этом браузере'
    : isTranscribing
      ? 'Распознаём речь…'
      : isListening
        ? 'Остановить запись'
        : 'Голосовой ввод';

  const placeholder = isTranscribing
    ? 'Распознаём речь…'
    : isListening
      ? 'Говорите, затем нажмите микрофон ещё раз'
      : 'Напишите сообщение…';

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <button
        type="button"
        className={`chat-input__mic${micBusy ? ' chat-input__mic--active' : ''}`}
        onClick={toggle}
        disabled={disabled || !supported || isTranscribing}
        aria-pressed={isListening}
        aria-label={micLabel}
        title={micLabel}
      >
        {isListening ? (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="7" y="7" width="10" height="10" rx="2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
      <input
        ref={inputRef}
        type="text"
        className="chat-input__field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled || isTranscribing}
        autoComplete="off"
        aria-label="Сообщение"
      />
      <button
        type="submit"
        className="chat-input__send"
        disabled={disabled || isTranscribing || !value.trim()}
        aria-label="Отправить"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
      {error && (
        <p className="chat-input__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
