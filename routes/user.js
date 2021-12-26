const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require("../S3/S3.js");

router.post('/addUserForTest/:userId', userController.addUserForTest);
router.get('/:userId/bookMark', userController.findBookMarkList);
router.get('/:id/info', userController.getUserInfo);
router.post('/:id/bookMark', userController.changeBookMark);
router.get('/:userNickName/bookMark', userController.findBookMarkList);
router.patch('/:userId/nickName',  userController.changeNickName);
router.delete('/:userId', userController.deleteUser);


module.exports = router;
