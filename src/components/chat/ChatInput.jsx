import { useState } from 'react';

export function ChatInput({ onSend, disabled, inputRef }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="chat-input__field"
        placeholder="Напишите сообщение…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        aria-label="Сообщение"
      />
      <button
        type="submit"
        className="chat-input__send"
        disabled={disabled || !value.trim()}
        aria-label="Отправить"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
}
