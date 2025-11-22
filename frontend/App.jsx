import React from "react";
import useChat from "./hooks/useChat";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const currentUser = "userA"; // Hard-coded for demo
  const otherUser = "userB";

  const { messages, sendMessage, isTyping, sendTyping } =
    useChat(currentUser, otherUser);
    return (
    <ChatWindow
      messages={messages}
      me={currentUser}
      onSend={sendMessage}
      isTyping={isTyping}
      onTyping={sendTyping}
    />
  );
}