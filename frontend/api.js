import axios from "axios"

const API = axios.create ({
    baseURL: "http://localhost:8080",
});

// fetch chat history
export const fetchHistory = (a, b) =>
    API.get(`api/chat/history?a=${a}&b=${b}`);

// Send message via REST (fallback)
export const sendMessageFallback = (msg) =>
    API.post("/api/chat/send", msg);

// Heartbeat (presence)
export const heartbeat = (userId) =>
    API.post(`api/presence/heartbeat/${userId}`);