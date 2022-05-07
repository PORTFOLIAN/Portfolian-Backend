const express = require('express');
const router = express.Router();
const { validateAccessToken } = require('../middlewares/validateAccessToken');
const User = require('../models/user');
const Project = require('../models/project');
const Chat = require('../models/chat');
const ChatRoom = require('../models/chatRoom');
const ChatService = require('../services/chat');
    /*
    채팅에 관련된 Router를 정의한다.

    # GET  /chats              : 나의 채팅방 목록 조회
    # GET  /chats/:chatRoomId  : chatRoomId 내 채팅 메세지 조회
    # POST /chats              : 채팅방 만들기
    # PUT  /chats/:chatRoomId  : 채팅방 나가기
    */


 //나의 채팅방 목록 조회
 router.get('/', validateAccessToken, async (req, res, next) => {
    let chatServiceInstance = new ChatService(User, Project, Chat, ChatRoom);
    let user = req.user;

    const chatRoomList = await chatServiceInstance.getChatRoomList(user);
    res.status(200).json({code : 1, message : "조회에 성공했습니다.", chatRoomList : chatRoomList});
 });

//채팅 메세지 조회
router.get('/:chatRoomId', validateAccessToken, async (req, res, next) => {
    let chatServiceInstance = new ChatService(User, Project, Chat, ChatRoom);
    let chatRoomId = req.params.chatRoomId;
    let user = req.user;

    const chatList = await chatServiceInstance.getChatList(chatRoomId, user);
    res.status(200).json({code : 1, message : "조회에 성공했습니다.", chatList : chatList});
 });

//채팅방 만들기
router.post('/', validateAccessToken, async (req, res, next) => {
    let chatServiceInstance = new ChatService(User, Project, Chat, ChatRoom);
    let user = req.user;
    let projectId = req.body.projectId;
    let participant = req.body.userId;

    const roomId = await chatServiceInstance.createChatRoom(user, projectId, participant);
    res.status(200).json(roomId);
});

//채팅방 나가기
router.put('/:chatRoomId', validateAccessToken, async (req, res, next) => {
    let chatServiceInstance = new ChatService(User, Project, Chat, ChatRoom);
    let user = req.user;
    let chatRoomId = req.params.chatRoomId;

    const leaveRes = await chatServiceInstance.leaveChatRoom(user, chatRoomId);
    res.status(200).json(leaveRes);
});

//채팅방 나가기
router.post('/:chatRoomId/test', validateAccessToken, async (req, res, next) => {
    let message_data = {};
    message_data.messageContent = req.body.message;
    message_data.roomId = req.params.chatRoomId;
    message_data.sender = req.user._id;
    message_data.receiver = req.body.receiver;

    console.log(`chatRoomId : ${message_data.roomId}, senderId : ${message_data.sender}, receiverId: ${message_data.receiver}`);
    await Chat.createChat(message_data);
    //const leaveRes = await chatServiceInstance.leaveChatRoom(user, chatRoomId);
    res.status(200).json({"hi" : "hi"});
});

module.exports = router;