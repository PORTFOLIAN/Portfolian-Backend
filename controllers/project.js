const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const ProjectService = require('../services/project');

const userServiceInstance = new UserService(User,Project);
const projectServiceInstance = new ProjectService(User,Project);


let createProject = async function createProject(req,res){
  
  // token check

  // owner 찾기
  const owner = await userServiceInstance.findUserByNickName(req.query.userId);

  // project create & team에 findUser추가(역할 설정)
  const newProjectId = await projectServiceInstance.createProject(owner, req.body.article, req.body.ownerStack);
  console.log('(in router)newProject.Id : ',newProjectId);
  //owner의 진행중인 프로젝트에 push
  await userServiceInstance.addDoingProject(owner, newProjectId);

  res.json(newProjectId);
}

module.exports = {createProject};