const jsonHandler = require('../utils/jsonHandle');
const fetch = require("node-fetch-commonjs");
const jwt = require('jsonwebtoken');
const JWT = require("../utils/jwt");
const secret = process.env.JWT_SECRET;

class AuthService{

    constructor(UserModel) {
        this.UserModel = UserModel;
    }

    async getUserInfo(coperation, access_token) {
        try {
            return await fetch("https://kapi.kakao.com/v2/user/me", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json());
        }catch(e) {
            console.log("error: ",e);
            return {code : -1, message:"올바르지 않은 access_token입니다."}
        }
    };

    async getToekns(oauthId, channel){
        let refreshToken = JWT.getRefreshToken();
        let isNew = true;

        //DB에서 oauthId, channel이용해서 찾기
        let findUserId = await this.UserModel.findUserIdByOauthId(oauthId, channel);
        if (findUserId === null)
        {
            // 없으면 회원 만들고 oauthId, channel,refreshToken넣기
            isNew = true;
            findUserId = await this.UserModel.createUser(oauthId, channel, refreshToken);
        }
        else{
            // 있으면 refreshToken 갱신
            isNew = false;
            findUserId = findUserId.id;
            await this.UserModel.updateRefreshToken(findUserId, refreshToken);
        }
        let accessToken = JWT.getAccessToken(findUserId, oauthId, channel);
        return {'code': 1 ,'accessToken': accessToken,'refreshToken': refreshToken, "isNew" : isNew, 'userId': findUserId};
    }

    async verifyAccessToken(header){
        let decoded = null;
        try {
            if (header.authorization && header.authorization.startsWith('Bearer'))
            {
                let accessToken = header.authorization.split(' ')[1];
                decoded = jwt.verify(accessToken, secret);
                return { code: 1, userId: decoded.userId };
            }
            else
                return { code: -2, message: "accessToken이 존재하지 않습니다."};
        } catch (err) {
            return { code: -1, message: "유효하지 않은 accessToken입니다.",};
        }
    }

    async refreshAccessToken(userId, refreshToken){
        let findUser = await this.UserModel.findUserById(userId);
        if (findUser === null)
            return {code : -1, message : "잘못된 userId입니다."};
        if (findUser.refreshToken !== refreshToken)
            return {code: -2, message: "userId와 refreshToken의 정보가 일치하지 않습니다."};
        try {
            jwt.verify(refreshToken, secret);
            let accessToken = JWT.getAccessToken(findUser.id, findUser.oauthId, findUser.channel);
            return {code : 1, accessToken : accessToken};
        } catch (err) {
            console.log('refreshToken 1: ',findUser.refreshToken ,'\n');
            console.log('refreshToken 2: ',refreshToken ,'\n');
            return {code : -3, message : "만료된 refreshToken입니다."};
        }

    }
}
module.exports  = AuthService;









