const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require("../S3/S3.js");

router.post('/addUserForTest/:userId', userController.addUserForTest);
router.get('/:userId/bookMark', userController.findBookMarkList);
router.get('/:id/info', userController.getUserInfo);
router.post('/:id/bookMark', userController.changeBookMark);


// router.post('/upload', upload.single('img'), (req, res) => {
//     try {
//         console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 

//         let payLoad = { url: req.file.location };
//         response(res, 200, payLoad);
//     } catch (err) {
//         console.log(err);
//         response(res, 500, "서버 에러")
//     }
// });

module.exports = router;
