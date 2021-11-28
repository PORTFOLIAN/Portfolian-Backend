const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const ProjectService = require('../services/project');

const userServiceInstance = new UserService(User,Project);
const projectServiceInstance = new ProjectService(User,Project);


let createProjectAritcle = async function(req,res){
  
  // token check
  // owner 찾기 => 수정 필요
  const owner = await userServiceInstance.findUserByNickName(req.query.userId);

  // 모집글 내용 유효성 확인
  let validateArticleInfo = projectServiceInstance.validateArticleContents(req.body.article);
  if (validateArticleInfo.code <= 0)
  {
    res.json(validateArticleInfo);
    return;
  }

  // project create & team에 findUser추가(역할 설정)
  const newProjectId = await projectServiceInstance.createProject(owner, req.body.article, req.body.ownerStack);
  
  //owner의 진행중인 프로젝트에 push
  await userServiceInstance.addDoingProject(owner, newProjectId);
  res.json({code : 1, message: "성공적으로 수행되었습니다.", newProjectID : newProjectId});
}

let modifyProjectAritcle = async function(req,res){

  const owner = await userServiceInstance.findUserByNickName(req.query.userId);

  // 모집글 내용 유효성 확인

  let validateProjectLeader = await projectServiceInstance.validateProjectOwner(req.params.projectId, owner);
  if (validateProjectLeader.code <= 0)
  {
    res.json(validateProjectLeader);
    return;
  }

  let validateArticleResult = projectServiceInstance.validateArticleContents(req.body.article);
  if (validateArticleResult.code <= 0)
  {
    res.json(validateArticleResult);
    return;
  }

  let ret = await projectServiceInstance.modifyProjectArticle(owner, req.params.projectId ,req.body.article, req.body.ownerStack);
  await projectServiceInstance.modifyProjectArticle(owner, req.params.projectId ,req.body.article, req.body.ownerStack);
  res.json(ret);
}

module.exports = {createProjectAritcle, modifyProjectAritcle};