const jsonHandler = require('../utils/jsonHandle');
const {getRefreshToken, getAccessToken} = require("../utils/jwt");

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
        console.log("bookMarks : ",bookMarks);
        let returnBookMark = await jsonHandler.getBookMarkListRes(bookMarks);
        returnBookMark['code'] = 1;
        return returnBookMark;
    };

    async changeNickName(userId, tokenUserId, nickName) {
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};
        await this.UserModel.changeNickName(userId, nickName);
        return {code : 1, message : "nickName이 변경되었습니다."}
    };

    async deleteRefreshToken(userId){
        await this.UserModel.deleteRefreshToken(userId);
        return {code: 1, message : "로그아웃 성공"};
    }

}
module.exports  = UserService;









