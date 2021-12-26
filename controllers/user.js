const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const ProjectService = require('../services/project');

const userServiceInstance = new UserService(User,Project);
const projectServiceInstance = new ProjectService(User,Project);

let findBookMarkList = async function (req,res){
    // 굳이 userId필요없을 것 같기도 하고 ~ ~
    //우선 NickName으로 찾음
    const bookMarkList = await userServiceInstance.getBookMarkProjectList(req.params.userId);
    //console.log(bookMarkList);
    res.json(bookMarkList);
}

let addUserForTest = async function (req,res){
    console.log(req.query.stack);
    const users = new User({
        nickName : req.params.userId,
        channel : 'kakao',
        email : 'testtesttest@gmail.com',
        stackList : req.query.stack, //stackList
        });
    
     users.save()
          .then ((result) => {
            res.send(result)
          })
          .catch((err)=>{
            console.log(err);
          });

}


let getUserHeader = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    const headerInfo = await userServiceInstance.getUserHeader(id);

    if (!headerInfo) {
      return res.status(404).send('404 에러 ');
    }

    res.status(200).send(headerInfo);
  } catch (e) {
    res.status(500).json({
      message: "회원정보 조회 실패",
    });
  }
}

let getUserInfo = async (req,res) => {
  const userId = req.params.id;
  
  try {
    const userInfo = await userServiceInstance.getUserInfo(userId);
    if (!userInfo) {
      return res.status(404).send('나의 정보보기 오류');
    }
    res.status(200).send(userInfo);
  } catch (e) {
    
    res.status(500).json({
      message: "회원정보 조회 실패",
    });
  }
}

let changeBookMark = async (req,res) => {
  const userId = req.params.id;
  const bookMarkCnt = req.body.like;
  const projectId = req.body.projectId;
  
  try {
    
    const result = await userServiceInstance.changeBookMark(userId,bookMarkCnt,projectId);

    if (!result) {
            console.log(result)

      return res.status(404).send('북마크 변경 실패');

    }
    res.status(200).send('북마크 변경 성공');
  } catch (e) {
    res.status(500).json({
      message: "북마크 변경 실패",
    });
  }
  
}

module.exports = {findBookMarkList, addUserForTest, getUserHeader, getUserInfo, changeBookMark};