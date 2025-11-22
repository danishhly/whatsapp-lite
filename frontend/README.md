# WhatsApp Lite 📱

A high-performance full-stack chat application designed to study scalable system architecture. This project replicates core WhatsApp features using a hybrid WebSocket + REST approach with a "Store and Forward" messaging mechanism.

## 🚀 Tech Stack

**Backend:**
* **Java Spring Boot:** Core application server.
* **WebSockets (STOMP):** Real-time bidirectional communication.
* **Redis:** Pub/Sub for cross-server message broadcasting and User Presence (Online Status).
* **MongoDB:** Persistent storage for chat history and messages.

**Frontend:**
* **React.js:** Component-based UI.
* **SockJS & StompJS:** Robust WebSocket clients with HTTP fallback.
* **Axios:** REST API communication.

**Infrastructure:**
* **Docker Compose:** Containerization for MongoDB and Redis.

---

## ⚡ Features implemented

1.  **Real-time Messaging:** Instant message delivery using WebSockets.
2.  **Hybrid Architecture:** Automatically falls back to HTTP REST if WebSockets fail (Resilience).
3.  **Store & Forward:** Messages are saved to MongoDB before delivery to ensure no data loss.
4.  **Message Acknowledgments:**
    * ✔ Sent (Single Tick) - Server received it.
    * ✔✔ Delivered (Double Tick) - Recipient received it.
5.  **User Presence:** Real-time "Online" status using a Heartbeat mechanism (Redis TTL).
6.  **Optimistic UI:** Messages appear instantly on the sender's screen before server confirmation.

---

## 🛠️ How to Run Locally

### 1. Start Infrastructure (Database & Cache)
Make sure you have Docker Desktop installed and running.
```bash
docker compose up -d

2. Start Backend (Spring Boot)
Open the project in IntelliJ IDEA.

Run the WhatsappLiteApplication class.

Server will start on http://localhost:8080.

3. Start Frontend (React)
Open a terminal in the frontend folder:

Bash

cd frontend
npm install
npm start

The app will open at http://localhost:3000.