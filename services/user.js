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
        bookMarks['code'] = 1;
        bookMarks['message'] = "북마크한 프로젝트 보기 성공";
        return bookMarks;
    };

    async getUserHeader(userId){
        const userInfo = await this.UserModel.findUserHeaderById(userId);
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
        return userMyInfo;
    }

    async changeBookMark(userId, tokenUserId, bookMarked, projectId){
        /*
            북마크하고싶으면 true,
            북마크 취소하고싶으면 false
        */
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};

        let checkBookmarked = await this.ProjectModel.checkBookMark(userId, projectId);
        if (checkBookmarked.length === 0)
            return {code : -2, message : "해당 프로젝트를 찾을 수 없습니다."};

        if (checkBookmarked[0].bookMarked === false && bookMarked === true)
        {
            // 북마크 false => true로 변경
            await this.UserModel.pushProjectBookMark(userId, projectId);
            await this.ProjectModel.pushUserBookMark(userId,projectId);
        }
        else if (checkBookmarked[0].bookMarked === true && bookMarked === false)
        {
            // 북마크 true => false로 변경
            await this.UserModel.pullProjectBookMark(userId, projectId);
            await this.ProjectModel.pullUserBookMark(userId,projectId);
        }
        else {
            return {code : -1, message : "이미 반영되었습니다."};
        }
        return {code : 1, message : "북마크 수정 완료되었습니다."}
    }
    
    async changeNickName(userId, tokenUserId, nickName, fcmToken) {
        if (userId !== tokenUserId)
            return {code : -3, message : "잘못된 userId입니다."};
        await this.UserModel.changeNickName(userId, nickName, fcmToken);
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
        try {
            if (userId !== tokenUserId) {
                console.log("userId : ", userId);
                console.log("tokenUserId : ", tokenUserId);
                return {code: -3, message: "잘못된 userId입니다."};
            }
            let bookMarkProjects = await this.UserModel.findById(userId);

            // 북마크한 프로젝트 삭제, 카운트 감소
            for (const bookMarkProject of bookMarkProjects.bookMarkList)
                await this.ProjectModel.pullUserBookMark(userId,bookMarkProject);

            // leaderProject 프로젝트 삭제
            let leaderProjects = await this.ProjectModel.getLeaderProject(userId);
            for (const project of leaderProjects)
            {
                // status확인 후 team의 doing, done에서 삭제
                if (project.status != 3)  // doing project
                    for (const user of project.projectInfo.team)
                        await this.UserModel.pullDoingProject(user.teamMember, project.id);
                else
                    for (const user of project.projectInfo.team)
                        await this.UserModel.pullDoneProject(user.teamMember, project.id);
                //bookMark 삭제
                for (const user of project.article.bookMarkUserList)
                    await this.UserModel.pullProjectBookMark(user, project.id);
                // 프로젝트 삭제
                await this.ProjectModel.deleteProject(project.id);
            }

            await this.UserModel.deleteUser(userId);
            return {code: 1, message: "탈퇴 성공"};
        }catch (e) {
            console.log(e);
            return {code: -1, message: "탈퇴 실패"};
        }
    }
}
module.exports  = UserService;

