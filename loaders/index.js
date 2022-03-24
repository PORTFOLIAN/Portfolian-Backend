const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const routerLoader = require('./router.js');

module.exports = function indexLoader(app) {
    mongooseLoader(app);
    expressLoader(app);
    routerLoader(app);
};