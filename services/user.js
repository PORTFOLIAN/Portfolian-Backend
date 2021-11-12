const jsonHandler = require('../utils/jsonHandle');

class UserService{

    constructor(UserModel, ProjectModel) {
        this.UserModel = UserModel;
        this.ProjectModel = ProjectModel;
    }

    async findUserByNickName(userNickName) {
        const findUser = await this.UserModel.findByNickName(userNickName);
        return findUser;
    };

    async addDoingProject(user, doingProjectId) {
        await this.UserModel.addDoingProject(user, doingProjectId);
    };

    async getBookMarkProjectList(userId) {
        let bookMarks = await this.UserModel.findBookMarkProject(userId)
        let returnBookMark = await jsonHandler.changeStruct(bookMarks);
        returnBookMark['code'] = 1;
        return returnBookMark;
    };

}
module.exports  = UserService;









