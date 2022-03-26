
class ChatService {

    constructor(UserModel, ChatModel, ChatRoomModel) {
        this.UserModel = UserModel;
        this.ChatModel = ChatModel;
        this.ChatRoomModel = ChatRoomModel;
    }

}
module.exports = ChatService;