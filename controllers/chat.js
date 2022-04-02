const User = require('../models/user');
const Project = require('../models/project');
const Chat = require('../models/chat');
const ChatRoom = require('../models/chatRoom');
const ChatService = require('../services/chat');

const  chatServiceInstance = new ChatService(User, Project, Chat, ChatRoom);

let createChatRoom = async function(req, res) {
    
    res.json({"res" : "hihi"});
}

let leaveChatRoom = async function(req, res) {
    let 
}

module.exports = { createChatRoom, leaveChatRoom };