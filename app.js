require('dotenv').config();
const loaders = require('./loaders/index.js');
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
io.on('connection',function(socket) {
    console.log(`Connection : SocketId = ${socket.id}`);

    socket.on('send', function(data) {

        console.log('send message client to server');

        const message_data = JSON.parse(JSON.stringify(data));
        const messageContent = message_data.messageContent;
        const roomId = message_data.roomId;

        console.log(`roomId : ${roomId} message : ${messageContent}`);
        io.emit('receive', { "messageContent" : messageContent })
    });

    socket.on('disconnect', function () {
        console.log("One of sockets disconnected from our server.")
    });
})

module.exports = app;
