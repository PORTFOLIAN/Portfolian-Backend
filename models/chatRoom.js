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

chatRoomSchema.statics.findChatRoomByProjectIdAndParticipant = async function (projectId, participantList) {
	return await this.findOne({
        projectId : mongoose.Types.ObjectId(projectId),
        participant : participantList
    }).select('_id');
}

chatRoomSchema.statics.createChatRoom = async function(projectId, projectTitle, participantList){
    let newChatRoom = await new ChatRoom(
        {
            projectId : mongoose.Types.ObjectId(projectId),
            projectTitle : projectTitle,
            participant : participantList
        }
      ).save();
    return newChatRoom.id;
}

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports  = ChatRoom;