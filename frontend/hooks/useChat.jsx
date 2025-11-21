import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { fetchHistory, sendMessageFallback, heartbeat } from "../api";

export default function useChat(currentUser, otherUser) {
    const stompClient = useRef(null);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const[connected, setConnected] = useState(false);
}

//Connect WebSocket
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