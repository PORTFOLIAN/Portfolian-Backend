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

chatSchema.statics.createChat = async function(message_data){
    const messageContent = message_data.messageContent;
    const chatRoomId = message_data.chatRoomId;
    const senderId = message_data.sender;
    const receiverId = message_data.receiver;
    const messageType = message_data.messageType;

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

chatSchema.statics.createStartNotice = async function(chatRoomId, senderId, receiverId){
    let newChat = await new Chat(
        {
            chatRoomId : mongoose.Types.ObjectId(chatRoomId),
            messageContent : "대화가 시작되었습니다.",
            messageType : 'Notice',
            receiver : [mongoose.Types.ObjectId(senderId), mongoose.Types.ObjectId(receiverId)]
        }
      ).save();
    return newChat.id;
}

chatSchema.statics.readChat = async function(userId, chatRoomId){
    return await this.update(
		{ chatRoomId: mongoose.Types.ObjectId(chatRoomId) },
		{ $pull : { "receiver" : mongoose.Types.ObjectId(userId) }});
}

chatSchema.statics.getOldChatList = async function(chatRoomId, userId){
    return await this.aggregate([
        {
            $match:{
                chatRoomId : mongoose.Types.ObjectId(chatRoomId),
                receiver : { $nin : [mongoose.Types.ObjectId(userId)] }
            }
        },
        {
            $project: {
                chatRoomId :1,
                messageType : 1,
                sender : 1,
                messageContent : 1,
                date : "$createdAt" ,
                _id : 0
            }
        },
        { $sort : { date : 1 }}
    ]);
}

chatSchema.statics.getNewChatList = async function(chatRoomId, userId){
    return await this.aggregate([
        {
            $match:{
                chatRoomId : mongoose.Types.ObjectId(chatRoomId),
                receiver : { $in : [mongoose.Types.ObjectId(userId)] }
            }
        },
        {
            $project: {
                chatRoomId :1,
                messageType : 1,
                sender : 1,
                messageContent : 1,
                date : "$createdAt",
                _id : 0
            }
        },
        { $sort : { date : 1 }}
    ]);
}

const Chat = mongoose.model("Chat", chatSchema);
module.exports  = Chat;