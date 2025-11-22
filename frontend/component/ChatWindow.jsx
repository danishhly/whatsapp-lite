import React from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({ messages, me, onSend, isTyping }) {
  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.senderId === me}
          />
        ))}

        {isTyping && <p style={styles.typing}>Typing...</p>}
      </div>
          <MessageInput onSend={onSend} />
    </div>
  );
}