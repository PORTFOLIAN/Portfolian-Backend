const express = require('express');
const router = express.Router();

// middleware
const { validateAccessToken } = require('../middlewares/validateAccessToken');
const { validateUserInfo } = require('../middlewares/validateUserInfo');

// models & service
const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');

/*
    user에 관련된 Router를 정의한다.

    # GET     /users/:userId/info       : user 정보 조회
    # PATCH   /users/:userId/info       : user 정보 수정
    # PATCH   /users/:userId/nickName   : 닉네임 수정
    # GET     /users/:userId/bookMark   : user 북마크 리스트 조회
    # POST    /users/:userId/bookMark   : user 북마크 목록 수정
    # DELETE  /users/:userId            : 회원 탈퇴
*/

// user 정보 조회
router.get('/:userId/info', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    const userInfo = await userServiceInstance.getUserInfo(req.userId);
    if (!userInfo)
        return res.status(404).json('나의 정보보기 오류');
    res.status(200).json(userInfo);
});

// user 정보 수정
router.patch('/:userId/info', validateAccessToken, validateUserInfo, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeUserInfoRes = await userServiceInstance.changeUserInfo(req.params.userId, req.userId, req.body, req.file.location);
    res.status(200).json(changeUserInfoRes);
});

// 닉네임 수정
router.patch('/:userId/nickName', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    let changeNickName = await userServiceInstance.changeNickName(req.params.userId, req.userId, req.body.nickName, req.body.fcmToken);
    res.status(200).json(changeNickName);
});

// user 북마크 리스트 조회
router.get('/:userId/bookMark', validateAccessToken, async (req, res, next) => {
    const userServiceInstance = new UserService(User,Project);
    const bookMarkList = await userServiceInstance.getBookMarkProjectList(req.params.userId, req.userId);
    res.status(200).json(bookMarkList);
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