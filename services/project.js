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
}
module.exports  = ProjectService;