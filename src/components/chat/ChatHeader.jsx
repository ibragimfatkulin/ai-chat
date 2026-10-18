import { mockAgent } from '../../mocks/agent.js';
import { ThemeToggle } from '../ThemeToggle.jsx';

export function ChatHeader({ onMinimize, onClose }) {
  return (
    <header className="chat-header">
      <div className="chat-header__info">
        <div className="chat-header__avatar" aria-hidden>
          {mockAgent.avatarInitials}
        </div>
        <div className="chat-header__meta">
          <span className="chat-header__name">{mockAgent.name}</span>
          <span className="chat-header__status">
            <span className="chat-header__status-dot" aria-hidden />
            {mockAgent.statusLabel}
          </span>
        </div>
      </div>
      <div className="chat-header__actions">
        <ThemeToggle className="chat-header__theme" />
        <button
          type="button"
          className="chat-header__icon-btn"
          onClick={onMinimize}
          aria-label="Свернуть чат"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          type="button"
          className="chat-header__icon-btn"
          onClick={onClose}
          aria-label="Закрыть чат"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
