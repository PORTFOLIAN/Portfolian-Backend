const mongoose = require('mongoose');
const User = require("./user");
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
	).populate('projectInfo.team').select('status article.bookMarkUserList projectInfo')
}

projectSchema.statics.findLeaderById = async function(projectId){
	return await this.findOne(
		{ _id : mongoose.Types.ObjectId(projectId) }
		).populate(
			'leader','_id'
		);
}

projectSchema.statics.getAllArticles = async function(userId, sortKeyWord, keyword, stack){
	let allArticles = await this.aggregate([
		{
			$match : {
				"article.title" : { $regex : keyword } ,
				"article.stackList" : { $in : stack }
			}
		},
		{
			$lookup : {
				from : "users",
				localField : "leader",
				foreignField : "_id",
				as : "leader_info"
			}
		},
		{
			$unwind : {
				path : '$leader_info'
			}
		},
		{ $sort : sortKeyWord},
		{
			$project : {
				_id : 0,
				projectId : "$_id",
				title : "$article.title",
				stackList : "$article.stackList",
				description : "$article.subjectDescription",
				capacity : "$article.capacity",
				view : "$article.view",
				bookMark : {
					$cond : {
						if : {  $setIsSubset : [[ mongoose.Types.ObjectId(userId) ],'$article.bookMarkUserList']},
						then: true,
						else: false
					}
				},
				status : "$status",
				leader : {
					userId : "$leader_info._id",
					photo : "$leader_info.photo"
				}
			}
		}
	]);
	return {articleList : allArticles};
}

projectSchema.statics.incView = async function(projectId){
	return await this.findByIdAndUpdate(
		projectId, {$inc: { "article.view": 1}}
	);
}

projectSchema.statics.getProjectArticle = async function(projectId, userId){
	let articleInfo =  await this.aggregate([
		{ $match : { _id: mongoose.Types.ObjectId(projectId) } },
		{
			$lookup : {
				from : "users",
				localField : "leader",
				foreignField : "_id",
				as : "leader_info"
			}
		},
		{
			$unwind : {
				path : '$leader_info'
			}
		},
		{ $project : {
				_id : 0,
				projectId : '$_id',
				title : "$article.title",
				stackList : "$article.stackList",
				capacity : "$article.capacity",
				view : "$article.view",
				status : "$status",
				createdAt : "$createdAt",
				bookMark : {
					$cond : {
						if : { $setIsSubset : [[ mongoose.Types.ObjectId(userId) ],'$article.bookMarkUserList']},
						then: true,
						else: false
					}
				},
				contents : {
					subjectDescription : "$article.subjectDescription",
					projectTime : "$article.projectTime",
					recruitmentCondition : "$article.condition",
					progress : "$article.progress",
					description : "$article.description"
				},
				leader : {
					userId : "$leader_info._id",
					nickName : "$leader_info.nickName",
					description: "$leader_info.description",
					stack : { $first : "$projectInfo.team.memberStack"},
					photo : "$leader_info.photo"
				}
			}
		}
	]);
	console.log("articleInfo[0] : ",articleInfo[0]);
	return articleInfo[0];
}

projectSchema.statics.findBookMarkProject = async function(userId){
	let allArticles = await this.aggregate([
		{
			$match: {
				$expr : { $setIsSubset : [[ mongoose.Types.ObjectId(userId) ],'$article.bookMarkUserList'] }
			}
		},
		{
			$lookup : {
				from : "users",
				localField : "leader",
				foreignField : "_id",
				as : "leader_info"
			}
		},
		{
			$unwind : {
				path : '$leader_info'
			}
		},
		{ $sort : { "createdAt" : -1 }},
		{
			$project : {
				_id : 0,
				projectId : "$_id",
				title : "$article.title",
				stackList : "$article.stackList",
				description : "$article.subjectDescription",
				capacity : "$article.capacity",
				view : "$article.view",
				bookMark : { $literal: true },
				status : "$status",
				leader : {
					userId : "$leader_info._id",
					photo : "$leader_info.photo"
				}
			}
		}
	]);
	return {articleList : allArticles};
}

projectSchema.statics.pushUserBookMark = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: projectId },
		{
		$inc: { "article.bookMarkCnt" : 1},
		$push : { "article.bookMarkUserList" : mongoose.Types.ObjectId(userId) }
		});
}

projectSchema.statics.pullUserBookMark = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: projectId },
		{
		$inc: { "article.bookMarkCnt": -1 },
		$pull : { "article.bookMarkUserList" : mongoose.Types.ObjectId(userId) }
		});
}

projectSchema.statics.pullUserTeam = async function(userId,projectId){
	return await this.findOneAndUpdate(
		{ _id: projectId },
		{
			$pull : { "projectInfo.team" : { teamMember :mongoose.Types.ObjectId(userId)} }
		});
}

projectSchema.statics.checkBookMark = async function(userId,projectId){
	return await this.aggregate([
		{ $match : { _id: mongoose.Types.ObjectId(projectId)} },
		{
			$project : {
				bookMarked : {
					$cond : {
						if : {  $setIsSubset : [[ mongoose.Types.ObjectId(userId) ],'$article.bookMarkUserList']},
						then: true,
						else: false
					}
				}
			}
		}
	]);
}

projectSchema.statics.deleteProject = async function(projectId){
	return await this.findByIdAndDelete(projectId);
}

projectSchema.statics.getDeleteUserInfo = async function(userId){
	return await this.findById(userId).select('bookMarkList doingProjectList doneProjectList');
}

projectSchema.statics.getLeaderProject = async function(userId){
	return await this.find(
		{leader : mongoose.Types.ObjectId(userId) }
	).populate('projectInfo.team');
}
const Project = mongoose.model("Project", projectSchema);
module.exports  = Project;
