const mongoose = require('mongoose');
const {postFCM} = require('../utils/fcm');

class ChatService {

    constructor(UserModel, ProjectModel, ChatModel, ChatRoomModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
        this.ChatModel = ChatModel;
        this.ChatRoomModel = ChatRoomModel;
    }

    // 채팅방 만들기
    async createChatRoom(user, userId, projectId, participant) {
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(participant) || !(await this.UserModel.isExistUserById(participant)))
            return {code : -1, message : "userId가 잘못되었습니다."};
        if (!ObjectId.isValid(projectId) || !(await this.ProjectModel.isExistProjectByIdAndLeaderId(projectId, participant)))
            return {code : -2, message : "porjectId가 잘못되었습니다."};
        
        let participantList = [{userId :mongoose.Types.ObjectId(user._id), enter : true}, {userId : mongoose.Types.ObjectId(participant), enter : true}];
        // 찾기
        let chatRoomId = await this.ChatRoomModel.findChatRoomByProjectIdAndParticipant(projectId, participantList);
        if (chatRoomId)
            return {code : 1, message : "이미 존재했던 chatRoomId입니다.", chatRoomId : chatRoomId._id};
        
        let projectTitle = await this.ProjectModel.findProjectTitleById(projectId);
        // 방생성
        chatRoomId = await this.ChatRoomModel.createChatRoom(projectId, projectTitle.article.title);
        await this.ChatRoomModel.enterChatRoom(chatRoomId, user._id);
        await this.ChatRoomModel.enterChatRoom(chatRoomId, participant);

        // 입장 메세지 저장 (Notice)
        let createMessage = "대화가 시작되었습니다."
        this.ChatModel.createNotice(chatRoomId, createMessage);
        // senderId, receiverId, messageContent
        postFCM(userId, participant, createMessage);
        return {code : 1, message : "새로 생성된 chatRoomId입니다.", chatRoomId : chatRoomId};
    }

    // 채팅방 나가기
    async leaveChatRoom(user, chatRoomId) {
        const { ObjectId } = mongoose.Types;
        if (!ObjectId.isValid(chatRoomId))
            return {code : -1, message : "잘못된 userId 또는 chatRoomId입니다."};
        if (!(await this.ChatRoomModel.isInChatRoom(user._id, chatRoomId)))
            return {code : -2, message : "채팅방에 참여하고 있지 않습니다."};
        await this.ChatRoomModel.leaveChatRoom(chatRoomId, user._id);
        let nicknameInfo = await this.UserModel.findNicknameById(user._id);
        let leaveMessage = nicknameInfo.nickName + "님이 나갔습니다.";
        await this.ChatModel.createNotice(chatRoomId, leaveMessage);
        let participantList = await this.ChatRoomModel.getChatParticipant(chatRoomId);
        let receiverId;
        for (let participant of participantList.participantList)
        {
            if (user._id !== participant.userId)
            {
                receiverId = participant.userId;
                break;
            }
        }
        postFCM(user._id, receiverId, leaveMessage);
        return {code : 1, message : "채팅방을 나갔습니다."};
    }

    // 나의 채팅방 목록 조회
    async getChatRoomList(user) {
        let userId = user._id;
        let chatRoomList = await this.ChatRoomModel.getChatRoomList(userId);
        for (const chatRoom of chatRoomList) {
            let chatRoomId = chatRoom.chatRoomId;
            let chatInfo = await this.ChatModel.getChatRoomInfo(chatRoomId);
            let newChatCnt = await this.ChatModel.getNewChatCnt(chatRoomId, userId);
            let chatCnt = 0;
            if(newChatCnt.length !== 0)
                chatCnt = newChatCnt[0].newChatCnt;
            chatRoom.newChatCnt = chatCnt;
            chatRoom.newChatContent = chatInfo[0].messageContent;
            chatRoom.newChatDate = chatInfo[0].date;
        }
        chatRoomList.sort(function(a,b) {	return new Date(b.newChatDate) - new Date(a.newChatDate)});
        return chatRoomList;
    }

    // 채팅 내역 조회
    async getChatList(chatRoomId, user) {
        let userId = user._id;
        let oldChatList = await this.ChatModel.getOldChatList(chatRoomId, userId);
        let newChatList = await this.ChatModel.getNewChatList(chatRoomId, userId);

        return { "oldChatList" : oldChatList, "newChatList" : newChatList };
    }

    // 채팅 보내기
    async createChat(message_data) {
        const messageContent = message_data.messageContent;
        const roomId = message_data.roomId;
        const senderId = message_data.sender;
        let chatRoomList = await this.ChatModel.createChat(roomId, messageContent, 'Chat', senderId);
        return chatRoomList;
    }
}
module.exports = ChatService;