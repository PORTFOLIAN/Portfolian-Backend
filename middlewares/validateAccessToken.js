const jsonHandler = require('../utils/jsonHandle');
const fetch = require("node-fetch-commonjs");
const jwt = require('jsonwebtoken');
const JWT = require("../utils/jwt");
const User = require("../models/user");
const secretKey = process.env.JWT_SECRET;

let validateAccessToken = async function(req, res, next) {
    let code = 0;
    let userId = "012345678901234567890123";
    let user = null;
    let decoded = null;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let accessToken = req.headers.authorization.split(' ')[1];
        try {
            decoded = await jwt.verify(accessToken, secretKey);
            user = await User.findUserById(decoded.userId);
        } catch(err) {
            return res.status(401).json({
                code: -99,
                message: '만료된 accessToken입니다.',
              });
        }
        if(user) {
            req.code = 1;
            req.userId = decoded.userId;
            req.user = user;
            next();
        }
        else {
            return res.status(401).json({
                code: -3,
                message: 'user가 존재하지 않습니다.',
              });
        }
    }
    else {
        return res.status(403).json({
            code: -98,
            message: '로그인 후 이용해주세요.',
          });
    }

}

module.exports = { validateAccessToken };