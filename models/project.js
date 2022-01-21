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
		candidate : {
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
	let newProject = await new Project(
        {
          leader : owner,
          projectInfo : {
            teamName : article.title,
            projectTitle : article.title,
			team : [{teamMember : owner, memberStack : ownerStack}]
          },
          article : article
        }
      ).save();
    return newProject.id;
}

projectSchema.statics.modifyProjectArticle = async function(projectId, articleDto, ownerStack){
	await this.findOneAndUpdate(
		{ _id : mongoose.Types.ObjectId(projectId) },
		{
			'article.title': articleDto.title,
			'article.stackList' : articleDto.stackList,
			'article.subjectDescription' : articleDto.subjectDescription,
			'article.projectTime' : articleDto.projectTime,
			'article.condition' : articleDto.condition,
			'article.progress' : articleDto.progress,
			'article.description' : articleDto.description,
			'article.capacity' : articleDto.capacity,
			'projectInfo.team.0.memberStack': ownerStack
		}
	);
}

projectSchema.statics.findByArticleId = async function(articleId){
	return await this.findOne(
		{ article : {  _id : mongoose.Types.ObjectId(articleId) }}
	);
}

projectSchema.statics.findDeleteInfoByArticleId = async function(projectId){
	return await this.findOne(
		{_id : mongoose.Types.ObjectId(projectId) }
	).populate('projectInfo','team').select('status article.bookMarkUserList projectInfo')
}

projectSchema.statics.findLeaderById = async function(projectId){
	return await this.findOne(
		{ _id : mongoose.Types.ObjectId(projectId) }
		).populate(
			'leader','_id'
		);
}

projectSchema.statics.getAllArticles = async function(userId,sort,keyword, stack){
	return await this.find(
		{"article.title": {$regex : keyword},
		"article.stackList" : {$in : stack}})
		.populate('leader','_id photo')
		.select(
		'_id  leader article.title article.stackList article.subjectDescription article.capacity \
		article.view  article.bookMarkCnt status createdAt'
	).sort(sort).lean();
}

projectSchema.statics.getProjectArticle = async function(project){
	return await this.findByIdAndUpdate(project,
		{ $inc : { "article.view" : 1 }},
		{ new : true }
	)
	.populate('leader' , '_id photo nickName description stackList')
	.select(' _id leader createdAt status article.title article.projectTime article.condition article.progress article.description article.capacity article.view article.bookMarkCnt article.stackList article.subjectDescription article.bookMarkUserList ')
	.populate('projectInfo')
	.lean();
}

projectSchema.statics.findBookMarkProject = async function(userId){
	return await this.find(
		{"article.bookMarkUserList" : {$in : [userId]}})
		.populate('leader' , '_id photo')
		.select(' _id leader article.title article.stackList article.subjectDescription article.capacity \
		article.view status createdAt')
		.lean();
}

projectSchema.statics.pushBookMark = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: projectId },
		{
		$inc: { "article.bookMarkCnt": 1},
		$push : {"article.bookMarkUserList" : userId } 
		});
}

projectSchema.statics.pullBookMark = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: projectId },
		{
		$inc: { "article.bookMarkCnt": -1 },
		$pull : { "article.bookMarkUserList" : userId }
		});
}

const Project = mongoose.model("Project", projectSchema);
module.exports  = Project;
