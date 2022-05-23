const express = require('express');
const router = express.Router();

// middleware
const { validateAccessToken } = require('../middlewares/validateAccessToken');

// models & service
const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');

/*
    헤더에 관련된 Router를 정의한다.

    # GET  /header   : 헤더정보 조회
*/

router.get('/', validateAccessToken, async (req, res, next) => {
    let userServiceInstance = new UserService(User,Project);

    let userId = req.userId;
    const headerInfo = await userServiceInstance.getUserHeader(userId);
    if (!headerInfo) 
        return res.status(403).json(userId);
    res.status(200).json(headerInfo);
});

module.exports = router;
