const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema(
	{
		nickName :  {
			type : String,
			maxlength: 20,
			default : "기본닉네임"
		},
		channel : String,
		email: {
			type: String,
			trim: true,
			default : ""
		},
		id : {
			type: String
		},
		description : {
			type : String,
			default : ""
		},
		photo : {
			type : String,
			default : "기본 이미지 URL"

		},
		github : {
			type : String,
			default : ""
		},
		stackList : {
			type: [String],
			default : []
		},
		doingProjectList : {
			type : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
			default : []
		},
		doneProjectList : {
			type : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
			default : []
		},
		applyProjectList : {
			type : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
			default : []
		},
		bookMarkList : {
			type : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
			default : []
		},
  	},
	{
		versionKey: false,
		timestamps: true,
		toObject: { virtuals: true },
    	toJSON: { virtuals: true }
	}
);

userSchema.statics.findByNickName = async function (nickName) {
	return await this.findOne({nickName : nickName});
}

userSchema.statics.addDoingProject = async function (user, newProjectId){
	console.log('(in addDoing)newProject.Id : ',newProjectId);
	await User.findByIdAndUpdate(
		{_id : user._id},
		{
			$push : {
				doingProjectList : {
					_id : mongoose.Types.ObjectId(newProjectId)
				}
			}
		}
	);
	console.log(user);
}

userSchema.statics.findBookMarkProject = async function(userId){ //우선 NickName으로 찾음
	return await this.findOne(
		{nickName : userId}
		).populate(
		'bookMarkList', '_id article.leader article.title article.title article.stackList article.subjectDescription article.capacity \
		article.view  status'
	).select('bookMarkList').lean();
}


userSchema.statics.findUserInfo = async function(userId){ 
	return await this.findOne(
		{_id : userId}
		).select(
		'_id nickName description stackList photo github email'
		).lean();
}

userSchema.statics.findUserHeader = async function(id){ 
	return await this.findById(id);
}

userSchema.statics.changeBookMarkOn = async function(userId,projectId){ 
	return await this.findOneAndUpdate(
		{ _id: userId },
		{ $push: { bookMarkList: projectId } })
		.select('_id');
}

userSchema.statics.changeBookMarkOff = async function(userId,projectId){ 
	return await this.findOneAndUpdate(
		{ _id: userId },
		{ $pull: { bookMarkList: projectId }})
		.select('_id')
}


const User = mongoose.model("User",userSchema);
module.exports  = User;