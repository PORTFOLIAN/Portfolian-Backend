require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

//for
const https = require('https');
const fs = require('fs');

const {  MONGO_URI } = process.env;
const PORT = 3000;
const hostName = "api.portfolian.site";

const corsOptions = {
    origin: ['http://3.35.89.48:3000','http://localhost:3000','http://portfolian.site:3000','https://portfolian.site:443','https://portfolian.site','https://3.35.89.48'],
    credentials:true
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({limit : '50mb', extended: true}));
app.use(cookieParser());
app.use(express.json());

authRouter = require('./routes/auth'),
projectRouter = require('./routes/project');
userRouter = require('./routes/user');
headerRouter = require('./routes/header');

app.use('/oauth', authRouter);
app.use('/projects', projectRouter);
app.use('/users', userRouter);
app.use('/header',headerRouter);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

// // prod mode
// const options = {
//     ca: fs.readFileSync('/etc/letsencrypt/live/' + hostName + '/fullchain.pem'),
//     key: fs.readFileSync('/etc/letsencrypt/live/' + hostName + '/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/' + hostName + '/cert.pem'),
// };
// https.createServer(options, app).listen(443, () => {
//     console.log('443:번 포트에서 대기중입니다.');
// });

// test mode
const server = app.listen(PORT, () => {
    console.log('Start Server : localhost:3000');
});

module.exports = app;
