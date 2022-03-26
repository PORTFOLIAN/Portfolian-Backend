const User = require('../models/user');
const Chat = require('../models/chat');
const ChatRoom = require('../models/chatRoom');
const ChatService = require('../services/chat');

const  chatServiceInstance = new ChatService(User, Chat, ChatRoom);

let createChatRoom = async function(req, res) {
    
    res.json({"res" : "hihi"});
}

module.exports = { createChatRoom };