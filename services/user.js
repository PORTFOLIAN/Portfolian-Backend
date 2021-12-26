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
        console.log("bookMarks : ",bookMarks);
        let returnBookMark = await jsonHandler.getBookMarkListRes(bookMarks);
        returnBookMark['code'] = 1;
        return returnBookMark;
    };

    async getUserHeader(id){
        const userInfo = await this.UserModel.findById(id);
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
        const userInfo = await this.UserModel.findOne({_id : userId}).select('_id nickName description stackList photo github email').lean();
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
            const bookMarkOnUser = await this.UserModel.findOneAndUpdate({ _id: userId }, { $push: { bookMarkList: projectId } }).select('_id');
            result =  await this.ProjectModel.findOneAndUpdate({ _id: projectId }, { $inc: { "article.bookMarkCnt": 1} , $push : {"article.bookMarkUserList" : userId } });
            
        } else {
            const bookMarkOffUser = await this.UserModel.findOneAndUpdate({ _id: userId }, { $pull: { bookMarkList: projectId } }).select('_id');
            result =  await this.ProjectModel.findOneAndUpdate({ _id: projectId }, { $inc: { "article.bookMarkCnt": -1 }, $pull : {"article.bookMarkUserList" : userId } });
        }
        
        return result
    }
    
}
module.exports  = UserService;









