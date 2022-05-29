const authRouter = require('../routes/auth');
const projectRouter = require('../routes/project');
const userRouter = require('../routes/user');
const headerRouter = require('../routes/header');
const chatRouter = require('../routes/chat');
const reportRouter = require('../routes/report');

module.exports = function loadRouter(app){
    app.use('/oauth', authRouter);
    app.use('/projects', projectRouter);
    app.use('/users', userRouter);
    app.use('/header', headerRouter);
    app.use('/chats', chatRouter);
    app.use('/reports', reportRouter);
    app.use(function (error, req, res, next) {
        res.json({ message: error.message });
      });
}