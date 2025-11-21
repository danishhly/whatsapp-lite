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
