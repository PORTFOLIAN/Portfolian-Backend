const mongoose = require('mongoose');
const Schema = mongoose.Schema

const articleSchema = mongoose.Schema(
	{
		title : String, //모집 글 제목
		projectTime : String, //모집 기간
		condition: String, //모집 조건
		progress : String, //진행방식
		subjectDescription : String, //주제 설명
		description : { // 프로젝트 상세
			type : String,
			default : ""
		},
		photo : { //모집 글 사진
			type: String,
			default : ""
		},
		capacity: { type : Number},
		view : { 
			type: Number, 
			default: 0 
		},
		bookMarkCnt : {
			type: Number,
			default: 0
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
)

const projectInfoSchema = mongoose.Schema(
	{
		teamName : String,
		team : 
		{
			type : [({type: mongoose.Schema.Types.ObjectId, ref : "User"},String)],
			default : []
		},
		projectTitle : String,
		projectPhoto : {
			type :String,
			default: ""
		}, 
		github : {
			type: String,
			default : ""
		},
		description : {
			type : String, // 프로젝트 상세
			default : ""
		}
	}
)

const evaluationSchema = mongoose.Schema(
	{
		from : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
		to : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
		comment : String
	}
)

const projectSchema = mongoose.Schema(
	{
		leader: {type: mongoose.Schema.Types.ObjectId, ref : "User"},
		status : { 
			type: Number,
			default : 0
		},
		stackList : {
			type: [String],
			default : []
		},
		candidiate : {
			type: [{type: mongoose.Schema.Types.ObjectId, ref : "User"}], //지원자
			default : []
		},
		evaluationList : {
			type: [evaluationSchema],
			default : []
		},
		projectInfo : projectInfoSchema,
		article : articleSchema
	},
    {
        versionKey: false,
        timestamps: true
    }
)

const Project = mongoose.model("Project", projectSchema);
module.exports  = Project;
