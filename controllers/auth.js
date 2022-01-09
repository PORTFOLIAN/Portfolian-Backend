const AuthService = require('../services/auth');
const UserService = require("../services/user");
const User = require('../models/user');
const Project = require("../models/project");

const authServiceInstance = new AuthService(User);
const userServiceInstance = new UserService(User,Project);

let getAccessToken = async function (req,res){
    let userInfo = await authServiceInstance.getUserInfo(req.params.coperation, req.body.token);
    if(userInfo.code) {
        res.json(userInfo);
        return;
    }
    let tokens = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    res.json(tokens);
}

let getAccessToken_test = async function (req,res){
    let userInfo = req.body;
    let tokens = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    res.json(tokens);
}

let verifyJWT_test = async function(req,res){
    res.json(await authServiceInstance.verifyAccessToken(req.headers));
}

let refreshAccessToken = async function (req,res){
    let userId = req.body.userId;
    let refreshToken = req.body.refreshToken;
    if (!userId){
        res.json({code:-1, message : "userId를 입력해주세요."});
        return;
    }
    let newAccessToken = await authServiceInstance.refreshAccessToken(userId,refreshToken);
    res.json(newAccessToken);
}

let logout = async function (req,res){
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.json(verifyTokenRes);
        return;
    }
    if (verifyTokenRes.code == 0) {
        res.json({code: -98, message: "로그인 후 이용해주세요."});
        return;
    }
    let logoutRes = await userServiceInstance.deleteRefreshToken(verifyTokenRes.userId);
    res.json(logoutRes);
}

module.exports = {getAccessToken, getAccessToken_test, verifyJWT_test, refreshAccessToken, logout};