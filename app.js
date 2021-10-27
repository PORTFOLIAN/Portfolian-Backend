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


    mainRouter = require('./routes/main'),
    authRouter = require('./routes/auth'),
    chatRouter = require('./routes/chat'),
    mypageRouter = require('./routes/mypage'),
    projectRouter = require('./routes/project');
    teamRouter = require('./routes/team');
    candidatetRouter = require('./routes/candidate');

    // app.use(
    //     session({ // 옵션은 반드시 넣어줘야 한다.
    //       name: 'portfolian',
    //       resave: false, // 매번 세션 강제 저장
    //       saveUninitialized: true, // 빈 값도 저장
    //       secret: process.env.COOKIE_SECRET, // cookie 암호화 키. dotenv 라이브러리로 감춤
    //       cookie: {
    //         httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
    //         secure: false, // https 프로토콜만 허락하는 지 여부
    //         maxAge: 24 * 60 * 60 * 1000
    //       },
    //       store
    //     })
    // );

app.use('/', mainRouter); //use -> 미들 웨어를 등록해주는 메서드.
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/project', projectRouter);
app.use('/chat', chatRouter);

// ++++++++++++++++++ https://poiemaweb.com/mongoose 참고 해야함

// // CONNECT TO MONGODB SERVER 
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));


const server = app.listen(PORT, () => {
    console.log('Start Server : localhost:3000');
});

module.exports = app;
