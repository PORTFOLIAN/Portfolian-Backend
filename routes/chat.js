const express = require('express');
const router = express.Router();

// middleware
const { validateAccessToken } = require('../middlewares/validateAccessToken');

// models & service
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

    const roomId = await chatServiceInstance.createChatRoom(user, req.userId,  projectId, participant);
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

module.exports = router;