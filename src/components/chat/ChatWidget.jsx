import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { ChatLauncher } from './ChatLauncher.jsx';
import { ChatWindow } from './ChatWindow.jsx';

export function ChatWidget({ openRequestToken = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const prevMessageCountRef = useRef(1);
  const { messages, isTyping, sendMessage, quickRepliesVisible } = useChat();

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const minimizeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (openRequestToken > 0) {
      openChat();
    }
  }, [openRequestToken, openChat]);

  useEffect(() => {
    if (isOpen) {
      prevMessageCountRef.current = messages.length;
      return;
    }
    if (messages.length > prevMessageCountRef.current) {
      const last = messages[messages.length - 1];
      if (last?.role === 'agent') {
        setUnreadCount((c) => c + 1);
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isOpen]);

  return (
    <div className="chat-widget">
      <ChatWindow
        open={isOpen}
        onMinimize={minimizeChat}
        onClose={closeChat}
        messages={messages}
        isTyping={isTyping}
        sendMessage={sendMessage}
        quickRepliesVisible={quickRepliesVisible}
      />
      {!isOpen && <ChatLauncher onClick={openChat} unreadCount={unreadCount} />}
    </div>
  );
}
