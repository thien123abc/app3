// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Định nghĩa các route nếu cần
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

// Xử lý kết nối WebSocket
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        io.emit('message', msg); // Gửi tin nhắn đến tất cả người dùng
    });

    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

// Lắng nghe trên cổng 3000
server.listen(3000, () => {
    console.log('Listening on *:3000');
});