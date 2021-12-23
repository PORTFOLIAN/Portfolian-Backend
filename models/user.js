const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = mongoose.Schema(
	{
		nickName :  {
			type : String,
			maxlength: 20,
			default : "portfolian"
		},
		refreshToken:{
			type : String,
			default : ""
		},
		channel : String,
		email: {
			type: String,
			trim: true,
			default : ""
		},
		oauthId : {
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

userSchema.statics.createUser= async function(oauthId, coperation, refreshToken){
	let newUser = await new User(
		{
			oauthId : oauthId,
			channel : coperation,
			refreshToken : refreshToken
		}
	).save();
	return newUser.id;
}

userSchema.statics.findByNickName = async function (nickName) {
	return await this.findOne({nickName : nickName});
}

userSchema.statics.findUserById = async function (userId) {
	return await this.findOne({_id : mongoose.Types.ObjectId(userId)});
}

userSchema.statics.addDoingProject = async function (user, newProjectId){
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

userSchema.statics.changeNickName = async function (userId, nickName){
	await User.findOneAndUpdate(
		{_id : mongoose.Types.ObjectId(userId)},
		{
			$set: {
				'nickName': nickName
			}
		}
	);
}

userSchema.statics.findBookMarkProject = async function(userId){ //우선 NickName으로 찾음
	return await this.findOne(
		{nickName : userId}
		).populate(
		'bookMarkList', '_id article.leader article.title article.title article.stackList article.subjectDescription article.capacity \
		article.view  status'
	).select('bookMarkList').lean();
}

userSchema.statics.findUserIdByOauthId= async function(oauthId, coperation){
	return await this.findOne(
		{
			oauthId :  oauthId,
			channel: coperation
		}
	).select('id');
}

userSchema.statics.updateRefreshToken= async function(userId, refreshToken){
	await User.findByIdAndUpdate(
		{_id : userId},
		{
			$set : { refreshToken : refreshToken}
		}
	);
}

userSchema.statics.deleteRefreshToken= async function(userId){
	await User.findByIdAndUpdate(
		{_id : userId},
		{
			$set : { refreshToken : ""}
		}
	);
}

userSchema.statics.deleteUser= async function(userId){
	await User.findByIdAndDelete({_id : userId});
}
const User = mongoose.model("User",userSchema);
module.exports  = User;