const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require('../services/auth');

const userServiceInstance = new UserService(User,Project);
const authServiceInstance = new AuthService(User);

let findBookMarkList = async function (req,res){
  let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
  if (verifyTokenRes === null || verifyTokenRes.code < 0)
  {
      res.json(verifyTokenRes);
      return;
  }
    
  const bookMarkList = await userServiceInstance.getBookMarkProjectList(verifyTokenRes.userId);
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

let changeNickName = async function (req,res){

    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.json(verifyTokenRes);
        return;
    }
    let changeNickName = await userServiceInstance.changeNickName(req.params.userId, verifyTokenRes.userId, req.body.nickName);
    res.json(changeNickName);
}

let deleteUser = async function (req,res){
    let verifyTokenRes = await authServiceInstance.verifyAccessToken(req.headers);
    if (verifyTokenRes === null || verifyTokenRes.code < 0)
    {
        res.json(verifyTokenRes);
        return;
    }
    let deleteUserRes = await userServiceInstance.deleteUser(req.params.userId, verifyTokenRes.userId);
    res.json(deleteUserRes);
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

module.exports = {findBookMarkList, addUserForTest, getUserHeader, getUserInfo, changeBookMark, changeNickName, deleteUser, };
