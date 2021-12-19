const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require("../S3/S3.js");

router.post('/addUserForTest/:userId', userController.addUserForTest);
router.get('/:userId/bookMark', userController.findBookMarkList);

// 회원정보 조회 (완료)
// router.get('/header/:id', userController.userHead);


// router.post('/upload',upload.single("userImage"), (req,res) => {
//     const userImage = req.file;
// })



module.exports = router;
