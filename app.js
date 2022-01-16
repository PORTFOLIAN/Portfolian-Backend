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

const whitelist = [ 'http://3.35.89.48:3000/'];
const corsOptions = {
    origin: function(origin, callback){
        const isWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials:true
};

app.use(cors(corsOptions));

app.use(express.json());
// app.use(express.urlencoded({ extends: true}));

authRouter = require('./routes/auth'),
// chatRouter = require('./routes/chat'),
projectRouter = require('./routes/project');
userRouter = require('./routes/user');
headerRouter = require('./routes/header');

app.use('/oauth', authRouter);
app.use('/projects', projectRouter);
// app.use('/chat', chatRouter);
app.use('/users', userRouter);
app.use('/header',headerRouter);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

const server = app.listen(PORT, () => {
    console.log('Start Server : localhost:3000');
});

module.exports = app;
