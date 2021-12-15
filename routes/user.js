const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require("../S3/S3.js");

router.post('/addUserForTest/:userId', userController.addUserForTest);
router.get('/:userId/bookMark', userController.findBookMarkList);
router.post('/upload',upload.single("userImage"), (req,res) => {
    const userImage = req.file;
})



module.exports = router;
