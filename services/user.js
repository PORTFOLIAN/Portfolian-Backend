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

    async getBookMarkProjectList(userId, tokenUserId) {
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};
        let bookMarks = await this.ProjectModel.findBookMarkProject(userId);
        console.log('return : ', bookMarks);
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

    async changeBookMark(userId, tokenUserId, bookMarked, projectId){
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};

        // 북마크 했는 지 안했는 지 유효성 검사
        //return {code : -1, message : "이미 반영되었습니다."}

        if (bookMarked == true)
        {
            //북마크 true => false 로 변경
            await this.UserModel.pullBookMark(userId, projectId);
            await this.ProjectModel.pullBookMark(userId,projectId);
        }
        else
        {
            //북마크 false => true로 변경
            await this.UserModel.pushBookMark(userId, projectId);
            await this.ProjectModel.pushBookMark(userId,projectId);
        }

        return {code : 1, message : "북마크 수정 완료되었습니다."}
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
        // 북마크한 프로젝트 삭제, 카운트 감소

        // doing, done 프로젝트 삭제
        // => 반장일 경우 프로젝트 삭제
        // => 반장 아니면 team에서 그 사람만 삭제


        await this.UserModel.deleteUser(userId);
        return {code: 1, message : "탈퇴 성공"};
    }
}
module.exports  = UserService;









