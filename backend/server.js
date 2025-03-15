const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow any origin for development
    methods: ["GET", "POST"],
  },
});

let code = ""; // Store the latest code
let language = "javascript"; // Store the latest language
let chatMessages = []; // Store chat history

io.on("connection", (socket) => {
  console.log(`🔵 A user connected: ${socket.id}`);

  // ✅ Send initial state (code, language, and chat history) when a new user joins
  socket.emit("init", { code, language, chatMessages });

  // ✅ Handle code changes
  socket.on("code-change", (newCode) => {
    console.log("📌 Code update received:", newCode);
    code = newCode;
    socket.broadcast.emit("code-change", newCode);
  });

  // ✅ Handle language changes
  socket.on("language-change", (newLanguage) => {
    console.log("🌐 Language update received:", newLanguage);
    language = newLanguage;
    io.emit("language-change", newLanguage);
  });

  // ✅ Handle chat messages
  socket.on("chat-message", (messageData) => {
    console.log("💬 Broadcasting message:", messageData);
    chatMessages.push(messageData); // Store chat message
    io.emit("chat-message", messageData); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
