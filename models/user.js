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

const User = mongoose.model("User",userSchema);
module.exports  = User;