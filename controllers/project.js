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

  // project create & team에 findUser추가(역할 설정)
  const newProjectId = await projectServiceInstance.createProject(owner, req.body.article, req.body.ownerStack);
  
  //owner의 진행중인 프로젝트에 push
  await userServiceInstance.addDoingProject(owner, newProjectId);
  res.json(newProjectId);
}

let modifyProjectAritcle = async function(req,res){
  
  // token check
  // owner 찾기 => 수정 필요
  const owner = await userServiceInstance.findUserByNickName(req.query.userId);

  let ret = await projectServiceInstance.modifyProjectArticle(owner, req.params.projectId ,req.body.article, req.body.ownerStack);
  //await projectServiceInstance.modifyProjectArticle(owner, req.params.projectId ,req.body.article, req.body.ownerStack);
  res.json(ret);
}

module.exports = {createProjectAritcle, modifyProjectAritcle};