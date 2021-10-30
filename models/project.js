const mongoose = require('mongoose');
const Schema = mongoose.Schema

const articleSchema = mongoose.Schema(
	{
		title : String, //모집 글 제목
		projectTime : String, //모집 기간
		condition: String, //모집 조건
		progress : String, //진행방식
		subjectDescription : String, //주제 설명
		stackList : {
			type: [String],
			default : []
		},
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
		bookMarkUserList : {
			type : [{type: mongoose.Schema.Types.ObjectId, ref : "User"}],
			default : []
		}
		,
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
		projectTitle : String,
		team : 
		{
			type : [ 
				{ teamMember : {type: mongoose.Schema.Types.ObjectId, ref : "User"} , memberStack: String }
			],
			default : []
		},
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
        timestamps: true,
		toObject: { virtuals: true },
    	toJSON: { virtuals: true }
    }
)

// project create & team에 findUser추가(역할 설정)
projectSchema.statics.createProject = async function(owner, article, ownerStack){
	const newProject = new Project(
        {
          leader : owner,
          projectInfo : {
            teamName : article.title,
            projectTitle : article.title,
			team : [{teamMember : owner, memberStack : ownerStack}]
          },
          article : article
        }
      )
    await newProject.save();
	console.log('(in function)newProject.Id : ',newProject.id);
    return newProject.id;
}

const Project = mongoose.model("Project", projectSchema);
module.exports  = Project;
