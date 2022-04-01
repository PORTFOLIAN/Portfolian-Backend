const authRouter = require('../routes/auth');
const projectRouter = require('../routes/project');
const userRouter = require('../routes/user');
const headerRouter = require('../routes/header');
const chatRouter = require('../routes/chat');

module.exports = function loadRouter(app){
    app.use('/oauth', authRouter);
    app.use('/projects', projectRouter);
    app.use('/users', userRouter);
    app.use('/header',headerRouter);
    app.use('/chats',chatRouter);
    app.use(function (error, req, res, next) {
        res.json({ message: error.message });
      });
}