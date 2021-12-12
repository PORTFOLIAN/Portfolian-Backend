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
app.use(express.urlencoded({ extends: true}));

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
const jsonHandler = require('./utils/jsonHandle');


// 회원정보 조회 (수정해야함)
app.get("/header", async (req, res) => {
  const id = req.params.id;
  try {
    const userInfo = await User.findById(id);
    const name = userInfo.nickName
    console.log(name)
    if (!userInfo) {
      return res.status(404).send('404 에러 ');
    }

    res.status(200).send(name);
  } catch (e) {
    res.status(500).json({
      message: "회원정보 조회 실패",
    });
  }
});


//게시글 조회 3번 (api형태로 전송해야함, 클릭시에 조회수 1 상승 , 북마크여부 유효성검사)
app.get("/project/:project", async (req, res) => {
  const project = req.params.project;
  const readProject = await Project.findById(project).populate('leader', '_id photo nickName description').select(' leader status article.title article.projectTime article.condition article.progress article.description article.capacity article.view article.bookMarkCnt article.stackList article.subjectDescription').lean();
  
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
    photo : readProject.leader.photo
  
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
    readProject.article.view++; //수정

    res.status(200).send(readProject);

  } catch (e) {
    res.status(500).json({
      message: "project 조회 실패",
    });
  }

});



// 나의 정보 보기 (13번)
app.get("/user/info/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userInfo = await User.findById(id);
    const name = userinfo.nickName
    consol.log(userInfo)
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
app.delete("/user/delete/:projectId", async (req, res) => {
  // const userId = req.session.id;
  const filter = {'_id' :'61a1d8a1a12f84c536540d06'};
  const projectId  = req.params.projectId;

  const deleteOne = { $pull: { bookMarkList: { $in: [projectId]} } }

  
  // `doc` is the document _after_ `update` was applied because of
  // `new: true`
  let doc = await User.findOne({filter, deleteOne},(err) => {
    if(err){
      console.log(err)
    }
    console.log('good')})
    return await doc
  })



  
// app.delete("/up/delete/:projectId", async (req, res) => {
//   // const userId = req.session.id;
//   const userId = '6178067dd760f83c6faf0a01';
//   const projectId  = req.params.projectId;
//   console.log(projectId)
//   // mongoose
//   await User.updateOne(userId, {$unset: {ninkName : projectId}});

//   // const findId = await User.findById(userId);
//   // console.log(findId);
//   // console.log("============================y")
//   // if (findId) {
//   //   if (true) {
//   //     await User.deleteOne( {bookMarkList : projectId});
//   //     res.status(200).send({ result: "success" });
//   //   } 
//   // } else {
//   //   res.status(400).send({ result: "북마크 존재하지 않음" });
//   // }
// });


//multer
// const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
// app.post('/up', upload.single('img'), (req, res) => {
//   console.log(req.file); 
// });

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

const server = app.listen(PORT, () => {
    console.log('Start Server : localhost:3000');
});

module.exports = app;