// src/hooks/useChat.jsx
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchHistory, sendMessageFallback, heartbeat } from "../api";

export default function useChat(currentUser, otherUser) {
  const stompClientRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);

  // connect on mount / when users change
  useEffect(() => {
    // create STOMP client using SockJS transport
    const stompClient = new Client({
      // webSocketFactory called when client activates
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: (str) => {
        // comment out in production
        // console.log(str);
      },
      reconnectDelay: 5000, // auto reconnect
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
    });

    stompClient.onConnect = (frame) => {
      setConnected(true);
      // subscribe to personal queue
      stompClient.subscribe(`/user/${currentUser}/queue/messages`, (msg) => {
        if (!msg.body) return;
        try {
          const message = JSON.parse(msg.body);
          // send delivered ack
          if (stompClient && stompClient.connected) {
            stompClient.publish({
              destination: "/app/chat.delivered",
              body: message.id || "",
            });
          }
          setMessages((prev) => [...prev, message]);
        } catch (e) {
          console.error("Failed to parse incoming message", e);
        }
      });

      // load history after connect
      loadChatHistory();
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error", frame);
    };

    stompClient.onDisconnect = () => {
      setConnected(false);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      try {
        stompClient.deactivate();
      } catch (e) { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, otherUser]);

  // heartbeat every 20s (presence)
  useEffect(() => {
    const id = setInterval(() => {
      if (currentUser) heartbeat(currentUser).catch(() => {});
    }, 20000);
    return () => clearInterval(id);
  }, [currentUser]);

  const loadChatHistory = async () => {
    try {
      const res = await fetchHistory(currentUser, otherUser);
      setMessages(Array.isArray(res.data) ? res.data.reverse() : []);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const sendMessage = (text) => {
    const payload = {
      senderId: currentUser,
      receiverId: otherUser,
      content: text,
    };

    const stomp = stompClientRef.current;
    if (stomp && stomp.active && stomp.connected) {
      stomp.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(payload),
      });
    } else {
      sendMessageFallback(payload).catch((e) => console.error(e));
    }
  };

  const sendTyping = () => {
    const stomp = stompClientRef.current;
    if (!stomp || !stomp.connected) return;
    stomp.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({ from: currentUser, to: otherUser }),
    });
  };

  return {
    messages,
    sendMessage,
    isTyping,
    sendTyping,
    connected,
  };
}
