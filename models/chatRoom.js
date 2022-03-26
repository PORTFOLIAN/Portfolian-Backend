const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = mongoose.Schema(
    {
        participant : {
            type: [String],
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

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports  = ChatRoom;