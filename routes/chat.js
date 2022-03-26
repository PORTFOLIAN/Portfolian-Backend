const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const { validateAccessToken } = require('../middlewares/validateAccessToken');

// //나의 채팅방 목록 조회
// router.get('/', );

// //채팅 메세지 조회
// router.get('/:chatRoomId', authController.logout);

 //채팅방 만들기
 router.post('/', validateAccessToken, chatController.createChatRoom);



module.exports = router;