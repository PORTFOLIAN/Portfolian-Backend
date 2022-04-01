const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = mongoose.Schema(
    {
        projectId : {type: mongoose.Schema.Types.ObjectId, ref : "Project"},
        projectTitle : String,
        participant : {
            type: [{type: mongoose.Schema.Types.ObjectId, ref : "User"}],
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