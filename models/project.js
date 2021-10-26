import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
    {
        _id : {
            type: Number, 
            unique: true 
        },
        stackList : [String], //string(name)
        leader: user.id,
        capacity : Number,
        status : Number, //모집중, 모집완료, 프로젝트 종료
        view : Number,
        bookMarkCnt : Number,
        candidate :  [String], //<user.id>
        createdAt : timestamp,
        updatedAt : timestamp,
        evaluationList : { 
        from : userid,
        to : userid,
        Comment : String
    },
        projectInfo : {
        team : {
        userId : String,
        stack : String, // <{user.id, stack}>
        teamName : String,
        projectTitle : String,
        projectPhoto : String,
        github : String,
        projectDescriptionescription : String // 프로젝트 상세
        },
        recruitmentArticle : {
        articleTitle : String, //모집글 제목
        subjectDescription : String, //주제설명
        projectTime : String, //프로젝트 기간
        recruitmentCondition: String,//모집조건
        progress : String, //진행방식
        recruitmentDescription : String, //프로젝트 상세
        recruitmentPhoto : String
        },
    
    }
    
    });

const project = mongoose.model("project", projectSchema);

export { project };