const jsonHandler = require('../utils/jsonHandle');
const fetch = require("node-fetch-commonjs");
const jwt = require('jsonwebtoken');
const JWT = require("../utils/jwt");
const secret = process.env.JWT_SECRET;

module.exports = async function getUserIdByAccessToken(req, res, next) {
    let code = 0;
    let userId = "012345678901234567890123";
    let user = null;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let accessToken = req.headers.authorization.split(' ')[1];
        try {
            const decoded = await jwt.verify(token, config.jwtSecretKey);
            user = await this.UserModel.findUserById(decoded.userId);
            if(user) {
                req.code = 1;
                userId = decoded.userId;
            }
        } catch(err) {
        }
    }

    req.code = code;
    req.userId = userId;
    req.user = user;
    next();
}