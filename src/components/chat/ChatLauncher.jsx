export function ChatLauncher({ onClick, unreadCount }) {
  return (
    <button
      type="button"
      className="chat-launcher"
      onClick={onClick}
      aria-label={unreadCount > 0 ? `Открыть чат, ${unreadCount} непрочитанных` : 'Открыть чат'}
    >
      <svg className="chat-launcher__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
        />
        <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
      </svg>
      {unreadCount > 0 && (
        <span className="chat-launcher__badge" aria-hidden>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
