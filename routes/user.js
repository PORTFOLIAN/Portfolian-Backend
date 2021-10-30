const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/addUserForTest/:userId', userController.addUserForTest);
router.get('/:userId/bookMark', userController.findBookMarkList);

module.exports = router;