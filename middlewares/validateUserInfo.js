const upload = require("../S3/S3.js");

let validateUserInfo = async function(req, res, next) {
    if (!req.body.nickName)
        req.body.nickName = "";
    if (!req.body.description)
        req.body.description = ""; 
    if (!req.body.stack)
        req.body.stack = []; 
    if (!req.body.github)
        req.body.github = ""; 
    if (!req.body.mail)
        req.body.mail = "";
    next();
}

module.exports = { validateUserInfo };