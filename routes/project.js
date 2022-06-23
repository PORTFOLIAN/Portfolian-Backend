const express = require('express');
const router = express.Router();

// middleware
const upload = require("../S3/S3.js");
const { validateAccessToken } = require('../middlewares/validateAccessToken');
const { getUserIdByAccessToken } = require('../middlewares/getUserIdByAccessToken');
const { validateQueryParm } = require('../middlewares/validateQueryPram');
const { validateArticleContents } = require('../middlewares/validateArticleContents');

// models & service
const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const ProjectService = require('../services/project');
const AuthService = require("../services/auth");

/*
    project에 관련된 Router를 정의한다.
    
    # GET    /projects                    : 모집글 전체 조회
    # GET    /projects/:projectId         : 모집글 상세 조회
    # POST   /projects                    : 모집글 생성
    # PUT    /projects/:projectId         : 모집글 수정
    # PATCH  /projects/:projectId/status  : 모집글 상태 수정
    # DELETE /projects/:projectId         : 모집글 삭제
    # POST   /projects/image              : (마크다운 용) 이미지 업로드
*/

// 모집글 전체 조회
router.get('/', validateQueryParm, getUserIdByAccessToken, async (req, res, next) => {
    const projectServiceInstance = new ProjectService(User,Project);
    try {
        let ret = await projectServiceInstance.getAllArticles(req.userId, req.query.sort, req.query.keyword, req.query.stack);
        ret["code"] = 1;
        return res.status(200).json(ret);
      }catch(e)
      {
        res.status(200).json({code : -1, message : "프로젝트 목록 조회 실패"});
      }
});

// 모집글 상세 조회
router.get('/:projectId', getUserIdByAccessToken, async (req, res, next) => {
    const projectServiceInstance = new ProjectService(User,Project);
    try {
        let article = await projectServiceInstance.getProjectArticle(req.params.projectId, req.userId);
        article["code"] = 1;
        res.status(200).json(article);
      } catch (e) {
        res.status(200).json({code : -1, message: "project 조회 실패"});
      }
});

// 모집글 생성
router.post('/', validateAccessToken, validateArticleContents, async (req, res, next) => {
    const projectServiceInstance = new ProjectService(User,Project);
    const userServiceInstance = new UserService(User,Project);

    const createProjectRes = await projectServiceInstance.createProject(req.user, req.body.article, req.body.ownerStack);
    if (createProjectRes.code <= 0)
        return res.status(200).json(createProjectRes);
  
    //owner의 진행중인 프로젝트에 push
    await userServiceInstance.addDoingProject(req.user, createProjectRes.newProjectID);
    res.status(200).json(createProjectRes);
});

// 모집글 수정
router.put('/:projectId', validateAccessToken, validateArticleContents, async (req, res, next) => {
    const projectServiceInstance = new ProjectService(User,Project);
    let modifyArticleRes = await projectServiceInstance.modifyProjectArticle(req.user, req.params.projectId ,req.body.article, req.body.ownerStack);
    res.status(200).json(modifyArticleRes);
});

// 모집글 상태 수정
router.patch('/:projectId/status', validateAccessToken, async (req, res, next) => {
    const projectServiceInstance = new ProjectService(User,Project);
    let modifyArticleRes = await projectServiceInstance.modifyProjectStatus(req.user, req.params.projectId ,req.body.status);
    res.status(200).json(modifyArticleRes);
});

// 모집글 삭제
router.delete('/:projectId', validateAccessToken, async (req, res, next) => {
    const projectServiceInstance = new ProjectService(User,Project);
    let deleteArticleRes = await projectServiceInstance.deleteProject(req.user, req.params.projectId);
    res.status(200).json(deleteArticleRes);
});

// (마크다운 용) 이미지 업로드
router.post('/image', validateAccessToken, upload.single('photo'), async (req, res, next) => {
    return res.status(200).json({"imageURL": req.file.location})
});

module.exports = router;