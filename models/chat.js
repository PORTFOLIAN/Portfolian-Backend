const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatRoom = require("./chatRoom");
const User = require("./user");

const chatSchema = mongoose.Schema(
    {
        chatRoomId : {type: mongoose.Schema.Types.ObjectId, ref : "ChatRoom"},
        message : String,
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

const Chat = mongoose.model("Chat", chatSchema);
module.exports  = Chat;