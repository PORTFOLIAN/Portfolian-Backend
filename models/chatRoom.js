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

chatRoomSchema.statics.getChatRoomList = async function (userId) {
    return await this.aggregate([
        {
            $match : {
                participantList: { $in : [{userId : userId, enter: true}] }
            }
        },
        {                
            $project : {
                chatRoomId : "$_id",
                projectTitle : 1,
                user : {
                    $first : {
                        $filter : { 
                            input : "$participantList",
                            as : "participants",
                            cond : { $ne : ["$$participants.userId", userId]}
                        }
                    }
                },
                createdAt : 1
            }
        }
        ,{
            $lookup : {
                from : 'users',
                localField: 'user.userId',
                foreignField: '_id',
                as : 'user'
            }
        },
        { 
            $unwind : {
                path : '$user'
            } 
        }
        ,{
            $project : {
                _id : 0,
                chatRoomId : 1,
                projectTitle : 1,
                user : { 
                    userId : "$user._id",
                    photo : 1,
                    nickName : "$user.nickName"
                }
            }
        }
    ])
}

chatRoomSchema.statics.getChatParticipant = async function (chatRoomId) {
    return await this.findOne(
		{_id : chatRoomId}
		).select(
		'participantList'
		).lean();
}

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports  = ChatRoom;