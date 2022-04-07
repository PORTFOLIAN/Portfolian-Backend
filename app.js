require('dotenv').config();
const loaders = require('./loaders/index.js');
const socket = require('./socket/index.js');
const express = require('express');
const socketio = require('socket.io');
const app = express();
loaders(app);

// // prod mode
const https = require('https');
const fs = require('fs');
const hostName = "api.portfolian.site";
const options = {
    ca: fs.readFileSync('/etc/letsencrypt/live/' + hostName + '/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/' + hostName + '/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/' + hostName + '/cert.pem'),
};
const server = https.createServer(options, app).listen(443, () => {
    console.log('443:번 포트에서 대기중입니다.');
});

// // test mode
// const server = app.listen(3000, () => {
//     console.log('Start Server : localhost:3000');
// });

const whiteList = ['http://3.35.89.48:3000','http://localhost:3000','http://portfolian.site:3000','https://portfolian.site:443','https://portfolian.site','https://3.35.89.48'];
const io = socketio(server, { path: '/socket.io',  cors: { origin: whiteList } });
// io.on('connection',function(socket) {
//     console.log(`Connection : SocketId = ${socket.id}`);

//     socket.on('send', function(data) {

//         console.log('send message client to server');

//         const message_data = JSON.parse(JSON.stringify(data));
//         const messageContent = message_data.messageContent;
//         const roomId = message_data.roomId;

//         console.log(`roomId : ${roomId} message : ${messageContent}`);
//         io.emit('receive', { "messageContent" : messageContent })
//     });

//     socket.on('disconnect', function () {
//         console.log("One of sockets disconnected from our server.")
//     });
// })
io.on('connection',function(socket) {
    console.log(`Connection : SocketId = ${socket.id}`);

    socket.on('chat:send', function(data) {
        // 채팅 보내기
        const message_data = JSON.parse(JSON.stringify(data));
        const messageContent = message_data.messageContent;
        const roomId = message_data.roomId;
        const senderId = message_data.sender;

        // 저장하기 & 로그인한 유저면 socket으로 보내기
        console.log(`(send) roomId : ${roomId} message : ${messageContent}`);
        io.emit('chat:receive',  message_data );
    });

    socket.on('notice:enter', function(data) {
        // 채팅방 만들기
        console.log('send message client to server');

        const message_data = JSON.parse(JSON.stringify(data));
        const messageContent = message_data.messageContent;
        const roomId = message_data.roomId;

        console.log(`roomId : ${roomId} message : ${messageContent}`);
        io.emit('chat:receive', { "messageContent" : messageContent })
    });

    socket.on('notice:leave', function(data) {
        //채팅방 아예 나가기
        console.log('send message client to server');

        const message_data = JSON.parse(JSON.stringify(data));
        const messageContent = message_data.messageContent;
        const roomId = message_data.roomId;

        console.log(`roomId : ${roomId} message : ${messageContent}`);
        io.emit('chat:receive', { "messageContent" : messageContent })
    });

    socket.on('disconnect', function () {
        console.log("One of sockets disconnected from our server.")
    });
})

module.exports = app;
