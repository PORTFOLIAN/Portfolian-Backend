const jwt = require('jsonwebtoken');
// const redis = require('./redis');
const User = require('../models/user');
const secret = process.env.JWT_SECRET;

module.exports = {
    getAccessToken: function (userId, oauthId, channel){
        return jwt.sign({userId: userId,oauthId: oauthId, channel : channel}, secret, {
            algorithm: 'HS256',
            expiresIn: '1h',
        });
    },

    getRefreshToken: function() {
        return jwt.sign({}, secret, {
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    }
};