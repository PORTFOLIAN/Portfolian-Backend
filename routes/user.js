const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/addUserForTest/:userId', userController.addUserForTest);
router.get('/:userNickName/bookMark', userController.findBookMarkList);
router.patch('/:userId/nickName',  userController.changeNickName);
module.exports = router;
