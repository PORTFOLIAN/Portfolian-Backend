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

    async modifyProjectArticle(owner,projectId, articleDto, ownweStack){
        
        //owner check

        let findPro = await this.ProjectModel.findByArticleId(projectId); 
        console.log(findPro);
        //this.ProjectModel.modifyProjectArticle(projectId, articleDto, ownweStack); 
        return findPro;
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
}
module.exports  = ProjectService;