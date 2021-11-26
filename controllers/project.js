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
  let validate = projectServiceInstance.validateArticleContents(req.body.article);
  if (validate.code <= 0)
  {
    res.json(validate);
    return;
  }

  // project create & team에 findUser추가(역할 설정)
  const newProjectId = await projectServiceInstance.createProject(owner, req.body.article, req.body.ownerStack);
  
  //owner의 진행중인 프로젝트에 push
  await userServiceInstance.addDoingProject(owner, newProjectId);
  res.json({code : 1, message: "성공적으로 수행되었습니다.", newProjectID : newProjectId});
}

let modifyProjectAritcle = async function(req,res){
  /*
  * {
    code : int, //http code
    projectList : [{
        projectId : string,
        title : string,
        stackList : List<string>,
        description : string,
        capacity : int,
        view : int,
       bookMark : bool,
       status : int
       }]
    }
  * */

  // token check
  // owner 찾기 => 수정 필요
  const owner = await userServiceInstance.findUserByNickName(req.query.userId);

  let ret = await projectServiceInstance.modifyProjectArticle(owner, req.params.projectId ,req.body.article, req.body.ownerStack);
  //await projectServiceInstance.modifyProjectArticle(owner, req.params.projectId ,req.body.article, req.body.ownerStack);
  res.json(ret);
}

module.exports = {createProjectAritcle, modifyProjectAritcle};