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
        let findUser = await this.UserModel.findUserByOauthId(oauthId, channel);
        if (findUser === null)
        {
            // 없으면 회원 만들고 oauthId, channel,refreshToken넣기
            isNew = true;
            findUser = await this.UserModel.createUser(oauthId, channel, refreshToken);
        }
        else if (findUser.nickName === "")
        {
            isNew = true;
        }
        else{
            // 있으면 refreshToken 갱신
            isNew = false;
            await this.UserModel.updateRefreshToken(findUser.id, refreshToken);
        }
        let accessToken = JWT.getAccessToken(findUser.id);
        console.log("login(findUser) : ", findUser);
        return {'code': 1 ,'accessToken': accessToken,'refreshToken': refreshToken, "isNew" : isNew, 'userId': findUser.id};
    }

    async verifyAccessToken(header){
        let decoded = null;
        try {
            if (header.authorization && header.authorization.startsWith('Bearer'))
            {
                let accessToken = header.authorization.split(' ')[1];
                decoded = jwt.verify(accessToken, secret);
                let findUser = await this.UserModel.findUserById(decoded.userId);
                if (findUser === null)
                {
                    return { code: -3, message: "user가 존재하지 않습니다." }
                }
                return { code: 1, userId: decoded.userId, user : findUser };
            }
            else
                return { code: -2, message: "accessToken이 존재하지 않습니다."};
        } catch (err) {
            return { code: -99, message: "만료된 accessToken입니다."};
        }
    }

    async refreshAccessToken(userId, refreshToken){
        if(userId.length != 24)
            return {code : -4, message : "올바르지 않은 userId입니다."};

        let findUser = await this.UserModel.findUserById(userId);
        if (findUser == null || findUser.id != userId)
            return {code : -5, message : "User를 찾을 수 없습니다."};
        try {
            if (findUser.refreshToken != refreshToken)
                return {code: -2, message: "올바르지 않은 refreshToken입니다."};
            jwt.verify(refreshToken, secret);
            let accessToken = JWT.getAccessToken(findUser.id, findUser.oauthId, findUser.channel);
            return {code : 1, accessToken : accessToken};
        } catch (err) {
            return {code : -3, message : "만료된 refreshToken입니다."};
        }
    }
}
module.exports  = AuthService;









