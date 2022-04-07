const mongoose = require('mongoose');

class ChatService {

    constructor(UserModel, ProjectModel, ChatModel, ChatRoomModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
        this.ChatModel = ChatModel;
        this.ChatRoomModel = ChatRoomModel;
    }

    //채팅방 만들기
    async createChatRoom(user, projectId, participant) {
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
        chatRoomId = await this.ChatRoomModel.createChatRoom(projectId, projectTitle.article.title);
        await this.ChatRoomModel.enterChatRoom(chatRoomId, user._id);
        await this.ChatRoomModel.enterChatRoom(chatRoomId, participant);
        return {code : 1, message : "새로 생성된 chatRoomId입니다.", chatRoomId : chatRoomId};
    }

    //채팅방 나가기
    async leaveChatRoom(user, chatRoomId) {
        const { ObjectId } = mongoose.Types;
        if (!ObjectId.isValid(chatRoomId))
            return {code : -1, message : "잘못된 userId 또는 chatRoomId입니다."};
        if (!(await this.ChatRoomModel.isInChatRoom(user._id, chatRoomId)))
            return {code : -2, message : "채팅방에 참여하고 있지 않습니다."};
        await this.ChatRoomModel.leaveChatRoom(chatRoomId, user._id);
        return {code : 1, message : "채팅방을 나갔습니다."};
    }

    //나의 채팅방 목록 조회
    async getChatRoomList(user) {
        let chatRoomList = await this.ChatRoomModel.getChatRoomList(user._id);
        return chatRoomList;
    }
}
module.exports = ChatService;