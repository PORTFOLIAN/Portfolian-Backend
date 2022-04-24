require('dotenv').config();
const loaders = require('./loaders/index.js');
const socket = require('./socket/index.js');
const express = require('express');
const socketio = require('socket.io');
const Chat = require('./models/chat');
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

// let redisConnect = async function(redisClient) {
//     await redisClient.connect();
// };
const redis = require('redis');
const redisClient = redis.createClient({
    host : "127.0.0.1",
    port : 6379
});
// redisConnect(redisClient);


const whiteList = ['http://3.35.89.48:3000','http://localhost:3000','http://portfolian.site:3000',
                'https://portfolian.site:443','https://portfolian.site','https://3.35.89.48'];
const io = socketio(server, { path: '/socket.io',  cors: { origin: whiteList } });

io.on('connection',async function(socket) {
    console.log(`Connection : SocketId = ${socket.id}`);
    io.emit('connection', {socketId : socket.id} ); 

    socket.on('auth', async function(data) {
        const auth_data = JSON.parse(JSON.stringify(data));
        const userId = auth_data.userId;
        console.log(`(auth) userId : ${userId} socket.id : ${socket.id}`);
        if (redisClient.exists(userId))
            redisClient.del(userId);
        redisClient.set(userId, socket.id);
        socket.userId = userId;
        let keys = await redisClient.keys();
        console.log("(auth) redisClient.keys() : " + keys);
    });

    socket.on('chat:send', async function(data) {
        // 채팅 보내기
        const message_data = JSON.parse(JSON.stringify(data));
        const messageContent = message_data.messageContent;
        const roomId = message_data.roomId;
        const senderId = message_data.sender;
        const receiverId = message_data.receiver;
        console.log(`(chat:send) roomId : ${roomId} message : ${messageContent}`);

        // 저장하기
        let chatId = await Chat.createChat(message_data);
        let keys = await redisClient.keys();
        console.log("(chat:send) redisClient.keys() : " + keys);
        // 로그인 유무 확인 후 socket으로 전송
        if (redisClient.exists(receiverId)) {
            // TODO : redisClient에서 socket.id받아와서 보내주도록 수정 필요
            console.log(`(chat:send) sender(${senderId}) is in here`);
            console.log(`(chat:send) receiver(${receiverId}) is in here`);
            io.emit('chat:receive',  message_data ); 
        }
        else
            console.log(`(chat:send) user is not in here`);
    });

    socket.on('chat:read', function(data) {
        const read_data = JSON.parse(JSON.stringify(data));
        const roomId = read_data.roomId;
        const userId = read_data.userId;
        console.log(`(chat:read) roomId : ${roomId} userId : ${userId}`);

        // 수정 필요
    });

    socket.on('disconnect', async function (socket) {
        const socketId = socket.id;
        const userId = socket.userId;
        redisClient.del(userId);
        let keys = await redisClient.keys();
        console.log("(disconnect) redisClient.keys() : " + keys);
        console.log(`(disconnect) userId : ${userId}`);
    });
})

module.exports = app;
