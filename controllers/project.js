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
  if (!req.query.sort || !req.query.keyword || !req.query.stack) {
    res.json({code: -1, message: "조건(sort, keyword, stack)을 모두 입력해주세요"});
    return;
  }
  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);

  try {
    let userId = verifyTokenRes.userId;
    let ret = await projectServiceInstance.getAllArticles(userId, req.query.sort, req.query.keyword, req.query.stack);
    ret["code"]=1;
    res.json(ret);
  }catch(e)
  {
    console.log(e)
    res.json({code : -1, message : "프로젝트 목록 조회 실패"});
  }
}

let getProjectArticle = async function(req, res, next) {
  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
  let projectId = req.params.projectId;
  let userId = verifyTokenRes.userId;
  try {
    let article = await projectServiceInstance.getProjectArticle(projectId, userId);
    article["code"] = 1;
    res.status(200).json(article);
  } catch (e) {
    console.log(e)
    res.status(200).json({code : -1, message: "project 조회 실패"});
  }
}

let createImage = async function(req, res, next){

}

module.exports = {getAllProjectAritcles, createProjectAritcle, modifyProjectAritcle, getProjectArticle, deleteProject, createImage};

