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
        let validateArticleInfo = this.validateArticleContents(articleDto);
        if (validateArticleInfo.code <= 0)
            return validateArticleInfo;

        //project 생성 & team에 owner,ownweStack 넣기
        const newProject = await this.ProjectModel.createProject(owner, articleDto, ownweStack); 
        return { code : 1, message: "성공적으로 수행되었습니다.",newProjectID : newProject};
    }

    async deleteProject(owner, projectId) {
        // 권한 유효성 검사
        let validateOwnerRes = await this.validateProjectOwner(projectId, owner);
        if (validateOwnerRes.code < 0)
            return validateOwnerRes;

        let findProject = await this.ProjectModel.findDeleteInfoByArticleId(projectId);
        console.log('findProject : ',findProject);
        console.log('status : ',findProject.status);
        console.log('candidate : ',findProject.candidate);
        console.log('projectInfo : ',findProject.projectInfo);
        console.log('article : ',findProject.article);
       // let {status, candidate, projectInfo, article} = await this.ProjectModel.findDeleteInfoByArticleId(projectId);

        // console.log('status : ',status);
        // console.log('candidate : ',candidate);
        // console.log('projectInfo : ',projectInfo);
        // console.log('article : ',article);

        // 1. bookMark 삭제

        // 2. apply 삭제
        // 3. status확인 후 team의 doing, done에서 삭제
        // 4. project 삭제

        return {code : 1, message : "project 삭제 완료"};
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

    async getAllArticles(userId,query){
    // default(최신순) or bookMarkCnt or view
        let sort = query.sort;
        let keyword = query.keyword;
        let stack = query.stack;
        if (!sort || !keyword || !stack)
            return {code : -1, message: "조건(sort, keyword, stack)을 모두 입력해주세요"}
        if (sort === "default")
            sort = "createdAt"
        else if (sort === "view")
            sort = "article.view"
        else if (sort === "bookMark")
            sort = "article.bookMarkCnt"
        sort = "-" + sort;
        if (keyword === "default")
            keyword = ""
        const ProjectList = await this.ProjectModel.getAllArticles(userId,sort,keyword);
        let returnProjectList = await jsonHandler.getArticleListRes(ProjectList);
        returnProjectList['code'] = 1;
        return returnProjectList;
    }
    
    async getProjectArticle(projectId){
        if (!projectId) {
            return {code : -1, message : "URL을 확인해주세요.(projectId 없음)"};
        }
        const returnProjectArticle = await this.ProjectModel.getProjectAricle(projectId);

        //  function bookMarkChk() {
        //     let bookMarkCheck
        //     if(readProject.article.bookMarkUserList == project) bookMarkCheck = true  //project 부분에 유저id가 들어가야함
        //     else bookMarkCheck = false
        //     return  bookMarkCheck
        // }
        // const contentInfo = {
        // subjectDescription : readProject.article.subjectDescription,
        // projectTime : readProject.article.projectTime,
        // recruitmentCondition : readProject.article.condition,
        // progress : readProject.article.progress,
        // description : readProject.article.description,
        // }
        // const leaderInfo = {
        // userId : readProject.leader._id,
        // nickName : readProject.leader.nickName,
        // description : readProject.leader.description,
        // photo : readProject.leader.photo,
        // stack : readProject.projectInfo.team[0].memberStack
        // }
        // const projectInfo = {
        // code : 1,
        // title  : readProject.article.title,
        // projectId : readProject._id,
        // stackList : readProject.article.stackList,
        // contents : contentInfo,
        // capacity : readProject.article.capacity,
        // view : readProject.article.view,
        // bookMark : bookMarkChk(),
        //
        // status : readProject.status,
        // leader : leaderInfo,
        // }
        //

        return projectInfo;
        
    }


}
//북마크 체크함수

module.exports  = ProjectService;