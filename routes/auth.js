const express = require('express');
const router = express.Router();

// middleware
const { validateAccessToken } = require('../middlewares/validateAccessToken');

// models & service
const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require("../services/auth");

/*
    인증/인가에 관련된 Router를 정의한다.

    # POST   /oauth/login/apple        : 소셜로그인 (애플)
    # POST   /oauth/:coperation/access : 소셜로그인 (카카오)
    # POST   /oauth/refresh            : accessToken 갱신
    # PATCH  /oauth/logout             : 로그아웃
    # POST   /oauth/:coperation/test   : (test) 소셜로그인
    # DELETE /oauth/verify/jwt/test    : (test) 유효성 검사
*/

// 소셜로그인 (애플)
router.post('/login/apple', async (req, res, next) => {
    const authServiceInstance = new AuthService(User);
    let userId = req.body.userId;
    let {refreshToken, tokenInfo} = await authServiceInstance.getToekns(userId, "apple");
    res.cookie("REFRESH", refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14    // 2주
    }).json(tokenInfo);
});

// 소셜로그인 (카카오, 구글)
router.post('/:coperation/access', async (req, res, next) => {
    const authServiceInstance = new AuthService(User);
    let userInfo = await authServiceInstance.getUserInfo(req.params.coperation, req.body.token);
    if(userInfo.code)
        return res.status(500).json(userInfo);
    let {refreshToken, tokenInfo} = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    res.cookie("REFRESH", refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14    // 2주
    }).json(tokenInfo);
});

// accessToken 갱신
router.post('/refresh', async (req, res, next) => {
    const authServiceInstance = new AuthService(User);
    let userId = req.body.userId;
    let refreshToken = req.cookies.REFRESH;
    if (!userId)
        return res.json({code:-1, message : "userId를 입력해주세요."});
    let newAccessToken = await authServiceInstance.refreshAccessToken(userId, refreshToken);
    res.status(200).json(newAccessToken);
});

// 로그아웃
router.patch('/logout', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    res.clearCookie('REFRESH');
    let logoutRes = await userServiceInstance.deleteRefreshToken(req.userId);
    res.status(200).json(logoutRes);
});

// (test) 소셜로그인
router.post('/:coperation/test', async (req, res, next) => {
    const authServiceInstance = new AuthService(User);
    let userInfo = req.body;
    let {refreshToken, tokenInfo} = await authServiceInstance.getToekns(userInfo.id,req.params.coperation);
    res.cookie("REFRESH", refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14    // 2주
    }).json(tokenInfo);
});

// (test) 유효성 검사
router.get('/verify/jwt/test', async (req, res, next) => {
    const authServiceInstance = new AuthService(User);
    res.status(200).json(await authServiceInstance.verifyAccessToken(req.headers));
});



module.exports = router;