const User = require('../models/user');
const AuthService = require('../services/auth');

const authServiceInstance = new AuthService(User);

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
    if (userId === null){
        res.json({code:-1, message : "userId를 입력해주세요."});
        return;
    }
    let newAccessToken = await authServiceInstance.refreshAccessToken(userId,refreshToken);
    res.json(newAccessToken);
}

module.exports = {getAccessToken, getAccessToken_test, verifyJWT_test, refreshAccessToken};