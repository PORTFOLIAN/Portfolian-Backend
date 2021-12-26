const jsonHandler = require("../utils/jsonHandle");

class ProjectService{

    constructor(UserModel, ProjectModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
    }

    async createProject(owner, articleDto, ownweStack){
        //project 생성 & team에 owner,ownweStack 넣기
        const newProject = await this.ProjectModel.createProject(owner, articleDto, ownweStack); 
        return newProject;
    }

    async modifyProjectArticle(owner,projectId, articleDto, ownerStack){
        this.ProjectModel.modifyProjectArticle(projectId, articleDto, ownerStack);
        return {code : 1, message : "project수정 완료"};
    }

    validateArticleContents(articleDto){
        if (!articleDto.title)
            return {code : -1, message : "title 정보를 입력해주세요."};
        else if (!articleDto.stackList)
            return {code : -2, message : "stackList 정보를 입력해주세요."};
        else if (articleDto.stackList.length == 0)
            return {code : -3, message : "stackList는 빈 배열이 될 수 없습니다."};
        else if (!articleDto.subjectDescription)
            return {code : -4, message : "subjectDescription 정보를 입력해주세요."};
        else if (!articleDto.projectTime)
            return {code : -5, message : "projectTime 정보를 입력해주세요."};
        else if (!articleDto.condition)
            return {code : -6, message : "condition 정보를 입력해주세요."};
        else if (!articleDto.progress)
            return {code : -7, message : "progress 정보를 입력해주세요."};
        else if (!articleDto.capacity)
            return {code : -8, message : "capacity 정보를 입력해주세요."};
        else if (articleDto.capacity <= 0)
            return {code : -9, message : "capacity는 0이상 정수로 입력해주세요."};
        return {code : 1, message : "validation 통과"};
    }

    async validateProjectOwner(projectId, owner)
    {

        if(projectId.length != 24)
            return {code : -12, message : "올바르지 않은 projectId입니다."};

        const modifyProject = await this.ProjectModel.findLeaderById(projectId);
        if (modifyProject == null || modifyProject.id != projectId)
            return {code : -10, message : "Project를 찾을 수 없습니다."};

        if (modifyProject.leader.id != owner.id)
            return {code : -11, message : "해당 project에 대한 권한이 없습니다."};

        return {code : 1, message : "project에 대한 유효성 검사 통과"};
    }

    async getAllArticles(){
        const ProjectList = await this.ProjectModel.getAllArticles();
        //console.log("ProjectList: ",ProjectList);
        let returnProjectList = await jsonHandler.getArticleListRes(ProjectList);
        returnProjectList['code'] = 1;
        return returnProjectList;
    }
    
    async getProjectArticle(project) {
        
        const readProject = await this.ProjectModel.getProjectAricle(project);
         function bookMarkChk() { 
            let bookMarkCheck
            if(readProject.article.bookMarkUserList == project) bookMarkCheck = true  //project 부분에 유저id가 들어가야함
            else bookMarkCheck = false
            return  bookMarkCheck
        }
        
        const contentInfo = {
        subjectDescription : readProject.article.subjectDescription,
        projectTime : readProject.article.projectTime,
        recruitmentCondition : readProject.article.condition,
        progress : readProject.article.progress,
        description : readProject.article.description,
        }
        const leaderInfo = {
        userId : readProject.leader._id,
        nickName : readProject.leader.nickName,
        description : readProject.leader.description,
        photo : readProject.leader.photo,
        stack : readProject.projectInfo.team[0].memberStack
        }
        const projectInfo = {
        code : 1,
        title  : readProject.article.title,
        projectId : readProject._id,
        stackList : readProject.article.stackList,
        contents : contentInfo,
        capacity : readProject.article.capacity,
        view : readProject.article.view,
        bookMark : bookMarkChk(),

        status : readProject.status,
        leader : leaderInfo,
        }
        

        return projectInfo;
        
    }


}
//북마크 체크함수

module.exports  = ProjectService;