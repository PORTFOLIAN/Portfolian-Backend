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
    res.json(verifyTokenRes);
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

let modifyProjectAritcle = async function(req,res,next){

  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
  if (verifyTokenRes === null || verifyTokenRes.code < 0)
  {
    res.json(verifyTokenRes);
    return;
  }

  let modifyArticleRes = await projectServiceInstance.modifyProjectArticle(verifyTokenRes.user, req.params.projectId ,req.body.article, req.body.ownerStack);
  res.json(modifyArticleRes);
}

let getAllProjectAritcles = async function(req,res,next){
  let stackList = req.query.stack;
  let sort = req.query.sort;
  let keyword = req.query.keyword;

  console.log("stackList: ", stackList);
  console.log("sort: ", sort);
  console.log("keyword: ", keyword);

  let ret = await projectServiceInstance.getAllArticles();
  res.json(ret);
}

module.exports = {getAllProjectAritcles, createProjectAritcle, modifyProjectAritcle};