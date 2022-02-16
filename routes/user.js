const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require("../S3/S3.js");

router.get('/:userId/bookMark', userController.findBookMarkList);
router.get('/:userId/info',userController.getUserInfo);
router.patch('/:userId/info',upload.single('photo'), userController.changeUserInfo);
router.post('/:userId/bookMark', userController.changeBookMark);
router.patch('/:userId/nickName',  userController.changeNickName);
router.delete('/:userId', userController.deleteUser);

module.exports = router;