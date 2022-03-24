const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require("../S3/S3.js");
const { validateAccessToken } = require('../middlewares/validateAccessToken');

router.get('/:userId/bookMark', validateAccessToken, userController.findBookMarkList);
router.get('/:userId/info', validateAccessToken, userController.getUserInfo);
router.patch('/:userId/info', validateAccessToken, upload.single('photo'), userController.changeUserInfo);
router.post('/:userId/bookMark', validateAccessToken, userController.changeBookMark);
router.patch('/:userId/nickName', validateAccessToken,  userController.changeNickName);
router.delete('/:userId', validateAccessToken, userController.deleteUser);

module.exports = router;