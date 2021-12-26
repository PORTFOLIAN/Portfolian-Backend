require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const User = require('./models/user');
const Project = require('./models/project');


const {  MONGO_URI } = process.env;
const PORT = 3000;

let corsOption = {
origin: 'http://localhost:3000', // 허락하는 요청 주소
credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}
app.use(cors(corsOption));

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
headerRouter = require('./routes/header')

app.use('/', mainRouter);
app.use('/oauth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/projects', projectRouter);
app.use('/chat', chatRouter);
app.use('/users', userRouter);
app.use('/header',headerRouter)

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

const server = app.listen(PORT, () => {
    console.log('Start Server : localhost:3000');
});

module.exports = app;
