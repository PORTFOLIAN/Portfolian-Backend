const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { validateAccessToken } = require('../middlewares/validateAccessToken');
const { validateUserInfo } = require('../middlewares/validateUserInfo');

router.get('/:userId/bookMark', validateAccessToken, userController.findBookMarkList);
router.get('/:userId/info', validateAccessToken, userController.getUserInfo);
router.patch('/:userId/info', validateAccessToken, validateUserInfo, userController.changeUserInfo);
router.post('/:userId/bookMark', validateAccessToken, userController.changeBookMark);
router.patch('/:userId/nickName', validateAccessToken,  userController.changeNickName);
router.delete('/:userId', validateAccessToken, userController.deleteUser);

module.exports = router;