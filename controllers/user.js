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
module.exports = {findBookMarkList, addUserForTest};