const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatRoom = require("./chatRoom");
const User = require("./user");

const chatSchema = mongoose.Schema(
    {
        chatRoomId : {type: mongoose.Schema.Types.ObjectId, ref : "ChatRoom"},
        messageContent : String,
        messageType : {
            type : String,
            enum : {
                values : ['Chat', 'Notice']
            }
        },
        sender : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
        receiver : {
			type : [{type: mongoose.Schema.Types.ObjectId, ref : "User"}],
			default : []
		}
    },
    {
		versionKey: false,
		timestamps: true,
        toObject: { virtuals: true },
    	toJSON: { virtuals: true }
	}
)

chatRoomSchema.statics.createChat = async function(message_data){
    const messageContent = message_data.messageContent;
    const chatRoomId = message_data.roomId;
    const senderId = message_data.sender;
    const receiverId = message_data.receiver;
    const messageType = 'Chat';

    let newChat = await new Chat(
        {
            chatRoomId : mongoose.Types.ObjectId(chatRoomId),
            messageContent : messageContent,
            messageType : messageType,
            sender : mongoose.Types.ObjectId(senderId),
            receiver : [mongoose.Types.ObjectId(receiverId)]
        }
      ).save();
    return newChat.id;
}

const Chat = mongoose.model("Chat", chatSchema);
module.exports  = Chat;