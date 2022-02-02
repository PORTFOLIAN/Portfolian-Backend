const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require('../services/auth');

const userServiceInstance = new UserService(User,Project);
const authServiceInstance = new AuthService(User);

let findBookMarkList = async function (req,res){
    console.log("bookmark header : ", req.headers);
  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.status(403).json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }

  const bookMarkList = await userServiceInstance.getBookMarkProjectList(req.params.userId, verifyTokenRes.userId);
  res.json(bookMarkList);
}

let changeNickName = async function (req,res){

    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.status(403).json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }

    let changeNickName = await userServiceInstance.changeNickName(req.params.userId, verifyTokenRes.userId, req.body.nickName);
    res.json(changeNickName);
}

let deleteUser = async function (req,res){
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.status(403).json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }

    let deleteUserRes = await userServiceInstance.deleteUser(req.params.userId, verifyTokenRes.userId);
    res.json(deleteUserRes);
}

let getUserHeader = async (req, res) => {
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    const headerInfo = await userServiceInstance.getUserHeader(verifyTokenRes.userId);
    if (!headerInfo) {
        return res.status(403).json(verifyTokenRes);
    }
    res.status(200).json(headerInfo);
}

let changeUserInfo = async (req, res) => {
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.status(403).json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }
    let changeUserInfoRes = await userServiceInstance.changeUserInfo(req.params.userId, verifyTokenRes.userId, req.body, req.file.location);
    res.json(changeUserInfoRes);
}

let getUserInfo = async (req,res) => {
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.status(403).json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }
    try {
        const userInfo = await userServiceInstance.getUserInfo(verifyTokenRes.userId);
        if (!userInfo)
            return res.status(404).json('나의 정보보기 오류');
        res.status(200).json(userInfo);
    } catch (e) {
        res.status(500).json({ message: "회원정보 조회 실패" });
    }
}

let changeBookMark = async (req,res) => {
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.status(401).json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.status(403).json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }

    let bookMarked = req.body.bookMarked;
    let projectId = req.body.projectId;
    let changeBookMarkRes = await userServiceInstance.changeBookMark(req.params.userId, verifyTokenRes.userId, bookMarked, projectId);
    res.json(changeBookMarkRes);
}

module.exports = {findBookMarkList, getUserHeader, getUserInfo, changeBookMark, changeNickName, deleteUser,changeUserInfo };
