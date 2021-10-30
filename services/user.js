
class UserService{

    constructor(UserModel, ProjectModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
    }

    async findUserByNickName(userNickName) {
        const findUser = await this.UserModel.findByNickName(userNickName);
        return findUser;
    };

    async addDoingProject(user, doingProject) {
        await this.UserModel.addDoingProject(user, doingProject);
    };

    async getBookMarkProjectList(userId) {
        return await this.UserModel.findBookMarkProject(userId);
    };

}
module.exports  = UserService;









