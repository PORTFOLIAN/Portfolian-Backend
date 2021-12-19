require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const path = require('path');
const User = require('./models/user');
const Project = require('./models/project');


const {  MONGO_URI } = process.env;
const PORT = 3000;

app.use(express.json());
// app.use(express.urlencoded({ extends: true}));

mainRouter = require('./routes/main'),
authRouter = require('./routes/auth'),
chatRouter = require('./routes/chat'),
mypageRouter = require('./routes/mypage'),
projectRouter = require('./routes/project');
teamRouter = require('./routes/team');
candidatetRouter = require('./routes/candidate');
userRouter = require('./routes/user');

app.use('/', mainRouter);
app.use('/oauth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/projects', projectRouter);
app.use('/chat', chatRouter);
app.use('/users', userRouter);

// 회원정보 조회 (완료)
app.get("/header/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userInfo = await User.findById(id);
    const user = {
      name : userInfo.nickName,
      profile : userInfo.photo
    } 
    const headerInfo = {
      user : user
    }
    console.log(headerInfo)
    if (!headerInfo) {
      return res.status(404).send('404 에러 ');
    }

    res.status(200).send(headerInfo);
  } catch (e) {
    res.status(500).json({
      message: "회원정보 조회 실패",
    });
  }
});


//게시글 조회 3번 
app.get("/project/:project", async (req, res) => {
  const project = req.params.project;
  const readProject = await Project.findByIdAndUpdate(project, {$inc : {"article.view" : 1}},{ new: true}).populate('leader', '_id photo nickName description stackList').select(' leader status article.title article.projectTime article.condition article.progress article.description article.capacity article.view article.bookMarkCnt article.stackList article.subjectDescription').lean();

  const contentInfo = {
    subjectDescription : readProject.article.subjectDescription,
    projectTime : readProject.article.projectTime,
    recruitmentCondition : readProject.article.condition,
    progress : readProject.article.progress,
    description : readProject.article.description,
  }
  const leaderInfo = {
    userId : readProject.leader._id,
    nickName : readProject.leader.nickName,
    description : readProject.leader.description,
    photo : readProject.leader.photo,
    stackList : readProject.leader.stackList
  
  }
  const projectInfo = {
    code : 1,
    title  : readProject.article.title,
    projectId : readProject._id,
    stackList : readProject.article.stackList,
    contents : contentInfo,
    capacity : readProject.article.capacity,
    view : readProject.article.view,
    bookMark : readProject.article.bookMarkCnt,
    status : readProject.status,
    leader : leaderInfo
}
  
 
  try { 
    if (!project) {
      return res.status(404).send('404 에러');
    }

    res.status(200).send(readProject);

  } catch (e) {
    res.status(500).json({
      message: "project 조회 실패",
    });
  }

});



// 나의 정보 보기 (13번)
app.get("/users/:userNickname/info", async (req, res) => {
  const nickName = req.params.userNickname;
  const userInfo = await User.findOne({nickName : nickName}).select('_id nickName description stackList photo github email').lean();
  try {
    if (!userInfo) {
      return res.status(404).send(userInfo);
    }
    console.log(id);
    res.status(200).send(userInfo);
  } catch (e) {
    
    res.status(500).json({
      message: "회원정보 조회 실패",
    });
  }
});

//북마크 삭제 (수정해야함 )
app.post("/users/:userNickname/bookMark", async (req, res) => {
  console.log(req.body.like)
  const nickName = req.params.userNickname;
  const bookMarkCnt = req.body.like;
  const projectId = req.body.projectId;

  if (bookMarkCnt == 'true'){
    const bookMarkOnUser = await User.findOneAndUpdate({ name: nickName }, { $push: { bookMarkList: projectId } }).select('_id');
    const id = bookMarkOnUser._id
    console.log(id)
    const bookMarkOnProject =  await Project.findOneAndUpdate({ _id: projectId }, { $set: { "article.bookMarkCnt": 'true'} , $push : {"article.bookMarkUserList" : id } });
    
    try {
      if (!bookMarkOnProject) {
        return res.status(404).send(bookMarkOnProject);
      }
      res.status(200).send(bookMarkOnProject);
    } catch (e) {
      
      res.status(500).json({
        message: "북마크 추가 실패",
      });
    }  }
  else {
    const bookMarkOffUser = await User.findOneAndUpdate({ name: nickName }, { $pull: { bookMarkList: projectId } }).select('_id');
    const id = bookMarkOffUser._id
    console.log(id)
    const bookMarkOffProject =  await Project.findOneAndUpdate({ _id: projectId }, { $set: { "article.bookMarkCnt": 'false' }, $pull : {"article.bookMarkUserList" : id } });
    try {
      if (!bookMarkOffProject) {
        return res.status(404).send(bookMarkOffProject);
      }
      res.status(200).send(bookMarkOffProject);
    } catch (e) {
      
      res.status(500).json({
        message: "북마크 제거 실패",
      });
    } 
  }
  })



mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

const server = app.listen(PORT, () => {
    console.log('Start Server : localhost:3000');
});

module.exports = app;