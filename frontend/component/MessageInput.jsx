import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        value={text}
        placeholder="Type a message..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button style={styles.button} onClick={send}>Send</button>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ddd",
    background: "white",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",