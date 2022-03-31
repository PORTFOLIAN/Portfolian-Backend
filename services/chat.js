
class ChatService {

    constructor(UserModel, ChatModel, ChatRoomModel) {
        this.UserModel = UserModel;
        this.ChatModel = ChatModel;
        this.ChatRoomModel = ChatRoomModel;
    }

    async isValidParticipantList(participantList) {
        try{
            for (const participant of participantList) {
                let isValidParticipant = await this.UserModel.isExistUserById(participant);
                if (isValidParticipant === false)
                    return false;
            }
        }catch(e){
            return false;
        }
        return true;
    }

    async createChatRoom(userId, participantList){


    }

}
module.exports = ChatService;