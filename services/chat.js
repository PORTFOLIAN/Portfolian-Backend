const mongoose = require('mongoose');

class ChatService {

    constructor(UserModel, ProjectModel, ChatModel, ChatRoomModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
        this.ChatModel = ChatModel;
        this.ChatRoomModel = ChatRoomModel;
    }

    async isExistParticipant(participant) {
        let isExistParticipant = await this.UserModel.isExistUserById(participant);
        return isExistParticipant;
    }

    async isValidLeader(projectId, leader) {
        let isValidLeader = await this.ProjectModel.isExistProjectByIdAndLeaderId(projectId, leader);
        return isValidLeader;
    }

    async createChatRoom(userId, projectId, participant) {
        const { ObjectId } = mongoose.Types;

        if (!ObjectId.isValid(participant) || !(await this.isExistParticipant(participant)))
            return {code : -1, message : "userId가 잘못되었습니다."};
        if (!ObjectId.isValid(projectId) || !(await this.isValidLeader(projectId, participant)))
            return {code : -2, message : "porjectId가 잘못되었습니다."};
        
        let participantList = [mongoose.Types.ObjectId(userId), mongoose.Types.ObjectId(participant)];
        // 찾기
        let chatRoom = await this.ChatRoomModel.findChatRoomByProjectIdAndParticipant(projectId, participantList);
        if (chatRoom)
            return {code : 1, message : "이미 존재했던 chatRoomId입니다.", chatRoomId : chatRoom};

        let projectTitle = await this.ProjectModel.findProjectTitleById(projectId);
        chatRoom = await this.ChatRoomModel.createChatRoom(projectId, projectTitle, participantList);
        return {code : 1, message : "새로 생성된 chatRoomId입니다.", chatRoomId : chatRoom};
    }
}
module.exports = ChatService;