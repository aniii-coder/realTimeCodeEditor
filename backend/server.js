const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Ensure this matches your frontend URL
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Listen for 'code-change' event from frontend
  socket.on('code-change', (newCode) => {
    console.log('Received code change:', newCode);
    
    // Broadcast the code change to all connected clients, including the sender
    io.emit('code-change', newCode);  // Broadcast to all connected clients, including the sender
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
