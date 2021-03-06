const jsonHandler = require('../utils/jsonHandle');
const fetch = require("node-fetch-commonjs");
const jwt = require('jsonwebtoken');
const JWT = require("../utils/jwt");
const User = require("../models/user");
const secretKey = process.env.JWT_SECRET;

let getUserIdByAccessToken = async function(req, res, next) {
    let code = 0;
    let userId = "012345678901234567890123";
    let user = null;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let accessToken = req.headers.authorization.split(' ')[1];
        try {
            const decoded = await jwt.verify(accessToken, secretKey);
            user = await User.findUserById(decoded.userId);
            if(user) {
                req.code = 1;
                userId = decoded.userId;
            }
        } catch(err) {
            console.log(err);
        }
    }

    req.code = code;
    req.userId = userId;
    req.user = user;
    next();
}

module.exports = { getUserIdByAccessToken };