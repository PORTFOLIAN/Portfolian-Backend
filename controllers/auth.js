const AuthService = require('../services/auth');
const UserService = require("../services/user");
const User = require('../models/user');
const Project = require("../models/project");

const authServiceInstance = new AuthService(User);
const userServiceInstance = new UserService(User,Project);

let getAccessToken = async function (req,res){
    let userInfo = await authServiceInstance.getUserInfo(req.params.coperation, req.body.token);
    if(userInfo.code) {
        // 실패
        res.json(userInfo);
        return;
    }
    let {refreshToken, tokenInfo} = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    res.cookie("REFRESH", refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14    // 2주
    }).json(tokenInfo);

}

let getAccessToken_apple = async function (req,res){
    console.log(`userId : ${req.body.userId}`);
    let {refreshToken, tokenInfo} = await authServiceInstance.getToekns(req.body.userId,"apple");
    res.cookie("REFRESH", refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14    // 2주
    }).json(tokenInfo);
}

let getAccessToken_test = async function (req,res){
    let userInfo = req.body;
    let tokens = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    let {refreshToken, tokenInfo} = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    res.cookie("REFRESH", refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14    // 2주
    }).json(tokenInfo);
}

let verifyJWT_test = async function(req,res){
    res.json(await authServiceInstance.verifyAccessToken(req.headers));
}

let refreshAccessToken = async function (req,res){
    let userId = req.body.userId;
    let refreshToken = req.cookies.REFRESH;

    if (!userId){
        res.json({code:-1, message : "userId를 입력해주세요."});
        return;
    }
    let newAccessToken = await authServiceInstance.refreshAccessToken(userId, refreshToken);
    res.json(newAccessToken);
}

let logout = async function (req,res){
    res.clearCookie('REFRESH');
    let logoutRes = await userServiceInstance.deleteRefreshToken(req.userId);
    res.json(logoutRes);
}

module.exports = {getAccessToken, getAccessToken_test, verifyJWT_test, refreshAccessToken, logout, getAccessToken_apple};