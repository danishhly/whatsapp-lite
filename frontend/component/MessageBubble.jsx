import React from "react";

export default function MessageBubble({ message, isMine }) {
  return (
    <div
      style={{
        textAlign: isMine ? "right" : "left",
        marginBottom: 8,
      }}
    ></div>