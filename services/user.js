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
        let returnBookMark = await jsonHandler.getBookMarkListRes(bookMarks.bookMarkList);
        returnBookMark['code'] = 1;
        return returnBookMark;
    };

    async getUserHeader(id){
        const userInfo = await this.UserModel.findUserHeader(id);
        const user = {
        name : userInfo.nickName,
        profile : userInfo.photo
        } 
        const headerInfo = {
        user : user
        }
    return headerInfo;
    }

    async getUserInfo(userId) {
        const userInfo = await this.UserModel.findUserInfo(userId)
        const userMyInfo= { 
            userId : userId,
            nickName : userInfo.nickName,
            description : userInfo.description,
            stackList : userInfo.stackList,
            photo : userInfo.photo,
            github : userInfo.github,
            mail : userInfo.email
        }
        console.log(userMyInfo)


        return userMyInfo;
    }

    async changeBookMark(userId,bookMarkCnt,projectId){
        let result;
        
        if (bookMarkCnt == 'true'){
            const bookMarkOnUser = await this.UserModel.changeBookMarkOn(userId,projectId)
            result =  await this.ProjectModel.changeBookMarkOn(userId,projectId)
            
            console.log(bookMarkOnUser)
        } else {
            const bookMarkOffUser = await this.UserModel.changeBookMarkOff(userId,projectId)
            result =  await this.ProjectModel.changeBookMarkOff(userId,projectId)
        }
        
        return result
    }
    
    async changeNickName(userId, tokenUserId, nickName) {
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};
        await this.UserModel.changeNickName(userId, nickName);
        return {code : 1, message : "nickName이 변경되었습니다."}
    };

    async changeUserInfo(userId, tokenUserId, info, photo){
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};

        await this.UserModel.changeUserInfo(userId, info, photo);
        return {code : 1, message : "사용자 정보가 변경되었습니다."}
    }

    async deleteRefreshToken(userId){
        await this.UserModel.deleteRefreshToken(userId);
        return {code: 1, message : "로그아웃 성공"};
    }

    async deleteUser(userId, tokenUserId){
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};
        await this.UserModel.deleteUser(userId);
        return {code: 1, message : "탈퇴 성공"};
    }
}
module.exports  = UserService;









