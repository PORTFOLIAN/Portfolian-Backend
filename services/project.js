const jsonHandler = require("../utils/jsonHandle");

class ProjectService{

    constructor(UserModel, ProjectModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
    }

    validateArticleContents(articleDto){
        if (!articleDto.title)
            return {code : -51, message : "title 정보를 입력해주세요."};
        else if (!articleDto.stackList)
            return {code : -52, message : "stackList 정보를 입력해주세요."};
        else if (articleDto.stackList.length == 0)
            return {code : -53, message : "stackList는 빈 배열이 될 수 없습니다."};
        else if (!articleDto.subjectDescription)
            return {code : -54, message : "subjectDescription 정보를 입력해주세요."};
        else if (!articleDto.projectTime)
            return {code : -55, message : "projectTime 정보를 입력해주세요."};
        else if (!articleDto.condition)
            return {code : -56, message : "condition 정보를 입력해주세요."};
        else if (!articleDto.progress)
            return {code : -57, message : "progress 정보를 입력해주세요."};
        else if (!articleDto.capacity)
            return {code : -58, message : "capacity 정보를 입력해주세요."};
        else if (articleDto.capacity <= 0)
            return {code : -59, message : "capacity는 0이상 정수로 입력해주세요."};
        return {code : 1, message : "validation 통과"};
    }

    async createProject(owner, articleDto, ownweStack){
        let validateArticleInfo = this.validateArticleContents(articleDto);
        if (validateArticleInfo.code <= 0)
            return validateArticleInfo;

        //project 생성 & team에 owner,ownweStack 넣기
        const newProject = await this.ProjectModel.createProject(owner, articleDto, ownweStack); 
        return { code : 1, message: "성공적으로 수행되었습니다.",newProjectID : newProject};
    }

    async validateProjectOwner(projectId, owner)
    {

        if(projectId.length != 24)
            return {code : -12, message : "올바르지 않은 projectId입니다."};

        const modifyProject = await this.ProjectModel.findLeaderById(projectId);
        if ( !modifyProject || modifyProject.id != projectId)
            return {code : -10, message : "Project를 찾을 수 없습니다."};

        if (modifyProject.leader.id != owner.id)
            return {code : -11, message : "해당 project에 대한 권한이 없습니다."};

        return {code : 1, message : "project에 대한 유효성 검사 통과"};
    }

    async modifyProjectArticle(owner,projectId, articleDto, ownerStack){
        // 권한 유효성 검사
        let validateOwnerRes = await this.validateProjectOwner(projectId, owner);
        if (validateOwnerRes.code < 0)
            return validateOwnerRes;

        // 내용 유효성 검사
        let validateArticleInfo = this.validateArticleContents(articleDto);
        if (validateArticleInfo.code <= 0)
            return validateArticleInfo;

        this.ProjectModel.modifyProjectArticle(projectId, articleDto, ownerStack);
        return {code : 1, message : "project수정 완료"};
    }

    async getAllArticles(){
        const ProjectList = await this.ProjectModel.getAllArticles();
        //console.log("ProjectList: ",ProjectList);
        let returnProjectList = await jsonHandler.getArticleListRes(ProjectList);
        returnProjectList['code'] = 1;
        return returnProjectList;
    }
}
module.exports  = ProjectService;