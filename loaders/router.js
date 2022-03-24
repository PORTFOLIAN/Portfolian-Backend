const authRouter = require('../routes/auth');
const projectRouter = require('../routes/project');
const userRouter = require('../routes/user');
const headerRouter = require('../routes/header');

module.exports = function loadRouter(app){
    app.use('/oauth', authRouter);
    app.use('/projects', projectRouter);
    app.use('/users', userRouter);
    app.use('/header',headerRouter);
}