module.exports = function handlersFactory(io) {
    mongooseLoader(app);
    expressLoader(app);
    routerLoader(app);
};