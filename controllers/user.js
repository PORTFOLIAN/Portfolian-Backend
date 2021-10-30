const Project = require('../models/project');
const User = require('../models/user');
const UserService = require('../services/user');
const ProjectService = require('../services/project');

const userServiceInstance = new UserService(User,Project);
const projectServiceInstance = new ProjectService(User,Project);

let findBookMarkList = async function (req,res){

    // 굳이 userId필요없을 것 같기도 하고 ~ ~
    //const owner = await userServiceInstance.findUserByNickName(req.params.userId);
    res.json(await userServiceInstance.getBookMarkProjectList(req.params.userId).bookMarkList);
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