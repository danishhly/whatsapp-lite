import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { fetchHistory, sendMessageFallback, heartbeat } from "../api";

export default function useChat(currentUser, otherUser) {
  const stompClient = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);

  // Connect WebSocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = over(socket);

    stompClient.current.connect({}, () => {
      setConnected(true);

      // Subscribe to personal queue
      stompClient.current.subscribe(
        `/user/${currentUser}/queue/messages`,
        onMessageReceived
      );

      // Load chat history
      loadChatHistory();
    });

    return () => stompClient.current?.disconnect();
  }, [currentUser, otherUser]);

  // Heartbeat every 20s
  useEffect(() => {
    const interval = setInterval(() => heartbeat(currentUser), 20000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadChatHistory = async () => {
    const res = await fetchHistory(currentUser, otherUser);
    setMessages(res.data.reverse()); // chronological
  };

  const onMessageReceived = (msg) => {
    const message = JSON.parse(msg.body);

    // Mark delivered
    stompClient.current.send(
      "/app/chat.delivered",
      {},
      message.id
    );

    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = (text) => {
    const payload = {
      senderId: currentUser,
      receiverId: otherUser,
      content: text,
    };

    if (connected) {
      stompClient.current.send("/app/chat.send", {}, JSON.stringify(payload));
    } else {
      sendMessageFallback(payload);
    }
  };

  // Typing indicator
  const sendTyping = () => {
    if (!connected) return;
    stompClient.current.send(
      "/app/chat.typing",
      {},
      JSON.stringify({ from: currentUser, to: otherUser })
    );
  };

  return {
    messages,
    sendMessage,
    isTyping,
    sendTyping,
  };
}
