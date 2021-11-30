const express = require('express');
const router = express.Router();
const {  url, clientID, clientSecret, redirectUri, userInfoUrl } = process.env;

class Kakao {
  constructor(code) {
    this.url = url;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.code = code;
    this.userInfoUrl = userInfoUrl;
  }
}

const getAccessToken = async (options) => {
  try {
    return await fetch(options.url, {
      method: 'POST',
      headers: {
        'content-type':'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: qs.stringify({
        grant_type: 'authorization_code',
        client_id: options.clientID,
        client_secret: options.clientSecret,
        redirectUri: options.redirectUri,
        code: options.code,
      }),
    }).then(res => res.json());
  }catch(e) {
    logger.info("error", e);
  }
};

const getUserInfo = async (url, access_token) => {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': `Bearer ${access_token}`
      }
    }).then(res => res.json());
  }catch(e) {
    logger.info("error", e);
  }
};

const getOption = (coperation, code)=> {
  switch(coperation){
    case 'kakao':
      return new Kakao(code);
      break;
    case 'google':
      // return new Google(code);
      break;
    case 'naver':
      // return new Naver(code);
      break;
  }
}

app.get(`/oauth/:coperation/callback`, async (req, res) => {
  const coperation = req.params.coperation;
  const code = req.param('code');
  const options = getOption(coperation, code);
  const token = await getAccessToken(options);
  const userInfo = await getUserInfo(options.userInfoUrl, token.access_token);

  res.send(token);
})

module.exports = router;