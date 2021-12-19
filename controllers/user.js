const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require('../services/auth');

const userServiceInstance = new UserService(User,Project);
const authServiceInstance = new AuthService(User);
let findBookMarkList = async function (req,res){

    // 굳이 userId필요없을 것 같기도 하고 ~ ~

    //우선 NickName으로 찾음
    const bookMarkList = await userServiceInstance.getBookMarkProjectList(req.params.userId);
    //console.log(bookMarkList);
    res.json(bookMarkList);
}

let addUserForTest = async function (req,res){
    console.log(req.query.stack);
    const users = new User({
        nickName : req.params.userId,
        channel : 'kakao',
        email : 'testtesttest@gmail.com',
        stackList : req.query.stack, //stackList
        });
    
     users.save()
          .then ((result) => {
            res.send(result)
          })
          .catch((err)=>{
            console.log(err);
          });

}

let changeNickName = async function (req,res){

    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.json(verifyTokenRes);
        return;
    }
    let changeNickName = await userServiceInstance.changeNickName(req.params.userId, verifyTokenRes.userId, req.body.nickName);
    res.json(changeNickName);
}

module.exports = {findBookMarkList, addUserForTest, changeNickName};