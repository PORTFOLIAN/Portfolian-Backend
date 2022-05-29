const express = require('express');
const router = express.Router();

// middleware
const { validateAccessToken } = require('../middlewares/validateAccessToken');

// models & service
const Project = require('../models/project');
const User = require('../models/user');
const Report = require('../models/report');
const ReportService = require('../services/report');

/*
    신고에 관련된 Router를 정의한다.

    # POST   /reports/users/{userId}        : 사용자 신고하기
    # POST   /reports/projects/{projectId}  : 프로젝트 신고하기
*/

// 사용자 신고하기
router.post('/users/:userId', validateAccessToken, async (req, res, next) => {
    let reportServiceInstance = new ReportService(User, Project, Report);
    let srcUserId = req.user._id;
    let destUserId = req.params.userId;
    let reason = req.body.reason;

    const resInfo = await reportServiceInstance.createUserReport(srcUserId, destUserId, reason);
    return resInfo;
});

// 프로젝트 신고하기
router.post('/projects/:projectId', validateAccessToken, async (req, res, next) => {
    let reportServiceInstance = new ReportService(User, Project, Report);
    let srcUserId = req.user._id;
    let destProjectId = req.params.projectId;
    let reason = req.body.reason;

    const resInfo = await reportServiceInstance.createProjectReport(srcUserId, destProjectId, reason);
    return resInfo;
});


module.exports = router;