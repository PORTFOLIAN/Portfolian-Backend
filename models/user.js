const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = mongoose.Schema(
	{
		nickName :  {
			type : String,
			maxlength: 20,
			default : ""
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
			default : "https://media.vlpt.us/images/tlsrlgkrry/post/0f671da7-21ff-4dfc-b388-06950ed4a21d/127.0.0.1.PNG"

		},
		github : {
			type : String,
			default : ""
		},
		fcmToken : {
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

// create
userSchema.statics.createUser= async function(oauthId, coperation, refreshToken){
	const randomNum = Math.floor(Math.random() * 5) + 1;
	let defaultProfile = "https://portfolian-image.s3.ap-northeast-2.amazonaws.com/default-profile-"
								+ randomNum.toString() + ".png";
	let newUser = await new User(
		{
			oauthId : oauthId,
			channel : coperation,
			refreshToken : refreshToken,
			photo : defaultProfile
		}
	).save();
	return newUser.id;
}

// find
userSchema.statics.findByNickName = async function (nickName) {
	return await this.findOne({nickName : nickName});
}

userSchema.statics.findUserById = async function (userId) {
	return await this.findOne({_id : mongoose.Types.ObjectId(userId)});
}

userSchema.statics.findFCMTokenById = async function (userId) {
	return await this.findById(userId).select('fcmToken');
}

userSchema.statics.findUserInfo = async function(userId){ 
	return await this.findOne(
		{_id : userId}
		).select(
		'_id nickName description stackList photo github email'
		).lean();
}

userSchema.statics.findUserHeaderById = async function(id){ 
	return await this.findById(id);
}

userSchema.statics.findUserByOauthId= async function(oauthId, coperation){
	return await this.findOne(
		{
			oauthId :  oauthId,
			channel: coperation
		}
	).select('id nickName');
}

userSchema.statics.findUserMinInfoById= async function(userId){
	return await this.findById(userId).select('_id photo nickName');
}

userSchema.statics.findNicknameById= async function(userId){
	return await this.findById(userId).select('nickName');
}

userSchema.statics.isExistUserById = async function (userId) {
	return await this.exists({_id : userId});
}

// update
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
}

userSchema.statics.changeNickName = async function (userId, nickName, fcmToken){
	await User.findOneAndUpdate(
		{_id : mongoose.Types.ObjectId(userId)},
		{
			$set: {
				'nickName': nickName,
				'fcmToken' : fcmToken
			}
		}
	);
	
}

userSchema.statics.changeUserInfo = async function(userId, info){
	await User.findOneAndUpdate(
		{_id : mongoose.Types.ObjectId(userId)},
		{
			$set: {
				'nickName': info.nickName,
				'description' : info.description,
				'stackList' : info.stack,
				'github' : info.github,
				'email' : info.mail
			}
		}
	);
}

userSchema.statics.changeUserProfile = async function(userId, photoURL){
	let profileURL = photoURL;
	if (photoURL === "default")
	{
		const randomNum = Math.floor(Math.random() * 5) + 1;
		profileURL = "https://portfolian-image.s3.ap-northeast-2.amazonaws.com/default-profile-"
									+ randomNum.toString() + ".png";
	}
	await User.findOneAndUpdate(
		{_id : mongoose.Types.ObjectId(userId)},
		{
			$set: {
				'photo': profileURL
			}
		}
	);
}

userSchema.statics.pullProjectBookMark = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: userId },
		{ $pull: { bookMarkList: mongoose.Types.ObjectId(projectId) } });
}

userSchema.statics.pushProjectBookMark = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: userId },
		{ $push: { bookMarkList: mongoose.Types.ObjectId(projectId) }});
}

userSchema.statics.pullDoingProject = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: userId },
		{ $pull: { doingProjectList: mongoose.Types.ObjectId(projectId) } });
}

userSchema.statics.pullDoneProject = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: userId },
		{ $pull: { doneProjectList: mongoose.Types.ObjectId(projectId) } });
}

userSchema.statics.updateRefreshToken= async function(userId, refreshToken){
	await User.findByIdAndUpdate(
		{_id : userId},
		{
			$set : { refreshToken : refreshToken}
		}
	);
}

// delete
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