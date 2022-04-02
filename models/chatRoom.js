const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = mongoose.Schema(
    {
        projectId : {type: mongoose.Schema.Types.ObjectId, ref : "Project"},
        projectTitle : String,
        participantList : {
            type: [{
                userId : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
                enter : Boolean
            }],
			default : [],
            _id : false
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
	return await this.findOne(
        {
            projectId : mongoose.Types.ObjectId(projectId),
            participantList: { $all : participantList }
        }).select('_id')
}

chatRoomSchema.statics.createChatRoom = async function(projectId, projectTitle){
    let newChatRoom = await new ChatRoom(
        {
            projectId : mongoose.Types.ObjectId(projectId),
            projectTitle : projectTitle
        }
      ).save();
    return newChatRoom.id;
}

chatRoomSchema.statics.enterChatRoom = async function(chatRoomId, userId){
    return await this.findOneAndUpdate(
		{ _id: chatRoomId },
		{
		$push : { 
            participantList : 
                {
                userId : mongoose.Types.ObjectId(userId),
                enter : true 
                }
            }

        });
}

chatRoomSchema.statics.isInChatRoom = async function (userId, chatRoomId) {
	return await this.exists({            
        _id: chatRoomId,
        participantList: { $in : [{userId : userId, enter: true}] }
    });
}

//참고 : https://www.mongodb.com/docs/manual/reference/operator/update/positional/
chatRoomSchema.statics.leaveChatRoom = async function (chatRoomId, user) {
    return await this.findOneAndUpdate(
		{ 
            _id: chatRoomId,
            'participantList.userId': user   
        },{
		    $set : { 'participantList.$.enter' : false }
		});
}


chatRoomSchema.statics.getChatRoomList = async function (user) {
    return await this.aggregate([
        {
            $match : {
                'participantList.userId': user,
                'participantList.enter': true
            }
        },
        {
            $project : {
                _id : 0,
                chatRoomId : "$_id",
                projectTitle : "$projectTitle",
                newChatCnt : {$literal: 100},
                newChatContent : "안녕하세요~!",
                newChatDate : "$createdAt"
            }
        },

    ])
}


const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports  = ChatRoom;