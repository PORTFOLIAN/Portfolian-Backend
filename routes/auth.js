const express = require('express');
const router = express.Router();
const fetch = require('node-fetch-commonjs');

const getUserInfo = async (access_token) => {
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


router.post('/:coperation/access', async (req, res) => {
  console.log("body : ", req.body);
  console.log("accessToken : ", req.body.token);
  let userInfo = await getUserInfo(req.body.token);
  console.log("userInfo: ",userInfo);
  if(userInfo.code) {
    res.json(userInfo);
    return;
  }
  res.json({message:"성공 이제 jwt보내야함",userInfo});
})

module.exports = router;