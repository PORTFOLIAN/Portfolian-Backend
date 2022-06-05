const express = require('express');
const router = express.Router();

// middleware
const upload = require("../S3/S3.js");
const { validateAccessToken } = require('../middlewares/validateAccessToken');
const { validateUserInfo } = require('../middlewares/validateUserInfo');

// models & service
const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');

/*
    user에 관련된 Router를 정의한다.

    # GET     /users/:userId/info                : user 정보 조회
    # GET     /users/:userId/isBan               : user의 isBan 조회
    # PATCH   /users/:userId/info                : user 정보 수정
    # PATCH   /users/:userId/profile/default     : user 프로필사진 기본 이미지로 수정
    # PATCH   /users/:userId/profile             : user 프로필사진 수정
    # PATCH   /users/:userId/nickName            : 닉네임 수정
    # PATCH   /users/:userId/fcm                 : fcm 수정
    # GET     /users/:userId/bookMark            : user 북마크 리스트 조회
    # POST    /users/:userId/bookMark            : user 북마크 목록 수정
    # DELETE  /users/:userId                     : 회원 탈퇴
*/

// user 정보 조회
router.get('/:userId/info', async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    const getUserInfoRes = await userServiceInstance.getUserInfo(req.params.userId);
    if (!getUserInfoRes)
        return res.status(404).json({code : -1, message : '정보 조회 오류'});
    res.status(200).json(getUserInfoRes);
});

// user의 isBan 조회
router.get('/:userId/isBan', async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    const getUserIsBanRes = await userServiceInstance.getUserIsBan(req.params.userId);
    if (!getUserIsBanRes)
        return res.status(404).json({code : -1, message : '정보 조회 오류'});
    res.status(200).json(getUserIsBanRes);
});

// user 정보 수정
router.patch('/:userId/info', validateAccessToken, validateUserInfo, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeUserInfoRes = await userServiceInstance.changeUserInfo(req.params.userId, req.userId, req.body);
    res.status(200).json(changeUserInfoRes);
});

// user 프로필사진 수정 (기본 이미지로 설정)
router.patch('/:userId/profile/default', validateAccessToken,  async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeUserProfileRes = await userServiceInstance.changeUserProfileDefault(req.params.userId, req.userId);
    res.status(200).json(changeUserProfileRes);
});

// user 프로필사진 수정
router.patch('/:userId/profile', validateAccessToken, upload.single('photo'), async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeUserProfileRes = await userServiceInstance.changeUserProfile(req.params.userId, req.userId, req.file.location);
    res.status(200).json(changeUserProfileRes);
});

// 닉네임 수정
router.patch('/:userId/nickName', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeNickNameRes = await userServiceInstance.changeNickName(req.params.userId, req.userId, req.body.nickName, req.body.fcmToken);
    res.status(200).json(changeNickNameRes);
});

// fcm 수정
router.patch('/:userId/fcm', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeFcmRes = await userServiceInstance.changeFCM(req.params.userId, req.userId, req.body.fcmToken);
    res.status(200).json(changeFcmRes);
});

// user 북마크 리스트 조회
router.get('/:userId/bookMark', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    const getBookMarkListRes = await userServiceInstance.getBookMarkProjectList(req.params.userId, req.userId);
    res.status(200).json(getBookMarkListRes);
});

// user 북마크 목록 수정
router.post('/:userId/bookMark', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let bookMarked = req.body.bookMarked;
    let projectId = req.body.projectId;
    let changeBookMarkRes = await userServiceInstance.changeBookMark(req.params.userId, req.userId, bookMarked, projectId);
    res.status(200).json(changeBookMarkRes);
});

// 회원 탈퇴
router.delete('/:userId', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let deleteUserRes = await userServiceInstance.deleteUser(req.params.userId, req.userId);
    res.status(200).json(deleteUserRes);
});

module.exports = router;