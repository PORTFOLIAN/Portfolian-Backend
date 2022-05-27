const jsonHandler = require("../utils/jsonHandle");

class ProjectService{

    constructor(UserModel, ProjectModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
    }

    async validateProjectOwner(projectId, owner){

        if(projectId.length != 24)
            return {code : -12, message : "올바르지 않은 projectId입니다."};

        const modifyProject = await this.ProjectModel.findLeaderById(projectId);
        if ( !modifyProject || modifyProject.id != projectId)
            return {code : -10, message : "Project를 찾을 수 없습니다."};

        if (modifyProject.leader.id != owner.id)
            return {code : -11, message : "해당 project에 대한 권한이 없습니다."};

        return {code : 1, message : "project에 대한 유효성 검사 통과"};
    }

    async createProject(owner, articleDto, ownweStack){

        //project 생성 & team에 owner,ownweStack 넣기
        const newProject = await this.ProjectModel.createProject(owner, articleDto, ownweStack); 
        return { code : 1, message: "성공적으로 수행되었습니다.",newProjectID : newProject};
    }

    async deleteProject(owner, projectId) {
        try {
            // 권한 유효성 검사
            let validateOwnerRes = await this.validateProjectOwner(projectId, owner);
            if (validateOwnerRes.code < 0)
                return validateOwnerRes;

            // 삭제할 프로젝트 찾기
            let findProject = await this.ProjectModel.findDeleteInfoByArticleId(projectId);

            // status확인 후 team의 doing, done에서 삭제
            if (findProject.status != 3)  // doing project
                for (const user of findProject.projectInfo.team)
                    await this.UserModel.pullDoingProject(user.teamMember, projectId);
            else
                for (const user of findProject.projectInfo.team)
                    await this.UserModel.pullDoneProject(user.teamMember, projectId);
            //bookMark 삭제
            for (const user of findProject.article.bookMarkUserList)
                await this.UserModel.pullProjectBookMark(user, projectId);
            // 프로젝트 삭제
            await this.ProjectModel.deleteProject(projectId);

            return {code: 1, message: "project 삭제 완료"};
        }catch (e) {
            return {code: -1, message: "DB 에러발생"};
        }
    }

    async modifyProjectArticle(owner, projectId, articleDto, ownerStack){
        // 권한 유효성 검사
        let validateOwnerRes = await this.validateProjectOwner(projectId, owner);
        if (validateOwnerRes.code < 0)
            return validateOwnerRes;

        this.ProjectModel.modifyProjectArticle(projectId, articleDto, ownerStack);
        return {code : 1, message : "project수정 완료"};
    }

    async modifyProjectStatus(owner, projectId, status){
        let validateOwnerRes = await this.validateProjectOwner(projectId, owner);
        if (validateOwnerRes.code < 0)
            return validateOwnerRes;
        if (status !== 0 && status !== 1)
            return {code : -1, message : "올바른 status를 입력해주세요."};
        this.ProjectModel.modifyProjectStatus(projectId, status);
        return {code : 1, message : "project 상태 수정 완료"};
    }

    async getAllArticles(userId, sortKeyWord, keyword, stack){
        if (sortKeyWord === "default")
            sortKeyWord = { "createdAt" : -1 }
        else if (sortKeyWord === "bookMark")
            sortKeyWord = { "article.bookMarkCnt" : -1 }
        else if (sortKeyWord === "view")
            sortKeyWord = { "article.view" : -1 }

        if (keyword === "default")
            keyword = ""

        if (stack === "default")
            stack = ["frontEnd","backEnd","react","vue","spring","django","javascript","ios","android",
            "angular","htmlCss","flask","nodeJs","java","python","kotlin","swift","go","cCpp","cCsharp",
            "design","figma","sketch","adobeXD","photoshop","illustrator","firebase","aws","gcp","git","ect"]
        else if (!Array.isArray(stack))
            stack = [stack];

        const returnProjectList = await this.ProjectModel.getAllArticles(userId, sortKeyWord, keyword, stack);

        return returnProjectList;
    }

    async getProjectArticle(projectId, userId) {
        const readProject = await this.ProjectModel.getProjectArticle(projectId, userId);
        await this.ProjectModel.incView(projectId);
        return readProject;
    }

}

module.exports  = ProjectService;