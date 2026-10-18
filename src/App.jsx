import { useState } from 'react';
import { ChatWidget } from './components/chat/ChatWidget.jsx';
import { DemoLanding } from './pages/DemoLanding.jsx';

export default function App() {
  const [openRequestToken, setOpenRequestToken] = useState(0);

  const handleOpenChat = () => {
    setOpenRequestToken((t) => t + 1);
  };

  return (
    <>
      <DemoLanding onOpenChat={handleOpenChat} />
      <ChatWidget openRequestToken={openRequestToken} />
    </>
  );
}
