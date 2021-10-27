const mongoose = require('mongoose');
const Schema = mongoose.Schema

// const userSchema = Schema(
//     {
//         // userId의 필요성이 있을까 => 빼도 됨
//         userId : String,
//         nickName :  {
//             type : String,
//             maxlength: 20,
//         },
//         channel : String,
//         email: {
//             type: String,
//             trim: true,
//         },
//         description : String,
//         photo : String,
//         stackList : [String], // 논의 필요
//         github : String,
//         doingProjectList : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
//         doneProjectList : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
//         applyProjectList : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
//         bookMarkList : [{type: mongoose.Schema.Types.ObjectId, ref : "Project"}],
//     }
//     ,
// 	{ timestamps: true }
// )
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
		timestamps: true
	}
);

const User = mongoose.model("User",userSchema);
module.exports  = User;