require('dotenv').config();
const request = require('request');
const { FCM_KEY } = process.env;

let postFCM = async function (senderId, receiverId, messageContent){

    let senderNicknameInfo = await User.findNicknameById(senderId);
    let fcmTokenInfo = await User.findFCMTokenById(receiverId);
    let fcmKey = "key=" + FCM_KEY;
    const options = {
        uri:'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : fcmKey
        },
        body:{ 
        "to": fcmTokenInfo.fcmToken,
            "priority" : "high",
            "notification" : { 
                "title" : senderNicknameInfo.nickName,
                "body" : messageContent,
                "sound" : "default"
                }
        },
        json:true
    }
    request.post(options, function (error, response, body) {
        console.log(`(chat:send) receiver(${receiverId}) is not in here => fcm`);
    });
}
module.exports = {postFCM};
