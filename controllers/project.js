const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const ProjectService = require('../services/project');
const AuthService = require("../services/auth");

const userServiceInstance = new UserService(User,Project);
const projectServiceInstance = new ProjectService(User,Project);
const authServiceInstance = new AuthService(User);

let createProjectAritcle = async function(req,res,next){
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

  // project create & team에 findUser추가(역할 설정)
  const createProjectRes = await projectServiceInstance.createProject(verifyTokenRes.user, req.body.article, req.body.ownerStack);
  if (createProjectRes.code <= 0)
  {
    res.json(createProjectRes);
    return;
  }

  //owner의 진행중인 프로젝트에 push
  await userServiceInstance.addDoingProject(verifyTokenRes.user, createProjectRes.newProjectID);
  res.json(createProjectRes);
}

let deleteProject = async function(req, res, next){
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

  let deleteArticleRes = await projectServiceInstance.deleteProject(verifyTokenRes.user, req.params.projectId);
  res.json(deleteArticleRes);
}

let modifyProjectAritcle = async function(req,res,next){

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

  let modifyArticleRes = await projectServiceInstance.modifyProjectArticle(verifyTokenRes.user, req.params.projectId ,req.body.article, req.body.ownerStack);
  res.json(modifyArticleRes);
}

let getAllProjectAritcles = async function(req,res,next){
  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
  if (verifyTokenRes === null || verifyTokenRes.code < 0)
  {
    res.status(401).json(verifyTokenRes);
    return;
  }
  let userId = verifyTokenRes.userId;
  let ret = await projectServiceInstance.getAllArticles(userId, req.query);
  res.json(ret);
}

let getProjectArticle = async function(req, res, next) {
  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
  if (verifyTokenRes === null || verifyTokenRes.code < 0)
  {
    res.status(401).json(verifyTokenRes);
    return;
  }

  try {
    let projectId = req.params.projectId;
    let userId = verifyTokenRes.userId;
    let article = await projectServiceInstance.getProjectArticle(projectId, userId);
    article[code] = 1;
    res.status(200).json(article);
  } catch (e) {
    res.status(200).json({
      code : -1,
      message: "project 조회 실패",
    });
  }
}

module.exports = {getAllProjectAritcles, createProjectAritcle, modifyProjectAritcle, getProjectArticle, deleteProject};

