const upload = require("../S3/S3.js");

let validateUserInfo = async function(req, res, next) {
    console.log(`req.body : ${req}`);
    console.log(req.params);
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
    if (!req.body.photo){
        console.log("no photo");
        req.file.location = "hi";
    }
    else
    {
        console.log("exist photo");
        upload.single('photo');
    }
    next();
}

module.exports = { validateUserInfo };