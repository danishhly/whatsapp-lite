import React from "react";

export default function MessageBubble({ message, isMine }) {
  return (
    <div
      style={{
        textAlign: isMine ? "right" : "left",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: 10,
          background: isMine ? "#DCF8C6" : "white",
          maxWidth: "70%",
        }}
      >
        <p style={{ margin: 0 }}>{message.content}</p>
      </div>
    </div>
  );
}
